const fs = require("fs");
var mariadb = require('mariadb');
require('dotenv').config();

const serverCert = [fs.readFileSync("skysql_chain.pem", "utf8")]

const pool = mariadb.createPool({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    multipleStatements: true,
    connectionLimit: 5,
    ssl: {
      ca: serverCert
    }
});

module.exports={
    getConnection: function(){
      return new Promise(function(resolve,reject){
        pool.getConnection().then(function(connection){
          resolve(connection);
        }).catch(function(error){
          reject(error);
        });
      });
    }
  } 