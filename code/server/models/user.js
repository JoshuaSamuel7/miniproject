const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    fullname: { type: String },
    email: { 
      type: String, 
      unique: [true, "Email must be unique"] 
    },
    password: { 
      type: String, 
      minlength: [3, 'Password should have at least 3 characters'] 
    },
    mobile: { type: Number }, 
    gender: { type: String },
    type: { type: String }, 
    address: { type: String }, 
    city: { type: String }, 
    state: { type: String },  
    datetime: { type: String },
    resetToken: { type: String },
    expireToken: { type: Date },
  },
  { timestamps: true }
);

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
