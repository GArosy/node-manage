const { createLogger, format, transports } = require("winston");
const fs = require("fs");
const path = require("path");

const env = process.env.NODE_ENV || "development";

// 调用 winston 库中的 createLogger 函数来初始化记录器
module.exports = createLogger({
  /**
   * 在 transports 文件传输器对象中，可以提供一个文件名 filename 将日志存储在文件中。
   * 默认情况下，日志记录未格式化，并打印为带有两个参数的 JSON 字符串、日志消息和等级。
   */
  format: format.combine(
    format.label({ label: path.basename(process.mainModule.filename) }),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" })
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(
          (info) =>
            `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
        )
      ),
    }),
    new transports.File({
      filename: "logs/serverInfo.log",
      // 日志级别，只在 console.info 方式下使用 winston
      level: "info",
      format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.align(),
        format.printf((info) =>
          info.level === "info"
            ? `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
            : ''
        )
      ),
    }),
    // winston 允许设置多种 transport
    new transports.File({
      filename: "logs/serverError.log",
      level: "error",
      format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.align(),
        format.printf(
          (err) =>
            `${err.timestamp} ${err.level} [${err.label}]: ${err.message}`
        )
      ),
    }),
  ],
});
