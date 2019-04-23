const fs = require('fs');
const bcrypt = require('bcrypt-nodejs');
const salt = bcrypt.genSaltSync(10);
const express = require('express');
const router = express.Router();


function authentication(options) {
  const {
    passwordFile,
    pathToProtect,
    registerView,
    successRegisterView,
    errorRegisterView,
    loginView,
    successLoginView,
    errorLoginView,
    logoutView,
    unauthorizedView,
  } = options;
//  ...
	
if (!fs.existsSync(passwordFile)) fs.writeFileSync(passwordFile, '{}');

  // Funcion de autenticación, si existe nombre y password en la sesión, se puede ver el contenido
  const auth = function(req, res, next) {
      if(req.session && req.session.username && req.session.password){
        return next();
      }
      else { // https://developer.mozilla.org/es/docs/Web/HTTP/Status/401 
        return res.status(401).render(unauthorizedView); // 401: falta autenticación para el recurso solicitado.
      }
    };




	//Ruta estática para ver el contenido, se necesita haber iniciado previamente sesion
  router.use('/content',
    auth, // our middleware!
    express.static(pathToProtect)
  );




router.get('/login', (req, res) => {
   // ...
	
if ( (!req.session.username)) {
      res.render(loginView);
    }
    else if (req.session.username) {
      res.render(successLoginView, {username:req.session.username});
    }
  });

  router.post('/login', (req, res) => {

let configFile = fs.readFileSync(passwordFile);
    let config = JSON.parse(configFile);

    let p = config[req.body.username];
    if (p) {
      if ((req.session) && req.body && req.body.password && (bcrypt.compareSync(req.body.password, p))){
        req.session.username = req.body.username;
        req.session.password = req.body.password;
        req.session.admin = true;
        return res.render(successLoginView, {username:req.session.username});
      }
    }
      
       return res.render(errorLoginView);
    
    //...
  });

  router.get('/register', (req, res) => {
    //...

	  if (!req.session.username) {
      res.render(registerView);
    }
    else{
      res.render(successLoginView, {username:req.session.username});
    }
  });

  router.post('/register', (req, res) => {
    //...

	  let configFile = fs.readFileSync(passwordFile);
    let config = JSON.parse(configFile);
    let p = config[req.body.username];

    if (!p) config[req.body.username] = bcrypt.hashSync(req.body.password, salt);
    else return res.render(errorRegisterView, req.body.username);

    let configJSON = JSON.stringify(config);
    fs.writeFileSync(passwordFile, configJSON);
    res.render(successRegisterView, {username:req.body.username});
  });

  // Route to logout
  router.get('/logout', (req, res) => {
    //...

	  let user = req.session.username;
    req.session.destroy();
    res.render(logoutView, { user});

  });

  return router;

}



module.exports= authentication;

