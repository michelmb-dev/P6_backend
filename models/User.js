import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import mongooseErrors from "mongoose-errors";

/* Creating a new schema for the user model. */
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/,
      "Please enter a valid email address.",
    ],
  },
  password: {
    type: String,
    required: true,
  },
});

/* Plugin that validates the uniqueness of the email. */
userSchema.plugin(uniqueValidator);

userSchema.plugin(mongooseErrors);

export const User = mongoose.model("User", userSchema);
