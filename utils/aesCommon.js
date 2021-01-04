var CryptoJS = require('./crypto-js')

var key = CryptoJS.enc.Latin1.parse('abcdef0123456789');
var iv = CryptoJS.enc.Latin1.parse('abcdef0123456789');

// 加密
function EncryptData(data) {
  
  var srcs = CryptoJS.enc.Utf8.parse(data);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
}

// 解密
function DecryptData(data) {
  var stime = new Date().getTime();
  var decrypt = CryptoJS.AES.decrypt(data, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });

  var decryptRes = CryptoJS.enc.Utf8.stringify(decrypt)
  var isJson = checkIsJson(decryptRes)
  if (!isJson) {
    decrypt = CryptoJS.AES.decrypt(decryptRes, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    decryptRes = CryptoJS.enc.Utf8.stringify(decrypt)
  }

  var result = JSON.parse(decryptRes.toString());
  var etime = new Date().getTime();
  // console.log("DecryptData Time:" + (etime - stime));
  
  return result;
}

function checkIsJson(str) {
  if (typeof str === "string") {
    try {
      var obj = JSON.parse(str)
      if (isObject(obj) && obj) {
        return true
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }
}

function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

//暴露接口
module.exports.Encrypt = EncryptData
module.exports.Decrypt = DecryptData