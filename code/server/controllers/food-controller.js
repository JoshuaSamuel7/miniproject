const { validationResult } = require('express-validator');
require('dotenv').config();

const Food = require('../models/food');
const Receive = require('../models/receive');
const User = require('../models/user');
const HttpError = require('../models/http-error');

const addfood = async (req, res, next) => {
  const { funcname, name, mobile, description, quantity, quality, foodtype, cookedtime, expirytime, address, city, state, lat, lng, Url } = req.body;

  var currentdate = new Date(); 
  var datetime = currentdate.getDate() + "/"
      + (currentdate.getMonth()+1)  + "/" 
      + currentdate.getFullYear() + " @ "  
      + currentdate.getHours() + ":"  
      + currentdate.getMinutes() + ":" 
      + currentdate.getSeconds();

  let recId = false;
  let status = true;
  let received = false;
  const addedFood = new Food({
        userId:req.userData.userId,
        recId,
        funcname, 
        name, 
        mobile, 
        description, 
        quantity, 
        quality, 
        foodtype, 
        cookedtime, 
        expirytime, 
        status,
        received,
        address, 
        city, 
        state,
        lat,
        lng,
        Url,
        datetime
  });
  try {
    await addedFood.save();
  } catch (err) {
    console.log(err);
    
    const error = new HttpError(
      'Adding Food failed, please try again later.',
      500
    );
    return next(error);
  }
  res
    .status(201)
    .json({ foodId: addedFood.id, 
            userId: addedFood.userId,
            funcname: addedFood.funcname,
            name: addedFood.name,
            mobile: addedFood.mobile,
            description: addedFood.description,
            quantity: addedFood.quantity,
            quality: addedFood.quality,
            foodtype: addedFood.foodtype,
            cookedtime: addedFood.cookedtime,
            expirytime: addedFood.expirytime,
            address: addedFood.address,
            status: status,
            received: received,
            city: addedFood.city,
            state: addedFood.state,
            lat: addedFood.lat,
            lng: addedFood.lng,
            Url: addedFood.Url,
            datetime: datetime
    });
};

