const { Router } = require('express');
const ctrl = require('../controllers/appointments');

const router = Router();

router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.delete('/:id', ctrl.remove);
router.get('/availability', ctrl.availability);

module.exports = router;
