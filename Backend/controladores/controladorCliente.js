var con = require('../lib/conexionbd');

function errores (data, res) {
    if (data) {
        console.log("Hubo un error en la consulta", data.message);
        return res.status(404).send("Hubo un error en la consulta");
    }
}

//Lista todas las competencias creadas
function listaCompetencias(req, res) {
var sql = "select * from competencias";
var response = {
    'data': "",
}
con.query(sql, function(error, resultado,fields){
    errores(error, res);
    response = resultado;
    res.send(JSON.stringify(response));
});
};

//Genera en forma aleatoria el listado de Peliculas que se van a mostrar para votar
function obtenerCompetencias (req , res) {
var id = req.params.id;
var sql = "select pelicula.id,pelicula.titulo,pelicula.genero_id,pelicula.poster from competencias.pelicula join (competencias.actor_pelicula,competencias.actor,competencias.director_pelicula,competencias.director,competencias.genero) on (actor_pelicula.pelicula_id = pelicula.id and actor_id = actor.id and director_pelicula.pelicula_id = pelicula.id and director_id = director.id and genero.id = pelicula.genero_id) where 1 = 1" 
var response = {
    'peliculas': "",
    'competencia': "",
}

con.query("select * from competencias.competencias where id = "+ id, function (error, resultado, fields){
    errores(error, res);
    var competencia = resultado[0]

    response.competencia = competencia.nombre;
    if (competencia.genero_id  != 0) {
        sql = sql + " and genero_id = " + competencia.genero_id;
    }

    if (competencia.actor_id != 0) {
        sql = sql + " and actor_id = " + competencia.actor_id;
    }

    if (competencia.director_id != 0){
        sql = sql + " and director_id = " + competencia.director_id;
    }

    sql = sql + " order by rand()"
        con.query(sql, function (error, resultado, fields) {
            errores(error, res);
            response.peliculas = resultado;
            res.send(JSON.stringify(response));
        });
    });
};

//Toma los datos de las Peliculas mostradas e inserta en la base la votacion seleccionada
function votar (req, res) {
var idvoto = req.body.idPelicula;
var competencia = req.params.id;

con.query("insert into peli_votada (competencia, voto) values (?, ?)",
    [competencia , idvoto], function (error, resultado, fields){
        errores(error, res);
        res.send(JSON.stringify(resultado));
    })
};


// Obtiene un listado con las 3 peliculas mas votadas
function resultados (req, res) {
var competencia = req.params.id;

con.query("SELECT voto,competencia,poster,titulo,pelicula.id, count(*) as votos FROM competencias.peli_votada join competencias.pelicula on voto = pelicula.id GROUP BY voto,competencia HAVING count(*) > 0 and competencia = ? order by votos desc limit 3", [competencia],
    function (error, resultado, fields){
        errores(error , res);
        var response = {
            'resultados': resultado,
        }
        res.send(JSON.stringify(response));
    })
};

//Se exportan los modulos para su utilizacion
module.exports = {
    listaCompetencias : listaCompetencias,
    obtenerCompetencias : obtenerCompetencias,
    votar : votar,
    resultados: resultados,
};



