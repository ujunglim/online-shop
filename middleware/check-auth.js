// authorize
function checkAuthStatus(req, res, next) {
  const uid = req.session.uid; // check user has logged in or not

  if (!uid) {
    return next(); // dont' crash app
  }

  res.locals.uid = uid;
  res.locals.isAuth = true;
  next();
}

module.exports = checkAuthStatus;
