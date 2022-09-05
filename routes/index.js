const express = require("express");
const db = require("../db/connect/db");
const logger = require("../utils/logger");
const mall = require('./mall')
const user = require('./user')

const router = express.Router();

router.all("/", (req, res, next) => {
  res.send("Welcome to node-manage!");
  logger.info(
    `[${req.method}-${res.statusMessage}-${req.originalUrl}-${req.ip}]: Server Sent A Welcome Message`
  );
});

router.get("/api/get", (req, res, next) => {
  /* 使用 connection.query 来执行 sql 语句 */
  // 第一个参数为 sql 语句，可以透过 js 自由组合
  // 第二个参数为回调函数，err 表示查询异常、第二个参数则为查询结果（这里的查询结果为多个用户行）
  db.queryDB("select * from test", (err, data) => {
    if (err) {
      res.send("query error");
      return;
    } else {
      // 将 MySQL 查询结果作为路由返回值，这里返回的是json类型的数据
      res.json({
        method: "GET",
        data: data,
      });
    }
    // 输出日志
    logger.info(
      `[${req.method}-${res.statusMessage}-${req.originalUrl}-${req.ip}]: Server linked the database`
    );
  });
});

module.exports = router;
