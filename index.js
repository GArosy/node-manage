// 引入express
const express = require("express");
const app = express();

// 新建一个简单的get请求接口
app.get("/api/get", (rec, res) => {
  // 返回的是json数据
  res.send('Hello express')
  res.json({
    method: 'GET',
    data: [{
      name: 'gao arosy',
      age: 24
    }]
  })
});

const server = app.listen(8081, ()=> {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`应用实例，访问地址为 http://${host}:${port}`);
})
