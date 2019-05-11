var con = require('../lib/conexionbd');

function errores (data, res) {
    if (data) {
        console.log("Hubo un error en la consulta", data.message);
        return res.status(404).send("Hubo un error en la consulta");
    }
}

function listaCompetencias(req, res) {
var sql = "select * from competencias";
var response = {
    'peliculas': "",
}
con.query(sql, function(error, resultado,fields){
    errores(error, res);
    response = resultado;
    res.send(JSON.stringify(response));
});
};

   


module.exports = {
    listaCompetencias : listaCompetencias,
};



