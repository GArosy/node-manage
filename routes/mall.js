const { Router } = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const db = require("../db/connect/db");
const logger = require("../utils/logger");

const router = Router();
const database = "goodslist";
const host = "localhost";

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
        auth: req.auth
      });
    }
  });
});

/**
 * 添加商品
 */
router.post("/createGoods", (req, res) => {
  // 为商品添加随机id
  const addSql = `insert into ${database} values (replace(UUID(),"-",""), '${req.query.name}', '${req.query.price}', '${req.query.amount}', '${req.query.type}', '${req.query.photo}', '${req.query.descText}', '${req.query.descHtml}')`;

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
  const editSql = `update ${database} set name='${req.query.name}',price='${req.query.price}',amount='${req.query.amount}',type='${req.query.type}',photo='${req.query.photo}',descText='${req.query.descText}',descHtml='${req.query.descHtml}' where id='${req.query.id}'`;

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

/**
 * 上传图片
 */
// 配置multer storage，保存路径、文件名
const storage = multer.diskStorage({
  // 要保存的文件夹
  destination: (req, file, cb) => {
    cb(null, "./upload");
  },
  // 文件名
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
// 配置multer fileFilter，过滤文件，处理originalname乱码bug
function fileFilter(req, file, cb) {
  file.originalname = Buffer.from(file.originalname, "latin1").toString("utf8");
  cb(null, true);
}
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
const upload = multer({ storage: storage, fileFilter });
// 上传单个文件内容，file为上传时文件的字段名称
router.post("/uploadGoodsPics", upload.single("file"), (req, res) => {
  // 使用json解析FormData数据
  /**
   *   返回的req.file字段
   *   fieldname: 'file',
   *   originalname: 'å¾®ä¿¡å\x9B¾ç\x89\x87_20210215222948.jpg',
   *   encoding: '7bit',
   *   mimetype: 'image/jpeg',
   *   size: 208475
   */
  // console.log(JSON.parse(JSON.stringify(req.file)));
  const { originalname, size } = JSON.parse(JSON.stringify(req.file));
  const goodsId = JSON.parse(JSON.stringify(req.body.goodsId));

  // 图片信息储存至数据库
  let sql_code = "0";
  const sql = `insert into goodspic values ('${goodsId}','${req.file.originalname}','${req.file.mimetype}','${req.file.size}','http://${host}:3000/static/${req.file.filename}')`;
  db.queryDB(sql, (err, data) => {
    if (err) {
      console.log(`query error: ${err}`);
      return;
    } else {
      sql_code = "1";
    }
  });

  // 打印日志
  logger.info(
    `[${req.method}-${res.statusMessage}-${req.originalUrl}]: 上传图片:${req.file.originalname} `
  );
  return res.json({
    res_code: "1",
    sql_code,
    originalname,
    size,
    url: `http://${host}:3000/static/${req.file.filename}`,
  });
});

/**
 * 回显已上传的图片列表
 */
router.get("/showGoodsPicsList", (req, res) => {
  // 忽视参数为空的请求
  if (!req.query.goodsId) {
    return;
  }
  const sql = `select * from goodspic where goodsid='${req.query.goodsId}'`;
  db.queryDB(sql, (err, data) => {
    if (err) {
      console.log(`query error: ${err}`);
      return;
    } else {
      res.json({
        code: 1,
        method: "GET",
        list: data,
      });
    }
  });
});

/**
 * 删除已上传的图片
 */
router.get("/removeGoodsPics", (req, res) => {
  const sql = `delete from goodspic where originalname='${req.query.name}'`;
  // console.log(req.query);
  db.queryDB(sql, (err, data) => {
    if (err) {
      console.log(`query error: ${err}`);
      return;
    } else {
      // 使用fs删除文件
      //    注意：nodejs中使用相对路径是不可靠的，尽量使用__dirname
      fs.unlink(path.join(__dirname, `../upload/${req.query.name}`), (e) => {});
      // 打印日志
      logger.info(
        `[${req.method}-${res.statusMessage}-${req.originalUrl}]: 删除图片:${req.query.name} `
      );
      return res.json({
        code: 1,
        method: "GET",
        query: req.query,
      });
    }
  });
});

module.exports = router;
