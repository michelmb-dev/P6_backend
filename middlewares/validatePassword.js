import { passwordSchema } from "../models/Password.js";

export const validatePassword = (req, res, next) => {
  if (!passwordSchema.validate(req.body.password)) {
    /*
    res.writeHead(
      400,
      "The password must contain at least one Capital letter, 1 digit and a minimum length of 8 characters."
    );
    res.end("Le format du mot de passe est incorrect.");
    */
    res.status(400).json({
      message:
        "The password must contain at least one Capital letter, 1 digit and a minimum length of 8 characters.",
    });
  } else {
    next();
  }
};
