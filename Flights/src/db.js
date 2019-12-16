var fs = require("fs")
var mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: 'Host_Here', 
  user:'Username_Here', 
  port: 5002,
  password: "Password_Here",
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