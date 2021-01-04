/**
 * @type {string}
 * todo baseUrl后台服务器IP地址
 */

const baseUrl = 'https://starlemon.cn/p2p'	

var aes = require('./aesCommon')
/**
 * @param url 交易码
 * @param params 传递至后台服务器的请求参数，格式：string/object/ArrayBuffer
 * @returns {Promise<unknown>}
 */

export default (url, params, session) => {

  let token = ''
  wx.getStorage({
    key: 'token',
    success(res) {
      //token = res.data
      token ="111111"
    }
  })
  return new Promise((resolve, reject) => {
    //网络请求
    const jsonStr = JSON.stringify(params)
    let aesData = {}
    if (params) {

      aesData = aes.Encrypt(jsonStr)
    }
    wx.request({
      url: `${ baseUrl }${ url }`,
      data: aesData,
      timeout: 8000,
      method: 'POST',
      header: {
        // 'content-type': 'application/x-www-form-urlencoded'
        'Authorization': wx.getStorageSync('token'),
        'sessionId': session
      },
      success: function (res) { //服务器返回数据
        // const {
        //   code,
        //   status,
        //   message
        // } = res.data
        const strRes = aes.Decrypt(res.data)
        const {
          code,
          status,
          message
        } = strRes
        if (code === 200 || code === 201) {
          resolve(strRes)
        } else if (status === 500) {
          wx.showModal({
            title: '提示',
            content: message,
            success: res => {
              if (res.confirm) {
                //清空缓存
                try {
                  wx.removeStorageSync('token')
                  wx.removeStorageSync('userInfo')
                  wx.removeStorageSync('isLogin')
                } catch (error) {
                  wx.showToast({
                    title: '清除缓存token失败',
                    icon: 'none',
                    duration: 2000
                  })
                }
                wx.redirectTo({
                  url: "/pages/login/login?current=my"
                });
              } else if (res.cancel) {
                //取消
              }
            }
          })
        } else {
          resolve(strRes)
        }
      },
      fail: function (e) {
        reject('网络出错');
        wx.showToast({
          title: '网络异常，请重试',
          icon: 'none',
          duration: 2000
        })
      }
    })
  });
}