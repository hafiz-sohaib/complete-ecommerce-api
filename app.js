require('dotenv').config();
require('./app/config/config');


// ==================== Import Dependencies ====================
const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { userData } = require('./app/middlewares/authentication');
const app = express();


// ==================== Built-in Middlewares ====================
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));


app.use('*', userData);


// ==================== API's ====================
app.use(process.env.API_PREFIX, [
	require('./app/apis/auth/endpoints'),
	require('./app/apis/categories/endpoints'),
	require('./app/apis/subcategories/endpoints')
]);


// ==================== Error Handler ====================
app.use((request, response, next) => next(createError(404)));

app.use((error, request, response, next) => {
	response.locals.message = error.message;
	response.locals.error = request.app.get('env') === 'development' ? error : {};

	response.status(error.status || 500);
	response.json({message: error.message, status: error.status});
});


app.listen(process.env.PORT);