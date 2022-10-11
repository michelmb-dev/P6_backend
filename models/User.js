import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

/* Creating a new schema for the user model. */
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

/* Plugin that validates the uniqueness of the email. */
userSchema.plugin(uniqueValidator);

export const User = mongoose.model("User", userSchema);
