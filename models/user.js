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
}

module.exports = User;
