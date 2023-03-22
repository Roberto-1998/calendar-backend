/* 
Rutas de Usuarios / Auth
host + /api/auth
*/

const { Router } = require('express');
const { createUser, loginUser, renewToken } = require('../controllers/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post(
  '/new',
  [
    check('name', 'El nombre es obligatorio').notEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password debe tener más de 6 caracteres').isLength({ min: 6 }),
    validarCampos,
  ],
  createUser
);

router.post(
  '/',
  [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password debe tener más de 6 caracteres').isLength({ min: 6 }),
    validarCampos,
  ],
  loginUser
);

router.get('/renew', validarJWT, renewToken);

module.exports = router;
