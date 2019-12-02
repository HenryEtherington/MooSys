const express = require('express');
const router = express.Router();
const ctrlLocations = require('../controllers/locations');
const ctrlOthers = require('../controllers/others');


/* Locations pages */
router.get('/', ctrlLocations.homelist);
router.get('/location/review/new', ctrlLocations.addReview);
router.get('/information',ctrlLocations.informationlist);
/* Other pages*/
router.get('/register',ctrlOthers.register);
router.get('/login',ctrlOthers.login);
router.get('/locations',ctrlOthers.locations);

router.get('/about', ctrlOthers.about);

module.exports = router;
