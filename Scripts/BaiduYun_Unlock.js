/*
 * NAME            : BaiduYun_Unlock
 * AUTHOR          : Nobyda
 * REPO            : https://github.com/JY-Mar/PxyRes
 * UPDATER         : JY-Mar
 * UPDATED         : 2026-04-28 12:03:23 +0800
 * DESC            : 百度网盘整合版 解锁 SVIP、在线视频倍率/清晰度（动态数值）
 */

// #region QuantumultX
// [rewrite_local]
// https:\/\/pan\.baidu\.com\/rest\/\d\.\d\/membership\/user url script-response-body https://jy-mar.github.io/PxyRes/Scripts/BaiduYun_Unlock.js

// [mitm]
// hostname = pan.baidu.com
// #endregion

// #region Surge4 / Loon
// [Script]
// http-response https:\/\/pan\.baidu\.com\/rest\/\d\.\d\/membership\/user requires-body=1,max-size=0,script-path=https://jy-mar.github.io/PxyRes/Scripts/BaiduYun_Unlock.js

// [MITM]
// hostname = pan.baidu.com
// #endregion

if ($response.body) {
  let obj = JSON.parse($response.body)
  // 1. 保持服务器原有的 request_id 和 currenttime 逻辑，确保合法性
  //    如果服务器没返回，则使用当前本地时间戳
  obj.currenttime = obj.currenttime || Math.floor(Date.now() / 1000)
  obj.request_id = obj.request_id || 7501873289383874371
  // 2. 覆盖原有的 product_infos，确保 ID 为 1 (SVIP)
  obj.product_infos = [
    {
      product_id: '5310897792128633390',
      start_time: 1417260485,
      end_time: 2147483647, // 锁定至 2038 年
      buy_time: '1417260485',
      cluster: 'offlinedl',
      detail_cluster: 'offlinedl',
      product_name: 'gz_telecom_exp'
    },
    {
      product_name: 'svip2_nd',
      product_description: '超级会员',
      function_num: 0,
      start_time: 1672502399,
      buy_description: '',
      buy_time: 0,
      product_id: '1',
      auto_upgrade_to_svip: 0,
      end_time: 2147483647, // 锁定至 2038 年
      cluster: 'vip',
      detail_cluster: 'svip',
      status: 0
    }
  ]
  // 3. 清空广告提示（借鉴 NobyDa 逻辑）
  obj.reminder = {
    reminderWithContent: [],
    advertiseContent: []
  }
  $done({ body: JSON.stringify(obj) })
} else {
  $done({})
}
