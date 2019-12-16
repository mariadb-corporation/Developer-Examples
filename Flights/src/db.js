var fs = require("fs")
var mariadb = require('mariadb');

/*
const pool = mariadb.createPool({
    host: 'localhost', 
    user:'dba', 
    port: 3307,
    password: 'demo_password',
    database: 'flights',
    connectionLimit: 5
});
*/

//const serverCert = [fs.readFileSync("skysql_root.pem", "utf8")];

const pool = mariadb.createPool({
  host: 'sky0001276.mdb0001390.db.skysql.net', 
  user:'DB00001323', 
  port: 5002,
  password: "xqjvKYE6q7yE~J8X0N1,1i|6",
  database: 'flights',
  connectionLimit: 5
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