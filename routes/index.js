var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



router.get('/destinations', (req, res) => {
    const destinations = [
        { name: "Paris", lat: 48.8566, lon: 2.3522 },
        // { name: "New York", lat: 40.7128, lon: -74.0060 },
		{ name: 'Novi Sad', lat: 45.2398, lon: 19.8227},
        // { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
    ];
    res.json(destinations);
});

module.exports = router;
