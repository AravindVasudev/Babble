const express          = require('express');
const path             = require('path');
const favicon          = require('serve-favicon');
const logger           = require('morgan');
const cookieParser     = require('cookie-parser');
const bodyParser       = require('body-parser');
const session          = require('express-session');
const MongoStore       = require('connect-mongo')(session);
const mongoose         = require('mongoose');
const passport         = require('passport');
const flash            = require('connect-flash');
const socket_io        = require( "socket.io" );
const passportSocketIo = require('passport.socketio');

//Init App
const app = express();

// Socket.io
let io = socket_io();
app.io = io;

//Routes
const routes = require('./routes/index');
const chat   = require('./routes/chat')(io);

//Configs
const DBConfig = require('./config/database.js');

//Mongoose Setup
mongoose.connect(DBConfig.url);
mongoose.Promise = global.Promise;

//Session Store
const sessionStore = new MongoStore({ mongooseConnection: mongoose.connection });

// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//Serve Favicon & Morgan
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

//Body Parser & Cookie Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Session
app.use(session({
  secret: 'shamballa',
  saveUninitialized: true,
  resave: true,
  store: sessionStore
}));

//Passport Init
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//Passport Config
require('./config/passport');

//Passport Socket.io Middleware
io.use(passportSocketIo.authorize({
  key: 'connect.sid',
  secret: 'shamballa',
  store: sessionStore,
  passport: passport,
  cookieParser: cookieParser
}));

//Static Directories
app.use(express.static(path.join(__dirname, 'public')));

//Init Routes
app.use('/', routes);
app.use('/chat', chat);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

//development error handler
//will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      layout: '',
      error: err,
      status: err.status,
      message: err.message
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    layout: '',
    status: err.status,
    message: err.message
  });
});

module.exports = app;
