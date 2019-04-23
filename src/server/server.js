 const express = require('express');
  const session = require('express-session');
//  const auth = require('@ull-esit-pl/auth');
const ip = require("ip");

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const auth = require('./auth.js');


 // ...

  const app = express();

//view engine setup
app.set('views', './src/server/views');
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended : false }));
// Para recuperar parámetros de peticiones post


  //...

  app.use(session({
    secret: 'verySecureSecret',
    resave: true,
    saveUninitialized: true,
  }));

  app.use('/', auth({
    passwordFile: path.join(__dirname, 'users.json'),
    pathToProtect: path.join(__dirname, '../../', 'dist'),
    registerView: 'register',
    successRegisterView: 'registerSuccess',
    errorRegisterView: 'registerError',
    loginView: 'login',
    successLoginView: 'loginSuccess',
    errorLoginView: 'loginError',
    logoutView: 'logout',
    unauthorizedView: 'unauthorizedView',
  }));

  //...


app.get('/', function(req,res){
	res.render('index');
});

const server = app.listen(process.env.PORT||8080, '0.0.0.0', function(){
  const host = server.address().address;
  const port = server.address().port;

  console.log('Server with sessions and auth listening at http://${host}:${port} ', host , port, ip.address() );
});

