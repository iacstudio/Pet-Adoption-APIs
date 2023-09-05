var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'u156920401_pet_adoption',
  password : 'C>yIxpUe9',
  database : 'u156920401_pet_adoption'
});

module.exports=connection;