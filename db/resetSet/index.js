var $sql = require("../connect/db");
function sqlQuery(sql,callback){
    $sql.query(sql,(err,result)=>{
        if(err){
            return console.log("错误")
        }
        callback(result)
    })
}
module.exports = sqlQuery;