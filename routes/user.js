const { Router } = require("express");
const jwt = require('jsonwebtoken')
const fs = require("fs");
const path = require("path");
const db = require("../db/connect/db");
const logger = require("../utils/logger");

const router = Router();
const database = "userinfo";
const host = "localhost";


/**
 * 用户注册
 */
router.post('/register', (req, res)=>{
  let {userName, password} = req.query;
  let searchSql = `select * from ${database} where userName='${userName}'`
  let addSql = `insert into ${database} values '${userName}', '${password}'`;
  db.queryDB(searchSql, (err, data)=>{
    if (err) {
      console.log(err);
      res.send(`query error: ${err}`);
      return;
    } else {
      // 用户名是否已存在
      if (data=[]) {
        res.json({
          code: "1",
        });
      } else {
        res.json({
          code: "0",
        });
      }
    }
  })
})

/**
 * 用户登录
 */
router.post('/login', (req, res)=>{
  let {userName, password} = req.body;
  let sql = `select * from ${database} where username=${userName} and password=${password}`;
  let arr = [userName, password]


})

module.exports = router