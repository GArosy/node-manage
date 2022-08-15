const { Router } = require("express");
const db = require("../db/connect/db");
const logger = require("../utils/logger");

const router = Router();

/**
 * 获取商品列表
 */
router.get("/getGoods", (req, res) => {
  const database = 'goodslist';  
  const { name, page = 1, limit = 20 } = req.query;
  const sqlLen = `select * from ${database} limit ${(page - 1) * limit}, ${limit}`;
  db.queryDB(sqlLen, (err, data) => {
    if (err) {
      res.send(`query error: ${err}`);
      return;
    } else {
      // 将 MySQL 查询结果作为路由返回值，这里返回的是json类型的数据
      res.json({
        method: "GET",
        data: data,
      });
    }
  });
  logger.info(
    `[${req.method}-${res.statusMessage}-${req.originalUrl}-${
      req.ip
    }]: query=${JSON.stringify(req.query)} | params=${JSON.stringify(
      req.params
    )}`
  );
});

module.exports = router;
