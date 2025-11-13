const fs = require('fs')
const path = process.argv[2]

if (!fs.existsSync(path)) {
  console.error('File not found:', path)
  process.exit(1)
}

let filecontent = fs.readFileSync(path, 'utf8')

// 替换REPO
const regexp_repo = /(\s*#\s*REPO(-LOON)?\s*:\s*https:\/\/github.com\/JY-Mar\/scat-proxy\/tree\/main)(.*)/
if (regexp_repo.test(filecontent)) {
  filecontent = filecontent.replace(regexp_repo, '$1/Loon/Rules')
}

// 替换UPDATED
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
  }).format(new Date())
)
const yyyy = zone8date.getFullYear()
const MM = zone8date.getMonth() + 1
const dd = zone8date.getDate()
const HH = zone8date.getHours()
const mm = zone8date.getMinutes()
const ss = zone8date.getSeconds()
function padZero(num) {
  return num < 10 ? '0' + num : num
}
const ZZ = 'GMT+0800'
const regexp_updated = /(\s*#\s*UPDATED\s*:\s*)(.*)/
if (regexp_updated.test(filecontent)) {
  filecontent = filecontent.replace(regexp_updated, '$1' + `${padZero(yyyy)}-${padZero(MM)}-${padZero(dd)} ${padZero(HH)}:${padZero(mm)}:${padZero(ss)} ${ZZ}`)
}

const RULETYPE = [
  'DOMAIN',
  'DOMAIN-SUFFIX',
  'DOMAIN-KEYWORD',
  'GEOIP',
  'IP-CIDR',
  'IP-CIDR6',
  'SRC-IP-CIDR',
  'SRC-PORT',
  'DEST-PORT',
  'PROCESS-NAME',
  'PROCESS-PATH',
  'IPSET',
  'RULE-SET',
  'SCRIPT',
  'MATCH',
  'TOTAL'
]

// 移除所有已有统计值
// 统计正则
const regexp = new RegExp(`\(# \(${RULETYPE.join('|')}\)\\s*:\\s*\)\\d+`, 'g')
if (regexp.test(filecontent)) {
  filecontent = filecontent.replace(regexp, '')
}
// 移除最后一行文件头到第一行内容之间的空格行（保留一行）
const lines = filecontent.split(/\r?\n/)
let above = []
let insert = []
let below = []
const lastHeaderIndex = lines.findLastIndex((v) => /(# [a-zA-Z0-9-_]+\s*:\s*)\d+/.test(v))
const firstContentIndex = lines.findIndex((v, k) => k > lastHeaderIndex && (/^\s*#\s*.+/.test(v) || new RegExp(`^\\s*\(${RULETYPE.join('|')}\),\.+`).test(v)))
if (lastHeaderIndex > -1 && firstContentIndex > -1 && lastHeaderIndex < firstContentIndex) {
  // 空格多于一行
  above = lines.slice(0, lastHeaderIndex + 1)
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
  return `# ${v[0]}`.padEnd(18, ' ') + ': ' + v[1]
})
const insert_temp_1 = insert_temp.map((v) => v[1])
const insert_temp_sum = insert_temp_1.length > 0 ? insert_temp_1.reduce((a, b) => a + b) : 0
insert.push(`# ${RULETYPE.at(-1)}`.padEnd(18, ' ') + ': ' + insert_temp_sum)
insert.push('')

// 替换文件头里的数值
filecontent = [...above, ...insert, ...below].join('\r\n')

fs.writeFileSync(path, filecontent, 'utf8')
