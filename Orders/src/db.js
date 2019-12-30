var mariadb = require('mariadb');

var pools = [
  mariadb.createPool({
    host: 'localhost', 
    user:'root', 
    password: 'password',
    database: 'orders',
    port: 3309,
    multipleStatements: true,
    connectionLimit: 5
  }),
  mariadb.createPool({
    host: 'localhost', 
    user:'root', 
    password: 'password',
    database: 'orders',
    port: 3310,
    multipleStatements: true,
    connectionLimit: 5
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