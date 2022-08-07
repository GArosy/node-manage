var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/test', function(req, res, next) {
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

module.exports = router;
