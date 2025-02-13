const express = require('express');
const http = require('http');
const cors = require("cors")
const { Server } = require('socket.io');
const crypto = require('crypto');

const app = express();
app.use(cors)

const server = http.Server(app);
const io = new Server(server, {
  cors: {
    origin: "http://10.162.0.2:3000",
    methods:["GET","POST"]
  }
 });
//Playing variables:
app.use(express.static('public')); //show static files in 'public' directory
console.log('Server is running');
// Lista de salas y sus datos
const salas = [];

// Generar un código de sala único
function generarCodigoSala() {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return crypto.randomBytes(6).reduce((codigo, byte) => codigo + caracteres[byte % caracteres.length], '');
}

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  socket.on('crearSala', () => {
    const salaId = generarCodigoSala();
    const sala = {
      id: salaId,
      usuarios: [],
      reproduccion: 0,
      estado: "Activo",
      link: "Sin Link",
      AnimeActual: "Sin Anime Actual",
    };
    salas.push(sala);
    socket.join(salaId);
    socket.emit('salaCreada', salaId);
    console.log('Sala de prueba creada:', salaId);
  });

  socket.on('unirseSala', ({ salaId, usuario }) => {
    const sala = salas.find((s) => s.id === salaId);
    if (!sala) {
      socket.emit('error', 'La sala no existe.');
      return;
    }

    if (!sala.usuarios.includes(usuario)) {
      sala.usuarios.push(usuario);
    }
    socket.join(salaId);
    socket.emit('unidoASala', { salaId, usuario, reproduccion: sala.reproduccion });
    console.log('Usuario unido a la sala:', salaId);
  });

  socket.on('actualizarReproduccion', ({ salaId, tiempo }) => {
    const sala = salas.find((s) => s.id === salaId);
    if (!sala) {
      socket.emit('error', 'La sala no existe.');
      return;
    }
    sala.reproduccion = tiempo;
    socket.to(salaId).emit('reproduccionActualizada', tiempo);
  });

  socket.on('actualizarEstado', ({ salaId, estado }) => {
    const sala = salas.find((s) => s.id === salaId);
    if (!sala) {
      socket.emit('error', 'La sala no existe.');
      return;
    }
    sala.estado = estado;
    socket.to(salaId).emit('estadoActualizado', estado);
  });

  socket.on('actualizarLink', ({ salaId, link }) => {
    const sala = salas.find((s) => s.id === salaId);
    if (!sala) {
      socket.emit('error', 'La sala no existe.');
      return;
    }
    sala.link = link;
    socket.to(salaId).emit('linkActualizado', link);
  });

  socket.on('actualizarAnime', ({ salaId, anime, capitulo }) => {
    const sala = salas.find((s) => s.id === salaId);
    if (!sala) {
      socket.emit('error', 'La sala no existe.');
      return;
    }
    sala.AnimeActual = `${anime} ${capitulo}`;
    socket.to(salaId).emit('animeActualizado', sala.AnimeActual);
  });

  socket.on('solicitarInformacion', (salaId) => {
    const sala = salas.find((s) => s.id === salaId);
    if (!sala) {
      socket.emit('error', 'La sala no existe.');
      return;
    }
    socket.emit('informacionSala', sala);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });});

// Iniciar el servidor en un puerto diferente
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor en Glitch iniciado en el puerto ${PORT}`);
});

