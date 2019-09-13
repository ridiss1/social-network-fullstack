const express = require('express');
const morgan = require('morgan'); // show api in console
const dotenv = require('dotenv'); // .env
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); //get data raw from req to json in console
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
dotenv.config();

const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

//db
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true
  })
  .then(() => console.log('DB connected'));

mongoose.connection.on('error', err => {
  console.log('DB connection error: ' + err.message);
});
mongoose.set('useFindAndModify', false);

//middleware
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token...');
  }
});

app.use('/post', postRoutes);
app.use('/', authRoutes);
app.use('/user', userRoutes);

app.get('/', (req, res) => {
  fs.readFile('docs/apiDocs.json', (err, data) => {
    if (err) {
      res.status(400).json({
        err
      });
    }
    const docs = JSON.parse(data);
    res.json(docs);
  });
});

const port = process.env.PORT || 8080;

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}
app.listen(port, () => {
  console.log('Nodejs api is listening on port: ' + port);
});
