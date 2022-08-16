const { Router } = require("express");
const db = require("../db/connect/db");
const logger = require("../utils/logger");

const router = Router();
const database = "goodslist";

/**
 * 获取商品列表
 */
router.get("/getGoods", (req, res) => {
  const { name, page = 1, limit = 20 } = req.query;
  // 获取列表
  const sqlLen = `select * from ${database} limit ${
    (page - 1) * limit
  }, ${limit}`;
  // 获取列表大小
  const sqlCount = `select count(*) from ${database}`;
  // 拼接查询语句
  const sql = sqlLen + ";" + sqlCount;

  db.queryDB(sql, (err, data) => {
    if (err) {
      res.send(`query error: ${err}`);
      return;
    } else {
      // 将 MySQL 查询结果作为路由返回值，这里返回的是json类型的数据
      res.json({
        method: "GET",
        list: data[0],
        count: data[1][0]["count(*)"],
      });
    }
  });

  // 打印日志
  logger.info(
    `[${req.method}-${res.statusMessage}-${req.originalUrl}-${
      req.ip
    }]: 获取列表:${JSON.stringify(req.query)}`
  );
});

/**
 * 添加商品
 */
router.post("/createGoods", (req, res) => {
  // 为商品添加随机id
  const addSql = `insert into ${database} values (replace(UUID(),"-",""), '${req.query.name}', '${req.query.price}', '${req.query.amount}', '${req.query.type}', '${req.query.photo}', '${req.query.description}')`;

  db.queryDB(addSql, (err, data) => {
    if (err) {
      res.send(`query error: ${err}`);
      return;
    } else {
      res.send(`添加成功: ${JSON.stringify(req.query)}`)
    }
  });

  // 打印日志
  logger.info(
    `[${req.method}-${res.statusMessage}-${req.originalUrl}-${
      req.ip
    }]: 添加项:${JSON.stringify(req.query)}`
  );
});

/**
 * 编辑商品
 */
router.post("/editGoods", (req, res) => {
  const editSql = `update ${database} set name='${req.query.name}',price='${req.query.price}',amount='${req.query.amount}',type='${req.query.type}',photo='${req.query.photo}',description='${req.query.description}' where id='${req.query.id}'`;

  db.queryDB(editSql, (err, data) => {
    if (err) {
      res.send(`query error: ${err}`);
      return;
    } else {
      res.send(`编辑成功: ${JSON.stringify(req.query)}`)
    }
  });

  // 打印日志
  logger.info(
    `[${req.method}-${res.statusMessage}-${req.originalUrl}-${
      req.ip
    }]: 编辑项:${JSON.stringify(req.query)}`
  );
});

/**
 * 删除商品
 */
router.get("/delGoods", (req, res) => {
  const delSql = `delete from ${database} where id='${req.query.id}'`;

  db.queryDB(delSql, (err, data) => {
    if (err) {
      res.send(`query error: ${err}`);
      return;
    } else {
      res.send(`删除成功: ${JSON.stringify(req.query)}`)
    }
  });

  // 打印日志
  logger.info(
    `[${req.method}-${res.statusMessage}-${req.originalUrl}-${
      req.ip
    }]: 删除项:${JSON.stringify(req.query)} `
  );
});

module.exports = router;
