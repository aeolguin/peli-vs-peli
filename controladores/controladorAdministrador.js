var adm = require('../lib/conexionbd');

//Funcion que devuelve el error al Front
function errores (data, res) {
    if (data) {
        console.log("Hubo un error en la consulta", data.message);
        return res.status(404).send("Hubo un error en la consulta");
    }
}

//Funcion que recibe los datos del Front y arma la consulta para los filtros
function requireData (data, res) {
    adm.query("select * from " + data, function (error, resultado, fields){
        errores(error, res);
        var response = resultado;
        res.send(JSON.stringify(response));
    })
}

//Funcion que devulve todos los generos disponibles al Front
function generos (req, res) {
    requireData("genero", res);
};

//Funcion que devuelve todos los directores al Front
function directores (req, res) {
    requireData("director", res);
};

//Funcion que devuelve todos los actores al Front
function actores (req, res) {
    requireData("actor", res);
};

//Chequea la existencia de una competencia y en caso de que no exista otra igual la crea
function crearCompetencia (req, res){
var nombreCompetencia = req.body.nombre;
var generoCompentecia = req.body.genero;
var directorCompetencia = req.body.director;
var actorCompetencia = req.body.actor;
var accionCompentncia = req.body.Guardar;
adm.query("select * from competencias where nombre = " + "'%" + nombreCompetencia + "%'" ,
    function (error, resultado, fields){
        if (resultado){
            console.log("Hubo un error en la consulta", resultado);
            return res.status(422).send("Error! Ya existe una competencia con ese nombre");
        }
  
        adm.query("insert into competencias (nombre, genero_id, actor_id, director_id) values (?, ?, ?, ?)",
        [nombreCompetencia , generoCompentecia, actorCompetencia, directorCompetencia], function (error, resultado, fields){
            errores(error, res);
             res.send(JSON.stringify(resultado));
        })
    })
};


//Se exportan los modulos para su utilizacion
module.exports = {
    generos : generos,
    directores : directores,
    actores : actores,
    crearCompetencia : crearCompetencia,
};
