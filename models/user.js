const db = require("../data/database");
const bcrypt = require("bcryptjs");

class User {
  constructor(email, password, fullname, street, postal, city) {
    this.email = email;
    this.password = password;
    this.fullname = fullname;
    this.address = { street, postal, city };
  }

  // store user info to db
  async signup() {
    const hashedPwd = await bcrypt.hash(this.password, 12);

    db.getDb().collection("users").insertOne({
      email: this.email,
      password: hashedPwd,
      name: this.fullname,
      address: this.address,
    });
  }

  // check email to login
  async getUserWithSameEmail() {
    return db.getDb().collection("users").findOne({ email: this.email });
  }

  // check does user already exists
  async existAlready() {
    const existingUser = await this.getUserWithSameEmail();
    return existingUser ? true : false;
  }

  // check pwd to login
  hasMatchingPWD(hashedPwd) {
    return bcrypt.compare(this.password, hashedPwd);
  }
}

module.exports = User;
