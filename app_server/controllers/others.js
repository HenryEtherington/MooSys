/* GET home page */
const about = function(req, res){
  res.render('generic-text', {
    title: 'About MooSys.\nMooSys is a movie review website. Angular was used to display the home page.'

  });
};


const register = function(req, res){
  res.render('register', { title: 'Register' });
};

const login = function(req, res){
  res.render('login', { title: 'Login' });
};

const locations = function(req, res){
  res.render('locations-list', { title: 'Locations' });
};

const home = function(req, res){
  res.render('home', { title: 'Home' });
};

module.exports = {

  register,
  login,
  locations,
  home,
  about
};
