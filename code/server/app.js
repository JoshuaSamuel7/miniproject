const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const usersRoutes = require('./routes/user-routes');
require('dotenv').config();
const app = express();
app.use(express.json())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

app.use('/api/users', usersRoutes);
app.use(cors({
  origin:"http://localhost:3000"
}))
mongoose
  .connect(
    process.env.MONGO_URI, {"useNewUrlParser": true, "useUnifiedTopology": true, 'useCreateIndex': true}
  )
  .then(() => {
    console.log("Database connected");
  })
  .catch(err => {
    console.log(err);
  }
);

const PORT = process.env.PORT || 5000;
app.listen(PORT);