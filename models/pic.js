/* this is the schema for when pics are enter into the db */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

//Define your schema: what fields will one pic document have
var picSchema = new Schema( {
  date: Date,
  title: String,
  url: String,
  nasa_url: String,
  
  /* Reference the user object who created the pic
  Useful if we need to access info about the user from the pic. */

  creator: { type: ObjectId, ref: 'User'}
  
});

// Compile taskSchema into Mongoose model object
var Pic = mongoose.model('Pic', picSchema);

// And export the Pic so our other code can use it
module.exports = Pic;