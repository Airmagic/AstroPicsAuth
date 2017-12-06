var express = require('express');
var router = express.Router();
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


/* GET favorites page */
router.get('/', isLoggedIn, function(req, res, next){
  res.render('favorites', {favorites : req.session.favorites});
});


//added the favorite to an array
router.post('/add', isLoggedIn, function(req, res, next){


console.log(req.body)
  new Pic( {creator: req.user._id, date: req.body.date,
	title: req.body.title, url: req.body.url, nasa_url: req.body.nasa_url} ).save()
		.then ((newPic) => {
			console.log('The new pic is added to favorites: ', newPic);
			res.redirect('/favorites');
		})
      .catch( (err) => {
        next(err);   // most likely to be a database error.
      });


});

/* POST task delete */
router.post('/delete', isLoggedIn, function(req, res, next){

	/* deleting one task under a user */
	Pic.deleteOne({creator: req.user._id, _id : req.body._id })
		.then((result) => {
			if (result.deleteCount === 1) {
				res.direct('/');
			}
			else {
				restatus(404).send('Error deleting favorite pic: not found');
			}
		})
      .catch((err) => {
        next(err);
      });

  });


module.exports = router;
