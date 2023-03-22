const { Router } = require('express');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { validarJWT } = require('../middlewares/validar-jwt');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { isDate } = require('../helpers/isDate');

const router = Router();

/* Todas tienen que pasar por la validación del JWT */
router.use(validarJWT);

/* Obtener eventos */
router.get('/', getEvents);

/* Crear un nuevo event0 */
router.post(
  '/',
  [
    check('title', 'El título es requerido').notEmpty(),
    check('start', 'La fecha de inicio es requerida').custom(isDate),
    check('end', 'La fecha de fin es requerida').custom(isDate),
    validarCampos,
  ],
  createEvent
);

/* Actualizar evento */
router.put('/:id', updateEvent);

/* Eliminar evento */
router.delete('/:id', deleteEvent);

module.exports = router;
