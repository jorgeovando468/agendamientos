const { Router } = require('express');
const apiKey = require('../middleware/apiKey');
const appointments = require('./appointments');

const router = Router();

router.use(apiKey);
router.use('/appointments', appointments);

module.exports = router;
