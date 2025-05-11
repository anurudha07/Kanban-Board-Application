const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/sectionController');


console.log('sectionController exports:', Object.keys(ctrl));

router.get(   '/',    ctrl.getSections);
router.post(  '/',    ctrl.createSection);
router.put(   '/:id', ctrl.updateSection);
router.delete('/:id', ctrl.deleteSection);

module.exports = router;
