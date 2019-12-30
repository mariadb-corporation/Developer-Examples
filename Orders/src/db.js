var mariadb = require('mariadb');

var configs = [
  {
    host: 'localhost', 
    user:'root', 
    password: 'password',
    database: 'orders',
    port: 3309,
    multipleStatements: true,
    connectionLimit: 5
  },
  {
    host: 'localhost', 
    user:'root', 
    password: 'password',
    database: 'orders',
    port: 3310,
    multipleStatements: true,
    connectionLimit: 5
  }
];

function getPool(config) {
  return mariadb.createPool(config);
}

module.exports={
    getConnection: function(config_id){
      console.log(config_id);
      return new Promise(function(resolve,reject){
        getPool(configs[config_id]).getConnection().then(function(connection){
          resolve(connection);
        }).catch(function(error){
          reject(error);
        });
      });
    }
  } 