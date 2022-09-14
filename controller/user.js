const jwt = require("../utils/jwt");
const db = require("../db/connect/db");
const logger = require("../utils/logger");
const menu = require("../db/menuData/admin.json");

const database = "userinfo";

module.exports = {
  /**
   * 用户登录
   */
  login(req, res) {
    let { userName, password } = req.query;
    let sql = `select * from ${database} where username='${userName}' and password='${password}'`;

    // 打印日志
    logger.info(
      `[${req.method}-${res.statusMessage}-${req.originalUrl}-${
        req.ip
      }]: 用户登录:${JSON.stringify(req.query)}`
    );

    db.queryDB(sql, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        if (data.length === 0) {
          res.status(401).json({});
        } else {
          // 生成token
          let payload = { username: data[0].username };
          let token = jwt.encrypt(
            payload,
            10 * 60 // 签署10min令牌期限
          );
          res.status(200).json({
            data: token,
            menu,
          });
        }
      }
    });
  },
  /**
   * 用户注册
   */
  register(req, res) {
    let { userName, password } = req.query;
    let code = -1;
    let searchSql = `select * from ${database} where userName='${userName}'`;
    let addSql = `insert into ${database} values ('${userName}', '${password}')`;

    // 打印日志
    logger.info(
      `[${req.method}-${res.statusMessage}-${req.originalUrl}-${
        req.ip
      }]: 用户注册:${JSON.stringify(req.query)}`
    );

    db.queryDB(searchSql, (err, data) => {
      if (err) {
        console.log(err);
        res.send(`query error: ${err}`);
        return;
      } else {
        console.log(data);
        // 用户名是否已存在
        if (data.length === 0) {
          db.queryDB(addSql, (err) => {
            if (err) {
              console.log(err);
              res.json({
                code,
              });
              return;
            } else {
              code = 1;
              res.json({
                code,
              });
              return;
            }
          });
        } else {
          code = 0;
          res.json({
            code,
          });
          return;
        }
      }
    });
  },
};
