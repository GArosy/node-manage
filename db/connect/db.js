// 建立Mysql连接并导出
const mysql = require('mysql');    // 引入mysql 
const config = require('./config'); // 获取配置信息

module.exports = {
  queryDB(sql, params, callback) {
    // 每次使用的时候需要创建链接，数据操作完成之后要关闭连接
    const connection = mysql.createConnection(config); // 创建mysql连接实例
    connection.connect((err) => {
      if (err) {
        console.log("数据库链接失败");
        throw err;
      }

      // 开始数据操作
      /* 使用 connection.query 来执行 sql 语句 */
      // 第一个参数为 sql 语句，可以透过 js 自由组合
      // 第二个参数为回调函数，err 表示查询异常、第二个参数则为查询结果（这里的查询结果为多个用户行）
      connection.query(sql, params, (err, results, fields) => {
        if (err) {
          console.log("数据操作失败");
          throw err;
        }
        callback && callback(results, fields); // results作为数据操作后的结果，fields作为数据库连接的一些字段
        // 停止链接数据库
        connection.end((err) => {
          if (err) {
            console.log("关闭数据库连接失败");
            throw err;
          }
        });
      });
    });
  },
};
