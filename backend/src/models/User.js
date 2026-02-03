const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true,
      select: false // 🔐 nunca vem em find()
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user"
    }
  },
  {
    timestamps: true
  }
);

// 🔒 HASH DA SENHA
schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔑 COMPARAR SENHA (LOGIN)
schema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", schema);
