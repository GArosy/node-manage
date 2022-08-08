// 建立Mysql连接并导出
const express = require('express'); // 引入express
const config = require('./config'); // 获取配置信息
const $mysql = require('mysql');    // 引入mysql 
module.exports = $mysql.createConnection(config);  // mysql.createConnection 方法创建连接实例
