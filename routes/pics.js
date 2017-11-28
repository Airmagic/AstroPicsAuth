var express = require('express');
var apod = require('../apod/apodService');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  Task.find( { creator: req.user._id, completed: false})
    .then( (docs) => {
      res.render('index', {title: 'Incomplete Tasks', tasks: docs})
    })
    .catch( (err) => {
    next(err);
  });

});

/* Fetch a picture from APOD. If random is specified, get a random
picture. Otherwise, get today's picture.  */
router.get('/fetch_picture', function(req, res, next) {
	
	Task.findOne({_id: req.params._id} )
    .then( (pic) => {
		/* Writing in the sever console to show what is happening */
  console.log('RANDOM? '  + req.query.random );
  
		apod(function(err, apod_data){

      if (err) {
        res.render('apod_error', {error: err.message, title : "Error"});
      }
	  
      else {
        res.render('index', { apod : apod_data, title : "APOD for " + apod_data.date });
      }

    }, req.query.random);
	
	
	/* showing a error if the apod api has any problems with access */
    apod(function(err, apod_data){

      if (err) {
        res.render('apod_error', {error: err.message, title : "Error"});
      }
	  
      else {
        res.render('index', { apod : apod_data, title : "APOD for " + apod_data.date });
      }

    }, req.query.random);

});

module.exports = router;
