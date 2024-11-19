const mongoose = require('mongoose');
const User = require('./user');
const Schema = mongoose.Schema;

const foodSchema = new Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'User' },
  recId: { type: String },  // removed 'required: true'
  funcname: { type: String },  // removed 'required: true'
  name: { type: String },  // removed 'required: true'
  mobile: { type: Number },  // removed 'required: true'
  description: { type: String },  // removed 'required: true'
  quantity: { type: String },  // removed 'required: true'
  quality: { type: Number },  // removed 'required: true'
  foodtype: { type: String },  // removed 'required: true'
  cookedtime: { type: String },  // removed 'required: true'
  expirytime: { type: Date },  // removed 'required: true'
  status: { type: Boolean },  // removed 'required: true'
  received: { type: Boolean },  // removed 'required: true'
  address: { type: String },  // removed 'required: true'
  city: { type: String },  // removed 'required: true'
  state: { type: String },  // removed 'required: true'
  lat: { type: Number },  // removed 'required: true'
  lng: { type: Number },  // removed 'required: true'
  Url: { type: String },  // removed 'required: true'
  datetime: { type: String },  // removed 'required: true'
  resetToken: { type: String },
  expireToken: { type: Date }
});

module.exports = mongoose.model('Food', foodSchema);
