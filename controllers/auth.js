const User = require("../models/user");
const authUtil = require("../util/authentication");

function getSignup(req, res) {
  res.render("customer/auth/signup");
}

async function signup(req, res) {
  const { email, password, fullname, street, postal, city } = req.body;
  // validate
  // save to db
  const user = new User(email, password, fullname, street, postal, city);
  await user.signup();
  res.redirect("/login");
}

function getLogin(req, res) {
  res.render("customer/auth/login");
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = new User(email, password);
  const existingUser = await user.getUserWithSameEmail();

  // ============= check email =============
  if (!existingUser) {
    res.redirect("/login");
    return;
  }
  // ============= check password =============
  const passwordIsCorrect = user.hasMatchingPWD(existingUser.password);
  if (!passwordIsCorrect) {
    res.redirect("/login");
    return;
  }
  // ============= all passed, save to session then redirect =============
  authUtil.createUserSession(req, existingUser, () => {
    res.redirect("/");
  });
}

module.exports = {
  getSignup,
  signup,
  getLogin,
  login,
};
