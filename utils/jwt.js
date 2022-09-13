const jwt = require("jsonwebtoken");
const secret = require("./jwtsecret");

const Token = {
  // 加密函数
  // 生成token：jwt.sign(payload, secretOrPrivateKey, [options, callback])
  encrypt(data, time) {
    return jwt.sign(
      data,
      secret.jwtSecret, // 引入密钥
      { expiresIn: time } // 签署time s令牌期限
    );
  },
  // 解密函数
  // jwt.verify(token,str) 参数token表示需要解密的令牌，str为密钥
  decrypt(token) {
    try {
      let data = jwt.verify(token, secret.jwtSecret);
      return {
        token: true,
        data,
      };
    } catch (error) {
      return {
        token: false,
        data: error,
      };
    }
  },
};

module.exports = Token;
