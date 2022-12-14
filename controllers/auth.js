const User = require("../models/user");

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

module.exports = {
  getSignup,
  signup,
  getLogin,
};
