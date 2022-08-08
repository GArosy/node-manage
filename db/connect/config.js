// 启动配置
module.exports = {
  port: 3000, // express 服务启动端口
  /* 数据库相关配置 */
  db: {
    host: "47.100.121.250", // 主机名
    port: 3306, // MySQL 默认端口为 3306
    user: "root", // 使用 root 用户登入 MySQL
    password: "Wxr02070.",  // MySQL 密码
    database: "test", // 指定使用的数据库
  }
};