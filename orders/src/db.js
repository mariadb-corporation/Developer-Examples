var mariadb = require('mariadb');
require('dotenv').config();

// SSL (e.g. SkySQL) connections 
// * Remember to change the location of "skysql_chain.pem" to wherever you placed it!
// * To use just uncomment the two lines below and the 'ssl' property (and value) within the connection pool configuration

//const fs = require("fs");
//const serverCert = [fs.readFileSync("skysql_chain.pem", "utf8")];

var pools = [
  mariadb.createPool({
    host: process.env.DB_HOST_1, 
    user: process.env.DB_USER_1, 
    password: process.env.DB_PASS_1,
    port: process.env.DB_PORT_1,
    database: process.env.DB_NAME_1,
    multipleStatements: true,
    connectionLimit: 5
    /*
    ,ssl: {
      ca: serverCert
    }*/
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