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
    result.repoUrl = result.branch && result.ownerName && result.repoName ? `https://github.com/${result.ownerName}/${result.repoName}/tree/${result.branch}` : ''
  } catch (err) {
    console.error('getGitHubRepoName error', err)
  }
  return result
}

exports.checkFile = checkFile
exports.readAsLine = readAsLine
exports.formatDate = formatDate
exports.genHeaderItem = genHeaderItem
exports.getRepo = getRepo
