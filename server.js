const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const dotenv = require('dotenv');
const app = express();
require('dotenv').config();

//Connect Database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => console.log('DB Connected'));
mongoose.connection.on('error', err =>
  console.log(`DB Connection Error: ${err.message}`)
);

//Bring in routes
const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');

//Init Middleware
app.use(express.json({ extended: false })); //Instead of doing bodyParser.json
app.use(morgan('dev'));

app.use('/', postRoutes);
app.use('/', authRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