const getFood = async (req, res, next) => {
  let foods;
  try {
    var currentDate = new Date(); 
    foods = await Food.find({status:'true',received:'false', expirytime:{$gt:currentDate}}, '-datetime');
  } catch (err) {
    const error = new HttpError(
      'Fetching food failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({ foods: foods.map(food => food.toObject({getters: true })) });
};

const viewfood = async (req, res, next) => {
  let food;
  try {
    food = await Food.findOne({_id:req.body.foodId}, '-datetime');
  } catch (err) {
    const error = new HttpError(
      'Fetching food failed, please try again later.',
      500
    );
    return next(error);
  }
  let coor = { "lat":food.lat, "lng":food.lng};
  res.json({foodId: food.id, 
            userId: food.userId,
            funcname: food.funcname,
            name: food.name,
            mobile: food.mobile,
            description: food.description,
            quantity: food.quantity,
            quality: food.quality,
            foodtype: food.foodtype,
            cookedtime: food.cookedtime,
            expirytime: food.expirytime,
            address: food.address,
            status: food.status,
            received: food.received,
            city: food.city,
            state: food.state,
            coor: coor,
            Url: food.Url
     });
};

const deletefood = async (req, res, next) => {
  try {
    let food = await Food.deleteOne({_id: req.body.foodId});
    res.send(food);
  } catch (err) {
    const error = new HttpError(
      'Deleting food failed, please try again later.',
      500
    );
    return next(error);
  }
};

const acceptfood = async (req, res, next) => {
  let food,donator,receiver;
  const { donId, foodId, name, email, mobile, address, exptime } = req.body;
  try {
    food = await Food.findOne({_id:foodId});
    donator = await User.findOne({_id:donId});
    receiver = await User.findOne({_id:req.userData.userId});
    food.status = false;
    food.recId = req.userData.userId;
    const receive = new Receive({
      donId, 
      foodId, 
      recId:req.userData.userId, 
      name, 
      email, 
      mobile, 
      address, 
      exptime
    });
    try {
      await receive.save();
      await food.save();
    } catch (err) {
      const error = new HttpError(
        'receive 1 failed, please try again later.',
        500
      );
      return next(error);
    }
  } catch (err) {
    const error = new HttpError(
      'receive 2 failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({
      donId: donId,
      foodId: foodId, 
      recId: req.userData.userId,
      name: name,
      email: email,
      mobile: mobile,
      address: address,
      exptime: exptime
     });
};

const viewdonatedfood = async (req, res, next) => {
  let foods;
  try {
    foods = await Food.find({userId: req.userData.userId});
  } catch (err) {
    const error = new HttpError(
      'Fetching food failed, please try again later.',
       500
    );
    return next(error);
  }
  res.json({ foods: foods.map(food => food.toObject({getters: true })) });
};

const viewreceivedfood = async (req, res, next) => {
  let foods;
  try {
    foods = await Food.find({recId: req.userData.userId});
  } catch (err) {
    const error = new HttpError(
      'Fetching food failed, please try again later.',
       500
    );
    return next(error);
  }
  res.json({ foods: foods.map(food => food.toObject({getters: true })) });
};

const openviewdonatefood = async (req, res, next) => {
  let food,donator,receiver,recdetail;
  try {
    food = await Food.findOne({_id: req.body.foodId});
    donator = await User.findOne({_id: req.userData.userId});
    try {
      receiver = await User.findOne({_id: food.recId});
      recdetail = await Receive.findOne({foodId: req.body.foodId});
    } catch (err) {
      receiver = false;
      recdetail = false;
    }
  } catch (err) {
    const error = new HttpError(
      'Fetching food failed, please try again later.',
       500
    );
    return next(error);
  }
  let details = { "food":food, "donator":donator, "receiver":receiver, "recdetail":recdetail };
  res.send(details);
};

const openviewreceivedfood = async (req, res, next) => {
  let food,receiver,donator,recdetail;
  try {
    food = await Food.findOne({_id: req.body.foodId});
    receiver = await User.findOne({_id: req.userData.userId});
    donator = await User.findOne({_id: food.userId});
    recdetail = await Receive.findOne({foodId: req.body.foodId});
  } catch (err) {
    const error = new HttpError(
      'Fetching food failed, please try again later.',
       500
    );
    return next(error);
  }
  let details = { "food":food, "donator":donator, "receiver":receiver ,"recdetail":recdetail};
  res.send(details);
};

const receivedfood = async (req, res, next) => {
  try {
    let food = await Food.findOne({_id: req.body.foodId});
    let receiver = await User.findOne({_id: food.recId});
    let donator = await User.findOne({_id: food.userId});
    food.received = true;
    try {
      await food.save();
    } catch (err) {
      const error = new HttpError(
        'received 1 failed, please try again later.',
        500
      );
      return next(error);
    }
  } catch (err) {
    const error = new HttpError(
      'received 2 failed, please try again later.',
      500
    );
    return next(error);
  }
};

const cancelledfood = async (req, res, next) => {
  try {
    let food = await Food.findOne({_id: req.body.foodId});
    let receiver = await User.findOne({_id: food.recId});
    let donator = await User.findOne({_id: food.userId});
    food.status = true;
    food.received = false;
    food.recId = false;
    try {
      await food.save();
    } catch (err) {
      const error = new HttpError(
        'cancelled 1 failed, please try again later.',
        500
      );
      return next(error);
    }
  } catch (err) {
    const error = new HttpError(
      'cancelled 2 failed, please try again later.',
      500
    );
    return next(error);
  }
};

module.exports = {
  addfood,
  getFood,
  viewfood,
  deletefood,
  acceptfood,
  viewdonatedfood,
  viewreceivedfood,
  openviewdonatefood,
  openviewreceivedfood,
  receivedfood,
  cancelledfood
};
