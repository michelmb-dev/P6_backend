import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import {authFormValidation} from "../middlewares/validation.js";


/**
 * It creates a new user, hashes the password, saves the user in the database.
 *
 * @param {Object} req - the request object, which contains all the information about the request that was made to the server.
 * @param {Object} res - the response object
 */
export const signup = (req, res) => {

  const { error } = authFormValidation(req.body)
  if (error) return res.status(400).json({message: error.message})

  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

/**
 * It checks if the user exists in the database, if it does, it compares the password sent by the user with the one stored in the database, if they match, it sends back a token.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 */
export const login = (req, res) => {

  const { error } = authFormValidation(req.body)
  if (error) return res.status(400).json({message: error.message})

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "The user does not exist !!!" });
      }

      const { password } = user;
      bcrypt
        .compare(req.body.password, password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ message: "Incorrect password !!!" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              `${process.env.TOKEN_SECRET}`,
              { expiresIn: "24h" }
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
