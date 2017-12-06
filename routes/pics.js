var express = require('express');
var router = express.Router();
var apod = require('../apod/apodService');
var Pic = require('../models/pic');
var ObjectId = require('mongoose').mongo.ObjectID;

/* Middleware, to verify if the user is authenticated */
function isLoggedIn(req, res, next) {
    console.log('user is auth ', req.user)
  if (req.isAuthenticated()) {
    res.locals.username = req.user.local.username;
    next();
  } else {
	  console.log('user is not auth ', req.user)
     res.redirect('fetch_picture');
  }
}

/* Fetch a picture from APOD. If random is specified, get a random
picture. Otherwise, get today's picture.  */
router.get('/fetch_picture', isLoggedIn, function(req, res, next) {

	/* Writing in the sever console to show what is happening */
  console.log('RANDOM? '  + req.query.random );

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

router.use(isLoggedIn);

/* GET home page. */
router.get('/', function(req, res, next) {

  /* finding if a user is loggined in */
  Pic.find({ creator: req.user._id})
	.then( (docs) => {
		res.render('index', {title: 'Nasa pic', pics: docs})
	})
	.catch( (err) => {
		next(err);
	});
});




module.exports = router;
