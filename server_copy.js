const express = require('express');
const app = express();
const crypto = require('crypto');

// Lista de salas y sus datos
const salas = [];

// Generar una sala de prueba al acceder a la ruta principal
app.get('/', (req, res) => {
  const salaId = generarCodigoSala(); // Generar un código de sala único
  const sala = {
    id: salaId,
    usuarios: [],
    reproduccion: 0,
    estado:"Activo",
    link:"Sin Link",
    AnimeActual:"Sin Anime Actual",
  };
  salas.push(sala);
  console.log('Sala de prueba creada:', salaId);
  res.send(`Se ha creado una sala de prueba: ${salaId}`);
});

// Endpoint para unirse a una sala existente
app.get('/sala/:salaId/:Usuario', (req, res) => {
  const salaId = req.params.salaId;
  const Usuario =req.params.Usuario;

  // Verificar si la sala existe
  const sala = salas.find((s) => s.id === salaId);
  if (!sala) {
    return res.status(404).send('La sala no existe.');
  }

    const usuarioExistente = sala.usuarios.find((usuario) => usuario === Usuario);
  if (usuarioExistente) {
  }else{
      sala.usuarios.push(Usuario);
  }
  // Agregar al usuario a la sala con el nombre de usuario asignado
  console.log('Usuario unido a la sala:', salaId);
  res.send(`Te has unido a la sala: ${salaId} como ${Usuario} ${ sala.reproduccion }`);


});


app.get('/sala/:salaId/reproduccion/:tiempo', (req, res) => {
  const salaId = req.params.salaId;
  const tiempo = req.params.tiempo;

  // Buscar la sala y actualizar el tiempo de reproducción
  const sala = salas.find((s) => s.id === salaId);
  if (!sala) {
    return res.status(404).send('La sala no existe.');
  }
  sala.reproduccion = tiempo;

  // Responder con éxito
  res.sendStatus(200);
});

app.get('/sala/:salaId/estado/:estado', (req, res) => {
  const salaId = req.params.salaId;
  const estado = req.params.estado;

  // Buscar la sala y actualizar el tiempo de reproducción
  const sala = salas.find((s) => s.id === salaId);
  if (!sala) {
    return res.status(404).send('La sala no existe.');
  }
  sala.estado = estado;

  // Responder con éxito
  res.sendStatus(200);
});

app.get('/sala/:salaId/link/:link', (req, res) => {
  const salaId = req.params.salaId;
  const link = req.params.link;

  // Buscar la sala y actualizar el tiempo de reproducción
  const sala = salas.find((s) => s.id === salaId);
  if (!sala) {
    return res.status(404).send('La sala no existe.');
  }
  sala.link = link;

  // Responder con éxito
  res.sendStatus(200);
});

app.get('/sala/:salaId/Anime/:Anime/:Capitulo', (req, res) => {
  const salaId = req.params.salaId;
  const Anime = req.params.Anime;
  const Capitulo = req.params.Capitulo;

  // Buscar la sala y actualizar el tiempo de reproducción
  const sala = salas.find((s) => s.id === salaId);
  if (!sala) {
    return res.status(404).send('La sala no existe.');
  }
  sala.AnimeActual = Anime+" "+Capitulo;

  // Responder con éxito
  res.sendStatus(200);
});

app.get('/reproducido/sala/:salaId', (req, res) => {
  const salaId = req.params.salaId;

  // Buscar la sala y actualizar el tiempo de reproducción
  const sala = salas.find((s) => s.id === salaId);
  if (!sala) {
    return res.status(404).send('La sala no existe.');
  }
  res.send(`Tiempo Reproducido: ${sala.reproduccion}`);

});

app.get('/estado/sala/:salaId', (req, res) => {
  const salaId = req.params.salaId;

  // Buscar la sala y actualizar el tiempo de reproducción
  const sala = salas.find((s) => s.id === salaId);
  if (!sala) {
    return res.status(404).send('La sala no existe.');
  }
  res.send(`Estado: ${sala.estado}`);

});

app.get('/Informacion/sala/:salaId', (req, res) => {
  const salaId = req.params.salaId;

  // Buscar la sala y actualizar el tiempo de reproducción
  const sala = salas.find((s) => s.id === salaId);
  if (!sala) {
    return res.status(404).send('La sala no existe.');
  }

  res.json(sala);
});

app.get('/link/sala/:salaId', (req, res) => {
  const salaId = req.params.salaId;

  // Buscar la sala y actualizar el tiempo de reproducción
  const sala = salas.find((s) => s.id === salaId);
  if (!sala) {
    return res.status(404).send('La sala no existe.');
  }
  res.send(`Link: ${sala.link}`);

});

app.get('/salas', (req, res) => {
  const listaSalas = salas.map((sala) => {
    return {
      salaId: sala.id,
      usuarios: sala.usuarios,
    };
  });

  res.json(listaSalas);
});

// Generar un código de sala único
function generarCodigoSala() {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const codigo = crypto.randomBytes(6).reduce((codigo, byte) => codigo + caracteres[byte % caracteres.length], '');
  return codigo;
}

// Iniciar el servidor en el puerto 3000 (o el puerto que desees)
app.listen(3000, () => {
  console.log('Servidor en Glitch iniciado en el puerto 3000');
});
