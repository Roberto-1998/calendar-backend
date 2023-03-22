const express = require('express');
const path = require('path');
const { dbConnection } = require('./database/config');
const cors = require('cors');
require('dotenv').config();

/* Crear el servidor de express */
const app = express();

/* Base de Datos */
dbConnection();

/* CORS */
app.use(cors());

/* Directorio publico */
if (process.env.NODE_ENV == 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'public', 'index.html')));
}

/* Lectura y parseo del body */
app.use(express.json());

/* Rutas */
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

/* Escuchar peticiones */
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
