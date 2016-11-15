const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const session      = require('express-session');
const mongoose     = require('mongoose');

//Routes
const routes = require('./routes/index');

//Configs
const DBConfig = require('./config/database.js');

//Init App
const app = express();

//Mongoose Setup
mongoose.connect(DBConfig.url);
mongoose.Promise = global.Promise;

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
  resave: true
}));


//Static Directories
app.use(express.static(path.join(__dirname, 'public')));

//Init Routes
app.use('/', routes);

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
