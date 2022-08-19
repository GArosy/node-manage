const { Router } = require("express");
const fs = require("fs");
const qs = require("qs");
const multiparty = require("multiparty");
const multer = require("multer");
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
  // 搜索
  const sqlSearch = `select * from ${database} where name='${name}'`;
  // 拼接查询语句
  const sql = name
    ? sqlSearch + ";" + sqlCount + ` where name='${name}'`
    : sqlLen + ";" + sqlCount;

  db.queryDB(sql, (err, data) => {
    if (err) {
      res.send(`query error: ${err}`);
      return;
    } else {
      // 打印日志
      logger.info(
        `[${req.method}-${res.statusMessage}-${req.originalUrl}-${
          req.ip
        }]: 获取列表:${JSON.stringify(req.query)}`
      );
      // 将 MySQL 查询结果作为路由返回值，这里返回的是json类型的数据
      res.json({
        method: "GET",
        list: data[0],
        count: data[1][0]["count(*)"],
      });
    }
  });
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
      // 打印日志
      logger.info(
        `[${req.method}-${res.statusMessage}-${req.originalUrl}-${
          req.ip
        }]: 添加项:${JSON.stringify(req.query)}`
      );
      return res.send(`添加成功: ${JSON.stringify(req.query)}`);
    }
  });
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
      // 打印日志
      logger.info(
        `[${req.method}-${res.statusMessage}-${req.originalUrl}-${
          req.ip
        }]: 编辑项:${JSON.stringify(req.query)}`
      );
      return res.send(`编辑成功: ${JSON.stringify(req.query)}`);
    }
  });
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
      // 打印日志
      logger.info(
        `[${req.method}-${res.statusMessage}-${req.originalUrl}-${
          req.ip
        }]: 删除项:${JSON.stringify(req.query)} `
      );
      return res.send(`删除成功: ${JSON.stringify(req.query)}`);
    }
  });
});

// 上传图片
const storage = multer.diskStorage({
  // 要保存的文件夹
  destination: (req, file, cb) => {
    cb(null, "./upload");
  },
  // 在文件夹下的文件名
  filename: (req, file, cb) => {
    cb(null, req.body.id + '.jpg');
  },
});
// 创建upload文件夹
const createFolder = (folder) => {
  try {
    fs.accessSync(folder);
  } catch (e) {
    fs.mkdirSync(folder);
  }
};
const uploadFolder = "./upload/";
createFolder(uploadFolder);
// 实例化multer
const upload = multer({
  storage: storage,
});
// 上传单个文件内容，file为上传时文件的字段名称
router.post("/uploadGoodsPics", upload.single("file"), (req, res) => {
  // 使用json解析FormData数据
  const { originalname, size, destination } = JSON.parse(
    JSON.stringify(req.file)
  );
  const id = JSON.parse(JSON.stringify(req.body.id));

  // 打印日志
  logger.info(
    `[${req.method}-${res.statusMessage}-${req.originalUrl}-${req.ip}]: 上传图片:${originalname} `
  );
  return res.json({
    res_code: "1",
    id,
    originalname,
    size,
    destination,
  });
});

module.exports = router;
