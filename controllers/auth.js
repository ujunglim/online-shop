const User = require("../models/user");
const authUtil = require("../util/authentication");

function getSignup(req, res) {
  res.render("customer/auth/signup");
}

async function signup(req, res, next) {
  const { email, password, fullname, street, postal, city } = req.body;
  // validate
  // save to db
  const user = new User(email, password, fullname, street, postal, city);
  try {
    await user.signup();
  } catch (err) {
    return next(err); // pass to default error handler
  }
  res.redirect("/login");
}

function getLogin(req, res) {
  res.render("customer/auth/login");
}

async function login(req, res, next) {
  const { email, password } = req.body;
  const user = new User(email, password);
  let existingUser;
  try {
    existingUser = await user.getUserWithSameEmail();
  } catch (err) {
    return next(err);
  }

  // ============= check email =============
  if (!existingUser) {
    res.redirect("/login");
    return;
  }
  // ============= check password =============
  const passwordIsCorrect = await user.hasMatchingPWD(existingUser.password);
  if (!passwordIsCorrect) {
    res.redirect("/login");
    return;
  }
  // ============= all passed, save to session then redirect =============
  authUtil.createUserSession(req, existingUser, () => {
    res.redirect("/");
  });
}

function logout(req, res) {
  authUtil.destroyUserAuthSession(req);
  res.redirect("/login");
}

module.exports = {
  getSignup,
  signup,
  getLogin,
  login,
  logout,
};
