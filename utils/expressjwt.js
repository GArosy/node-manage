const { expressjwt } = require("express-jwt");
const secret = require("./jwtsecret");

module.exports =  expressjwt({
  // 加密时所用的密匙
  secret: secret.jwtSecret,
  // 设置算法
  algorithms: ["HS256"],
  // 无token请求不进行解析，并且抛出异常
  // credentialsRequired: false,
}).unless({
  // 白名单
  path: ["/api/user/login", "/api/user/register"],
});


