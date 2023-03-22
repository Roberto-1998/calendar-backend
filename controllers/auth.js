const { response, request } = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

const createUser = async (req = request, res = response) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        ok: false,
        msg: 'El correo ya se encuentra registrado',
      });
    }

    user = new User(req.body);

    /* Encriptar contraseña */
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    /* Generar JWT */
    const token = await generateJWT(user._id, user.name);

    res.status(201).json({
      ok: true,
      uid: user._id,
      name: user.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador',
    });
  }
};

const loginUser = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: 'Usuario o contraseña incorrectos',
      });
    }

    /* Confirmar los passwords */
    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Usuario o contraseña incorrectos',
      });
    }

    /* Generar JWT */
    const token = await generateJWT(user._id, user.name);

    res.json({
      ok: true,
      uid: user._id,
      name: user.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador',
    });
  }
};

const renewToken = async (req = request, res = response) => {
  const uid = req.uid;
  const name = req.name;

  const token = await generateJWT(uid, name);

  res.json({
    ok: true,
    uid,
    name,
    token,
  });
};

module.exports = {
  createUser,
  loginUser,
  renewToken,
};
