const fs = require("fs");
var mariadb = require('mariadb');

// Place a .pem file within the project root to use this line
//const serverCert = [fs.readFileSync("skysql_chain.pem", "utf8")];

var pools = [
  mariadb.createPool({
    host: '<host_address>', 
    user:'<user>', 
    password: '<password>',
    database: 'orders',
    port: 5001,
    multipleStatements: true,
    connectionLimit: 5,
    ssl: {
      //ca: serverCert
      rejectUnauthorized: false
    }
  }),
  mariadb.createPool({
    host: '<host_address>', 
    user:'<user>', 
    password: '<password>',
    database: 'orders',
    port: 5002,
    multipleStatements: true,
    connectionLimit: 5,
    ssl: {
      //ca: serverCert
      rejectUnauthorized: false
    }
  }),
  mariadb.createPool({
    host: '<host_address>', 
    user:'<user>', 
    password: '<password>',
    database: 'orders',
    port: 5003,
    multipleStatements: true,
    connectionLimit: 5,
    ssl: {
      //ca: serverCert
      rejectUnauthorized: false
    }
  })
];

module.exports={
    getConnection: function(config_id){
      return new Promise(function(resolve,reject){
        pools[config_id].getConnection().then(function(connection){
          resolve(connection);
        }).catch(function(error){
          reject(error);
        });
      });
    }
  } 