var adm = require('../lib/conexionbd');

function errores (data, res) {
    if (data) {
        console.log("Hubo un error en la consulta", data.message);
        return res.status(404).send("Hubo un error en la consulta");
    }
}

function requireData (data, res) {
    adm.query("select * from " + data, function (error, resultado, fields){
        errores(error, res);
        var response = resultado;
        res.send(JSON.stringify(response));
    })
}

function generos (req, res) {
    requireData("genero", res);
};

function directores (req, res) {
    requireData("director", res);
};

function actores (req, res) {
    requireData("actor", res);
};

function crearCompetencia (req, res){
var nombreCompetencia = req.body.nombre;
var generoCompentecia = req.body.genero;
var directorCompetencia = req.body.director;
var actorCompetencia = req.body.actor;
var accionCompentncia = req.body.Guardar;
adm.query("insert into competencias (nombre, genero_id, actor_id, director_id) values (?, ?, ?, ?)",
    [nombreCompetencia , generoCompentecia, actorCompetencia, directorCompetencia], function (error, resultado, fields){
        errores(error, res);
        res.send(JSON.stringify(resultado));
    })

};


//Se exportan los modulos para su utilizacion
module.exports = {
    generos : generos,
    directores : directores,
    actores : actores,
    crearCompetencia : crearCompetencia,
};
