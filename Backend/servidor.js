//paquetes necesarios para el proyecto
require('dotenv').config()
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var controladorCliente = require('./controladores/controladorCliente');
var controladorAdministrador = require('./controladores/controladorAdministrador');

var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

//Pedido de parte del modulo Cliente - me faltan las validaciones de errores!
app.use(bodyParser.json());
app.get('/competencias', controladorCliente.listaCompetencias);
app.get('/competencias/:id/peliculas' , controladorCliente.obtenerCompetencias);
app.post('/competencias/:id/voto', controladorCliente.votar);
app.get('/competencias/:id/resultados', controladorCliente.resultados);

//Pedidos de parte del modulo Administrar
app.get('/generos', controladorAdministrador.generos);
app.get('/directores', controladorAdministrador.directores);
app.get('/actores', controladorAdministrador.actores);
app.post('/competencias', controladorAdministrador.crearCompetencia);
app.get('/competencias/:id', controladorAdministrador.competenciaABorrar);
app.delete('/competencias/:id', controladorAdministrador.eliminaCompetencia);
app.put('/competencias/:id', controladorAdministrador.editarCompetencia);
app.delete('/competencias/:id/votos', controladorAdministrador.reiniciarCompetencia);




//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = process.env.PORT;

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});

