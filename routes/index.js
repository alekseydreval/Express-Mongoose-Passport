
module.exports = function(req, res, next) {
  if (!req.isAuthenticated())
  	res.redirect('/login');
  else
  	res.redirect('/profile');
  next();
};
