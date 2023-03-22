const { response } = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = (req, res = response, next) => {
  /* x-token headers */
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: 'No hay token en la petición',
    });
  }

  try {
    const { uid, name } = jwt.verify(token, process.env.JWT_SECRET);

    req.uid = uid;
    req.name = name;
    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: 'Token no válido',
    });
  }
};

module.exports = { validarJWT };
