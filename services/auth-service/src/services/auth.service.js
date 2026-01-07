const bcrypt = require("bcrypt");
const userRepo = require("../repositories/user.repo");
const { signToken } = require("../utils/jwt");

module.exports = {
  async register({ email, username, password }) {
    if (!email || !username || !password) {
      const err = new Error("email, username, password are required");
      err.status = 400;
      throw err;
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await userRepo.create({
      email,
      username,
      password: hashed,
      role: "USER",
      reputation: 0,
    });

    return { token: signToken({ id: user.id, role: user.role }) };
  },

  async login({ email, password }) {
    if (!email || !password) {
      const err = new Error("email and password are required");
      err.status = 400;
      throw err;
    }

    const user = await userRepo.findByEmail(email);
    if (!user) {
      const err = new Error("Invalid credentials");
      err.status = 401;
      throw err;
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      const err = new Error("Invalid credentials");
      err.status = 401;
      throw err;
    }

    return { token: signToken({ id: user.id, role: user.role }) };
  },
};
