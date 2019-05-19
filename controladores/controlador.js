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
    'data': "",
}
con.query(sql, function(error, resultado,fields){
    errores(error, res);
    response = resultado;
    console.log("entro en lista de competencias");
    res.send(JSON.stringify(response));
});
};

function obtenerCompetencias (req , res) {
var id = req.params.id;
//var sql = "SELECT titulo,genero_string,nombre,director,poster FROM actor_pelicula join pelicula on actor_pelicula.pelicula_id = pelicula.id join actor on actor_id = actor.id";
//var sql = "select * from competencias wehere id=" + id;
var sql = "select * from pelicula order by rand()"
var response = {
    'peliculas': "",
    'competencia': "",
}
con.query("select * from competencias where id = "+ id, function (error, resultado, fields){
    errores(error, res);
    response.competencia = resultado[0].nombre;
});

con.query(sql, function (error, resultado, fields) {
    errores(error, res);
    console.log("entro en Obtener competencias");
    response.peliculas = resultado;
    res.send(JSON.stringify(response));
})
};

function votar (req, res) {
var idvoto = req.body.idPelicula;
var competencia = req.params.id;

con.query("insert into peli_votada (competencia, voto) values (?, ?)",
    [competencia , idvoto], function (error, resultado, fields){
        errores(error, res);
        console.log("entro en votar");
        res.send(JSON.stringify(resultado));
    })
};

function resultados (req, res) {
var competencia = req.params.id;

con.query("SELECT voto,competencia,poster,titulo,pelicula.id, count(*) as votos FROM peli_votada join pelicula on voto = pelicula.id GROUP BY voto,competencia HAVING count(*) > 0 and competencia = ? order by votos desc limit 3", [competencia],
            function (error, resultado, fields){
                errores(error , res);
                console.log("entro en resultados");
                var response = {
                    'resultados': resultado,
                }
                //console.log(response);
                res.send(JSON.stringify(response));
            })
};

// sentencia para la busqueda de mas votadas
// SELECT voto,competencia, count(*) as contador FROM peli_votada GROUP BY voto,competencia HAVING count(*) > 0 and competencia = 1 order by contador desc;

module.exports = {
    listaCompetencias : listaCompetencias,
    obtenerCompetencias : obtenerCompetencias,
    votar : votar,
    resultados: resultados,
};



