const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

app.use(express.json())
app.use(cookieParser())

// route imports
const product = require('./routes/productRoutes');
const user = require('./routes/userRoutes');
const order = require('./routes/OrderRoutes');

const ErrorMiddleware = require('./middleware/Error');



app.use('/api/v1',product);

app.use('/api/v1',user)

app.use('/api/v1',order)

app.use(ErrorMiddleware);

module.exports = app;