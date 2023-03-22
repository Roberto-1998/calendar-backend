const { response, request } = require('express');
const Event = require('../models/Event');

const getEvents = async (req = request, res = response) => {
  try {
    const events = await Event.find({}).populate('user', 'name');

    res.json({
      ok: true,
      events,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador',
    });
  }
};

const createEvent = async (req = request, res = response) => {
  try {
    const event = new Event(req.body);

    event.user = req.uid;

    await event.save();

    res.json({
      ok: true,
      msg: 'createEvent',
      event,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador',
    });
  }
};

const updateEvent = async (req = request, res = response) => {
  const { id } = req.params;
  const uid = req.uid;
  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(400).json({
        ok: false,
        msg: 'Evento no encontrado',
      });
    }

    if (event.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: 'No tiene permisos para editar este evento',
      });
    }

    const newEvent = { ...req.body, user: uid };

    const eventoActualizado = await Event.findByIdAndUpdate(id, newEvent, { new: true });

    res.json({
      ok: true,
      event: eventoActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador',
    });
  }
};

const deleteEvent = async (req = request, res = response) => {
  const { id } = req.params;
  const uid = req.uid;

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(400).json({
        ok: false,
        msg: 'Evento no encontrado',
      });
    }

    if (event.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: 'No tiene permisos para eliminar este evento',
      });
    }

    await Event.findByIdAndDelete(id);

    res.json({
      ok: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador',
    });
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
