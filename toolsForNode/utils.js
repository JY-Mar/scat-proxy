const path = require('path')
const fs = require('fs')

function checkFile(filepath) {
  try {
    fs.accessSync(filepath, fs.constants.F_OK)
  } catch (error) {
    console.error('File not found:', filepath)
    return false
  }
  const filepathStat = fs.statSync(filepath)
  if (!filepathStat.isFile()) {
    console.error('Not a file:', filepath)
    return false
  }
  return true
}

function readAsLine(filepath) {
  if (!checkFile(filepath)) {
    return []
  }
  return fs
    .readFileSync(filepath, 'utf8')
    .split('\n')
    .map((v) => v.replace(/\r/g, ''))
}

function padZero(num) {
  return num < 10 ? '0' + num : num
}

function formatDate(date = new Date(), formatter = 'YYYY-MM-DD HH:mm:ss ZZ') {
  const zone8date = new Date(
    new Intl.DateTimeFormat('zh-CN', {
      timeZone: 'Asia/Shanghai',
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date)
  )
  const time = {
    year: zone8date.getFullYear(),
    month: zone8date.getMonth() + 1,
    day: zone8date.getDate(),
    hour: zone8date.getHours(),
    minute: zone8date.getMinutes(),
    second: zone8date.getSeconds(),
    timezone: 'GMT+8'
  }

  const matcher = [
    ['YYYY', 'year'],
    ['YY', 'year'],
    ['MM', 'month-full'],
    ['M', 'month'],
    ['DD', 'day-full'],
    ['D', 'day'],
    ['HH', 'hour-full'],
    ['H', 'hour'],
    ['mm', 'minute-full'],
    ['m', 'minute'],
    ['ss', 'second-full'],
    ['s', 'second'],
    ['ZZ', 'timezone'],
    ['Z', 'timezone']
  ]

  let result = String(formatter)

  matcher.forEach((matcherItem) => {
    const matcherKey = matcherItem[0]
    let matcherValue = matcherItem[1]
    if (result.indexOf(matcherKey) > -1) {
      if (matcherValue.endsWith('-full')) {
        matcherValue = matcherValue.replace('-full', '')
        result = result.replace(new RegExp(matcherKey, 'g'), padZero(time[matcherValue]))
      } else {
        result = result.replace(new RegExp(matcherKey, 'g'), time[matcherValue])
      }
    }
  })

  return result
}

function genHeaderItem(label, value) {
  return `# ${String(label ?? '')}`.padEnd(18, ' ') + ': ' + String(value ?? '')
}

function getRepo() {
  const result = {
    repoUrl: '',
    repoName: '',
    branch: '',
    ownerName: ''
  }
  try {
    const gitConfigPath = path.join(process.cwd(), '.git', 'config')
    const content = fs.readFileSync(gitConfigPath, 'utf8')

    const regex_branch = /\[branch\s+"([^"]+)"\]/
    const match_branch = content.match(regex_branch)
    result.branch = match_branch[1] || ''

    // 匹配 git@github.com:owner/repo.git 或 https://github.com/owner/repo.git
    const regex_url = /github\.com[:/]([^/]+)\/([^/.]+)(\.git)?/
    const match_url = content.match(regex_url)
    result.ownerName = match_url[1] || ''
    result.repoName = match_url[2] || ''
    // result.repoUrl = result.branch && result.ownerName && result.repoName ? `https://github.com/${result.ownerName}/${result.repoName}/tree/${result.branch}` : ''
    result.repoUrl = result.branch && result.ownerName && result.repoName ? `https://github.com/${result.ownerName}/${result.repoName}` : ''
  } catch (err) {
    console.error('getGitHubRepoName error', err)
  }
  return result
}

/**
 * 规则类型
 */
const RULETYPE = [
  // #region 域名规则 (Domain Rules)
  'DOMAIN', // 精确匹配域名
  'DOMAIN-SUFFIX', // 匹配域名后缀（所有子域名）
  'DOMAIN-KEYWORD', // 域名包含关键字
  'DOMAIN-SET', // 【Clash】匹配大量域名
  'DOMAIN-REGEX', // 【Clash】域名正则匹配
  // #endregion
  // #region IP 地址规则 (IP Rules)
  'IP-CIDR', // IPv4 段
  'IP-CIDR6', // IPv6 段
  'GEOIP', // 国家 / 地区 IP（CN、US、JP…）
  'SRC-IP-CIDR', // 来源 IPv4 内网 / 设备 IPv4 段
  'SRC-IP-CIDR6', // 【Clash】来源 IPv6 内网 / 设备 IPv6 段
  'IP-SET', // 【Clash】匹配大量 IP 段
  // #endregion
  // #region 端口与协议
  'DST-PORT', // 【Clash】目标端口
  'DEST-PORT', // 【Loon】目标端口，等价于'DST-PORT'
  'SRC-PORT', // 源端口
  'PROTOCOL', // 【Loon】协议（TCP/UDP）
  // #endregion
  // #region 客户端与应用识别 (Client Identification)
  'USER-AGENT', // 【Loon】匹配 UA
  'PROCESS-NAME', // 【Clash】进程名
  'PROCESS-PATH', // 【Clash】进程路径
  'PACKAGE-NAME', // 【Clash】应用包名
  // #endregion
  // #region URL 类（PATH/REGEX）
  'URL-REGEX', // 【Loon】URL 正则匹配
  // #endregion
  // #region HTTP 请求头（含 USER-AGENT）
  'HTTP-HEADER', // 【Loon】匹配 HTTP 请求头中的特定字段
  // #endregion
  // #region 规则集与高级
  'RULE-SET', // 【Clash】引用外部规则文件（.list/.txt）
  'SCRIPT', //  JavaScript 自定义规则
  'MATCH', // 【Clash】兜底
  'FINAL', // 【Loon】兜底
  // #endregion

  'TOTAL' // 仅用于统计
]

