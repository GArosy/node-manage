var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
const logger = require("./utils/logger");

var indexRouter = require("./routes/index");
var mallRouter = require("./routes/mall");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// express默认使用morgan打印日志
// app.use(logger('dev'));
app.use(express.json());``
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// 设置CORS跨域
app.use((req,res,next)=>{
  // 设置响应头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', '*');
  next()
})

// 挂载静态资源
app.use("/static", express.static("public"));
// 挂载路由模块
app.use("/", indexRouter);
app.use("/api/mall", mallRouter);

/**
 * 错误处理
 */
// 捕获 500 错误
app.use((err, req, res, next) => {
  res.status(500).send("500 Server Error");
  logger.error(
    `${err.status || 500} - ${res.statusMessage} - ${err.message} - ${
      req.originalUrl
    } - ${req.method} - ${req.ip}`
  );
});

// 中间件捕获 404 错误，并定向到错误处理
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send("404 Not Found");
  logger.error(
    `[${req.method}-${res.statusMessage}-${req.originalUrl}-${req.ip}]: ${err.message}`
  );
});

module.exports = app;
