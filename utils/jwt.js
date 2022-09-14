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
  // 验证中间件
  // jwt.verify(token,str) 参数token表示需要解密的令牌，str为密钥
  decrypt(req, res, next) {
    let token = req.headers.authorization;
    token = token ? token.split(" ")[1] : null;
    if (!token) {
      return res.status(401).end();
    } else {
      try {
        let data = jwt.verify(token, secret.jwtSecret);
        req.auth = data;
        next();
      } catch (error) {
        console.log(error);
        if (error.name === "UnauthorizedError") {
          return res.status(401).send("invalid token...");
        } else if (error.name === "TokenExpiredError") {
          return res.status(401).send("token expired...");
        }else{
          next(error);
        }
      }
    }
  },
};

module.exports = Token;
