// подключение express
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const errorHandlers = require('./handlers/errorHandlers');
const credentials = require('./credentials');
const registerController = require('./controllers/register');
const studentsController = require('./controllers/students');
const loginController = require('./controllers/login');
const verifyTokenMiddleware = require('./controllers/verifyTokenMiddleware');

const logoutController = require('./controllers/logout');

require('dotenv').config({ path: 'variables.env' });

// создаем объект приложения
const app = express();

mongoose.connect(process.env.DATABASE, {
  useMongoClient: true,
});

mongoose.connection.on('error', (err) => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});

const db = mongoose.connection;
mongoose.Promise = global.Promise;

// создаем парсер для данных в формате json
const publicPath = path.join(__dirname, '../public');

app.set('view engine', 'pug');
app.use(express.static(publicPath));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(require('cookie-parser')(credentials.cookieSecret));

//use sessions for tracking logins
app.use(require('express-session')({
  resave: false,
  saveUninitialized: false,
  secret: credentials.cookieSecret,
  store: new MongoStore({
    mongooseConnection: db,
  }),
}));

app.use('/register', registerController);
app.use('/login', loginController);
app.use(verifyTokenMiddleware);
app.use('/students', studentsController);
app.use('/logout', logoutController);

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// One of our error handlers will see if these errors are just validation errors
app.use(errorHandlers.flashValidationErrors);

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

// начинаем прослушивать подключения на 3000 порту
app.listen(process.env.PORT);
