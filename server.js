const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');
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
const userRoutes = require('./routes/user');

// apiDocs
app.get('/api', (req, res) => {
  fs.readFile('docs/apiDocs.json', (err, data) => {
    if (err) {
      res.status(400).json({
        error: err
      });
    }
    const docs = JSON.parse(data);
    res.json(docs);
  });
});

//Init Middleware
app.use(express.json({ extended: false })); //Instead of doing bodyParser.json
app.use(morgan('dev'));
app.use(cors());

app.use('/', postRoutes);
app.use('/', authRoutes);
app.use('/', userRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
