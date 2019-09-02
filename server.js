const express = require('express');
const morgan = require('morgan');
const app = express();

//Bring in routes
const postRoutes = require('./routes/post');

//Init Middleware
app.use(express.json({ extended: false })); //Instead of doing bodyParser.json
app.use(morgan('dev'));

app.use('/', postRoutes);

const PORT = 8080;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
