var express = require('express');
var router = express.Router();
var access_controller = require('../controllers/accessTimeController');


router.post('/setAccessTime', access_controller.set_accessTime_post);

router.get('/findUnsafeUsers', access_controller.find_all_unsafe_users_get);

router.post('/markAsSafe', access_controller.mark_as_safe_post);

router.get('/clearAllSafety', access_controller.clear_all_safety_get);

router.get('/getClockInTimes', access_controller.clock_in_time_get);

router.get('/allLocations', access_controller.all_locations);

router.post('/setClockInLocation', access_controller.set_clock_in_location);

module.exports = router;