var mariadb = require('mariadb');

// Local Connection
const pool = mariadb.createPool({
    host: 'localhost', 
    user:'root', 
    password: 'password',
    database: 'Places',
    multipleStatements: true,
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