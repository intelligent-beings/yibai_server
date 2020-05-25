
const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring')      //解析参数
const bodyParser = require('body-parser');
const prot = 3000;
const host = '127.0.0.1';


var server = http.createServer((req, res) => {
   const pathname = url.parse(req.url).pathname;
   const obj_data = JSON.parse(url.parse(req.url, true).query.values)   //parse 将url 解析成对象 t
   res.writeHead(200, {
      'Access-Control-Allow-Origin': "*",//允许请求的网址
      'Access-Control-Allow-Headers': 'Token',//允许携带的字段名称
      'Access-Control-Allow-Methods': 'POST,PUT,DELETE,GET',//允许的方法类型
      'Access-Control-Max-Age': '10000',
      'Content-Type': 'text/plain'
   })
   if (pathname === '/favicon.ico') return
   const MongoClient = require('mongodb').MongoClient;
   const db_url = 'mongodb://localhost:27017';
   const assert = require('assert');
   
   const dbName = 'yibai'; //Database Name
   const client = new MongoClient(db_url, { useUnifiedTopology: true });
   console.log(obj_data.username,'obj_data');
   


   // Use connect method to connect to the Server
   client.connect(function (err, client) {
      assert.equal(null, err);
      console.log(" ok client dbs");
      const db = client.db(dbName);  //连接到具体数据 
      if (pathname === '/registered') {
         // db.collection('registered').find()
         db.collection('registered').insertOne(obj_data,(err,res)=>{
      
            assert.equal(null, err);
            console.log('插入成功');
            client.close(); //每一个功能是独立的会话！必须关闭数据库，
                           // 不能多个功能共用一个关闭
            
         });
         db.collection('registered').updateOne({name:obj_data.name},{$set:{username:obj_data.username}},(err,res)=>{
            console.log('upData ok');
            client.close();
            
         })
      }
      
   });
   console.log(pathname);

   res.end('ok')
});

server.listen(3000, host, () => {
   console.log('127.0.0.1:3000')
})
