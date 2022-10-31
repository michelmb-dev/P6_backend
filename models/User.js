import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import mongooseErrors from "mongoose-errors";

/* Creating a new schema for the user model. */
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

/* Plugin that validates the uniqueness of the email. */
userSchema.plugin(uniqueValidator);

/* A plugin that will give us more detailed error messages. */
userSchema.plugin(mongooseErrors);

export const User = mongoose.model("User", userSchema);
