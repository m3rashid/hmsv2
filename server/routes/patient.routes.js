const express = require('express');

const {
  createPatient,
  deletePatient,
  getPatientById,
  searchPatients,
  createDummyPatients,
} = require('../controllers');
const { useRoute } = require('../utils/errors');
const { checkAuth } = require('../middlewares/auth');

const router = express.Router();

router.post('/dummy', useRoute(createDummyPatients));

router.post('/create', checkAuth, useRoute(createPatient));

router.get('/search', checkAuth, useRoute(searchPatients));

router.get('/:id', checkAuth, useRoute(getPatientById));

router.delete('/:id', checkAuth, useRoute(deletePatient));

module.exports = {
  router,
};
