const User = require("../models/user");
const authUtil = require("../util/authentication");
const userDetailsAreValid = require("../util/validation");
const sessionFlash = require("../util/session-flash");
function getSignup(req, res) {
  let sessionData = sessionFlash.getSessionData(req);
  // 안 해주면 알아서 못 하냐?
  if (!sessionData) {
    sessionData = {
      email: "",
      confirmEmail: "",
      fullname: "",
      street: "",
      postal: "",
      city: "",
    };
  }
  res.render("customer/auth/signup", { sessionData });
}

async function signup(req, res, next) {
  const enteredData = {
    email: req.body.email,
    confirmEmail: req.body.confirmEmail,
    password: req.body.password,
    fullname: req.body.fullname,
    street: req.body.street,
    postal: req.body.postal,
    city: req.body.city,
  };
  // ========= input validation =========
  if (
    !userDetailsAreValid(
      req.body.email,
      req.body.confirmEmail,
      req.body.password,
      req.body.fullname,
      req.body.street,
      req.body.postal,
      req.body.city
    )
  ) {
    sessionFlash.flashDataToSesion(
      req,
      {
        errorMsg:
          "Please check your input, Password must be at 6 characters, postal code must be 5 characters",
        ...enteredData,
      },
      () => {
        res.redirect("/signup");
      }
    );
    return;
  }
  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.street,
    req.body.postal,
    req.body.city
  );

  // ====== check already existing user ======
  try {
    const existAlready = await user.existAlready();
    if (existAlready) {
      sessionFlash.flashDataToSesion(
        req,
        {
          errorMsg: "The user exists already. Try logging in instead",
          ...enteredData,
        },
        () => {
          res.redirect("/signup");
        }
      );
      return;
    }
    // ========= save to db =========
    await user.signup();
  } catch (err) {
    return next(err); // pass to default error handler
  }

  res.redirect("/login");
}

function getLogin(req, res) {
  let sessionData = sessionFlash.getSessionData(req);
  if (!sessionData) {
    sessionData = { email: "", password: "" };
  }
  res.render("customer/auth/login", { sessionData });
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

  const seesionErrorData = {
    errorMsg: "Invalid credentails - please check email and password",
    email,
    password,
  };

  const saveLoginSession = () => {
    sessionFlash.flashDataToSesion(req, seesionErrorData, () =>
      res.redirect("/login")
    );
  };

  // ============= check email =============
  if (!existingUser) {
    saveLoginSession();
    return;
  }
  // ============= check password =============
  const passwordIsCorrect = await user.hasMatchingPWD(existingUser.password);
  if (!passwordIsCorrect) {
    saveLoginSession();
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
