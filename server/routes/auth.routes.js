const express = require('express');

const { useRoute } = require('../utils/errors');
const { checkAuth } = require('../middlewares/auth');
const { login, revalidate, signup } = require('../controllers');

const router = express.Router();

router.post('/login', useRoute(login));

router.post('/signup', checkAuth, useRoute(signup));

router.post('/revalidate', useRoute(revalidate));

module.exports = {
  router,
};
