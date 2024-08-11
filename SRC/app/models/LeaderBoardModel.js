const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
 const slug = require('mongoose-slug-generator');
  mongoose.plugin(slug);
const leaderboard = new Schema({
  name: {type: String},
  score:{type: Number},
  time: {type:Number},
},{
  timestamps:true,
});


const Leaderboard = mongoose.model('leaderBoard', leaderboard);

module.exports = Leaderboard;
//module.exports=mongoose.model('Course',Course)