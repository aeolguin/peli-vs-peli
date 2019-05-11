var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  port     : '3306',
  user     : 'arielo',
  password : 'martina2712',
  database : 'competencias'
});

module.exports = connection;

