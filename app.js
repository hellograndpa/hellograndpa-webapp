require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const hbs = require('hbs');

const {
  notifications,
} = require('./middlewares/nofifications');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const housesRouter = require('./routes/houses');
const bookingRouter = require('./routes/booking');
const bookingsRouter = require('./routes/bookings');
const messagesRouter = require('./routes/messages');
const mapRouter = require('./routes/map');

// prevent bodyParser from handling multipart forms (ie only handle get and post requests)

mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
});
// mongoose.connect('mongodb://localhost/hellograndpa', { useNewUrlParser: true });
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  }),
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());

// cookies and sessions
app.use(
  session({
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60, // 1 day
    }),
    secret: 'ironhack',
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

app.use((req, res, next) => {
  app.locals.currentUser = req.session.currentUser;
  next();
});

// Notifications
app.use(notifications(app));

// Routes
app.use('/', indexRouter);
app.use('/user/messages', messagesRouter);
app.use('/user/bookings', bookingsRouter);
app.use('/user', usersRouter);
app.use('/houses', housesRouter);
app.use('/booking', bookingRouter);
app.use('/map', mapRouter);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

hbs.registerHelper('if_eq', function (a, b, opts) {
  if (a === b) {
    return opts.fn(this);
  }
  return opts.inverse(this);
});

hbs.registerHelper('index_of', (context, opts) => context[opts]);
