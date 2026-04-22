const path = require('path')
const fs = require('fs')
const { genHeaderItem, formatDate, getRepo, checkFile, readAsLine } = require('./utils')

const filepath = process.argv[2]

if (!checkFile(filepath)) {
  process.exit(1)
}

const basename = path.basename(filepath)
const filename = path.basename(basename, '.yaml')
let filecontent = fs.readFileSync(filepath, 'utf8')

const RULETYPE = [
  'DOMAIN',
  'DOMAIN-SUFFIX',
  'DOMAIN-KEYWORD',
  'GEOIP',
  'IP-CIDR',
  'IP-CIDR6',
  'SRC-IP-CIDR',
  'SRC-PORT',
  'DST-PORT',
  'PROCESS-NAME',
  'PROCESS-filepath',
  'IPSET',
  'RULE-SET',
  'SCRIPT',
  'MATCH',
  'TOTAL'
]

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
const regexp_repo = /(\s*#\s*REPO(-CLASH)?\s*:\s*)(.*)/g
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
filecontent = [
  genHeaderItem('NAME', filename),
  genHeaderItem('AUTHOR', getRepo().ownerName),
  genHeaderItem('REPO', getRepo().repoUrl + '/Clash/Rules'),
  genHeaderItem('UPDATED', formatDate())
].join('\n') + '\n' + filecontent

// 移除最后一行文件头到第一行内容之间的空格行（保留一行）
const lines = filecontent.split(/\r?\n/)
let above = []
let insert = []
let below = []
const lastHeaderIndex = lines.findLastIndex((v) => /(# [a-zA-Z0-9-_]+\s*:\s*)\d+/.test(v))
const firstContentIndex = lines.findIndex((v) => /^payload:$/.test(v))
if (lastHeaderIndex > -1 && firstContentIndex > -1 && lastHeaderIndex < firstContentIndex) {
  // 空格多于一行
  above = lines.slice(0, lastHeaderIndex + 1)
  below = lines.slice(firstContentIndex)
} else if (lastHeaderIndex <= -1 && firstContentIndex > -1) {
  above = []
  below = lines.slice(firstContentIndex)
} else {
  console.error('yaml line error')
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
