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
var sqlCount = "select count(*) as contador from competencias.pelicula join (competencias.actor_pelicula,competencias.actor,competencias.director_pelicula,competencias.director,competencias.genero) on (actor_pelicula.pelicula_id = pelicula.id and actor_id = actor.id and director_pelicula.pelicula_id = pelicula.id and director_id = director.id and genero.id = pelicula.genero_id) where 1 = 1" 
adm.query("select * from competencias where nombre = " + nombreCompetencia,
    function (error, resultado, fields){
        if (resultado){
            console.log("Hubo un error en la consulta", resultado);
            return res.status(422).send("Error! Ya existe una competencia con ese nombre");
        }

        if (generoCompentecia  != 0) {
            sqlCount = sqlCount + " and genero_id = " + generoCompentecia;
        }
        if (actorCompetencia != 0) {
            sqlCount = sqlCount + " and actor_id = " + actorCompetencia;
        }
        if (directorCompetencia != 0){
            sqlCount = sqlCount + " and director_id = " + directorCompetencia;
        }

//Se chequea que la competencia a crear tenga al menos 2 peliculas para mostrar
        adm.query(sqlCount, function(error, resultado, fields){ 
            if (resultado[0].contador < 2 || resultado[0].contador === undefined){
                return res.status(422).send("Hay menos de 2 peliculas para mostrar en esta Competencia - Genere una nueva competencia con otros filtros");  
            }
  
//Si no existe competencia y tiene peliculas para mostrar se crea la competencia            
            adm.query("insert into competencias (nombre, genero_id, actor_id, director_id) values (?, ?, ?, ?)",
            [nombreCompetencia , generoCompentecia, actorCompetencia, directorCompetencia], function (error, resultado, fields){
                errores(error, res);
                res.send(JSON.stringify(resultado));
            })
        })
    })    
};

//Se obtiene la competencia a ser borrada
function competenciaABorrar (req, res) {
    var id = req.params.id;
    var response = {
        'nombre' : "",
        'actor_nombre' : "no definido",
        'director_nombre' : "no definido",
        'genero_nombre' : "no definido"
    }
    adm.query("select * from competencias.competencias where id = " + id, function (error, resultado, fields) {
        errores(error, res);
        response.nombre = resultado[0].nombre;
        if (resultado[0].director_id != 0) {
            adm.query("select nombre from competencias.director where id = " + resultado[0].director_id, function (error, resultado1, fields){
                errores( error, res);
                response.director = resultado1;
            })
        }
        if (resultado[0].actor_id != 0){
            adm.query("select nombre from competencias.actor where id = " + resultado[0].actor_id, function (error, resultado2, fields){
                errores( error, res);
                response.actor = resultado2;
            })
        }
        if (resultado[0].genero_id != 0) {
            adm.query("select nombre from competencias.genero where id = " + resultado[0].genero_id, function (error, resultado3, fields){
                errores( error, res);
                response.genero = resultado3;
            })
        }
        res.send(JSON.stringify(response));
    })
};

//Se elimina la competencia seleccionada en el Front junto a los votos correspondientes a dicha competencia
function eliminaCompetencia (req, res){
    var confirmacion = req.body.Eliminar;
    var id = req.params.id;
    if(confirmacion === "Eliminar") {
        adm.query("DELETE FROM competencias.competencias where id = " + id, function (error, resultado, fields){
            errores(error, res);
            return res.send(JSON.stringify(resultado)); 
        })
    }else {
    console.log("Hubo un error al intentar borrar la competencia");
    return res.status(404).send("No se pudo eliminar la compentencia");
    }
};

//Funcion que edita el titulo de una competencia
function editarCompetencia (req, res) {
    var idCompetencia = req.params.id;
    var tituloEditado = req.body.nombre;
    //Se chequea que no exista una competencia con el mismo npmbre
    adm.query("select * from competencias where nombre = " + tituloEditado,
    function (error, resultado, fields){
        if (resultado){
            console.log("Hubo un error en la consulta", resultado);
            return res.status(422).send("Error! Ya existe una competencia con ese nombre");
        };
        adm.query("UPDATE competencias.competencias SET nombre= ? WHERE id = ?", [tituloEditado, idCompetencia], function (error, resultado, fields){
            errores(error, res);
            res.send(JSON.stringify(resultado));
        });
    });
};

//Funcion de Borra todos los votos realizados a una competencia, se realiza un borrado físico de los datos
function reiniciarCompetencia (req, res) {
    var idReinicio = req.params.id;
    adm.query("DELETE FROM competencias.peli_votada WHERE competencia = ?", [idReinicio], function (error, resultado, fields){
        errores(error, res);
        res.send(JSON.stringify(resultado));
    });
}

//Se exportan los modulos para su utilizacion
module.exports = {
    generos : generos,
    directores : directores,
    actores : actores,
    crearCompetencia : crearCompetencia,
    competenciaABorrar : competenciaABorrar,
    eliminaCompetencia : eliminaCompetencia,
    editarCompetencia : editarCompetencia,
    reiniciarCompetencia : reiniciarCompetencia
};