/**
 * 重写文件头
 * @param {'yaml' | 'lsr' | 'list'} extname - 文件扩展名，默认值为 yaml
 */
function headerRerwite(extname = 'yaml') {
  const filepath = process.argv[2]

  if (!checkFile(filepath)) {
    process.exit(1)
  }

  const basename = path.basename(filepath)
  const filename = path.basename(basename, `.${extname}`)
  let filecontent = fs.readFileSync(filepath, 'utf8')

  // 1. 移除 文件名
  const regexp_name = /(\s*#\s*NAME\s*:\s*)(.*)/g
  if (regexp_name.test(filecontent)) {
    filecontent = filecontent.replace(regexp_name, '')
  }

  // 2. 移除 AUTHOR
  const regexp_author = /(\s*#\s*AUTHOR\s*:\s*)(.*)/g
  if (regexp_author.test(filecontent)) {
    filecontent = filecontent.replace(regexp_author, '')
  }

  // 3. 移除 REPO
  const regexp_repo = /(\s*#\s*REPO\s*:\s*)(.*)/g
  if (regexp_repo.test(filecontent)) {
    filecontent = filecontent.replace(regexp_repo, '')
  }

  // 4. 移除 UPDATED
  const regexp_updated = /(\s*#\s*UPDATED\s*:\s*)(.*)/g
  if (regexp_updated.test(filecontent)) {
    filecontent = filecontent.replace(regexp_updated, '')
  }

  // 5. 移除所有已有统计值
  // 统计正则
  const regexp = new RegExp(`\(# \(${RULETYPE.join('|')}\)\\s*:\\s*\)\\d+`, 'g')
  if (regexp.test(filecontent)) {
    filecontent = filecontent.replace(regexp, '')
  }

  // 6. 重新插入基本信息
  filecontent =
    [genHeaderItem('NAME', filename), genHeaderItem('AUTHOR', getRepo().ownerName), genHeaderItem('REPO', getRepo().repoUrl), genHeaderItem('UPDATED', formatDate())].join('\n') + '\n' + filecontent

  // 移除最后一行文件头到第一行内容之间的空格行（保留一行）
  const lines = filecontent.split(/\r?\n/)
  let above = []
  let insert = []
  let below = []
  const lastHeaderIndex = lines.findLastIndex((v) => /(# [a-zA-Z0-9-_]+\s*:\s*)\d+/.test(v))
  const firstContentIndex = lines.findIndex((v, k) => {
    if (extname === 'yaml') {
      return /^payload:$/.test(v)
    } else if (extname === 'lsr' || extname === 'list') {
      return k > lastHeaderIndex && (/^\s*#\s*.+/.test(v) || new RegExp(`^\\s*\(${RULETYPE.join('|')}\),\.+`).test(v))
    }
  })
  if (lastHeaderIndex > -1 && firstContentIndex > -1 && lastHeaderIndex < firstContentIndex) {
    // 空格多于一行
    above = lines.slice(0, lastHeaderIndex + 1)
    below = lines.slice(firstContentIndex)
  } else if (lastHeaderIndex <= -1 && firstContentIndex > -1) {
    above = []
    below = lines.slice(firstContentIndex)
  } else {
    console.error(`${extname} line error`)
    process.exit(1)
  }

  // 生成新的统计数据
  const insert_temp = []
  RULETYPE.forEach((type) => {
    if (type !== RULETYPE.at(-1)) {
      const regexp = new RegExp(`^\(?!\\s*#\)\.*${type},`, 'gm')
      if (regexp.test(filecontent)) {
        insert_temp.push([type, (filecontent.match(regexp) || []).length])
      }
    }
  })
  insert = insert_temp.map((v) => {
    return genHeaderItem(v[0], v[1])
  })
  const insert_temp_1 = insert_temp.map((v) => v[1])
  const insert_temp_sum = insert_temp_1.length > 0 ? insert_temp_1.reduce((a, b) => a + b) : 0
  insert.push(`# ${RULETYPE.at(-1)}`.padEnd(18, ' ') + ': ' + insert_temp_sum)
  insert.push('')

  // 替换文件头里的数值
  filecontent = [...above, ...insert, ...below].join('\r\n')

  fs.writeFileSync(filepath, filecontent, 'utf8')
}

exports.checkFile = checkFile
exports.readAsLine = readAsLine
exports.formatDate = formatDate
exports.genHeaderItem = genHeaderItem
exports.getRepo = getRepo
exports.RULETYPE = RULETYPE
exports.headerRerwite = headerRerwite
