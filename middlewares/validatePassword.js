import { passwordSchema } from "../models/Password.js";

export const validatePassword = (req, res, next) => {
  if (!passwordSchema.validate(req.body.password)) {
    res.writeHead(
      400,
      "Le mot de passe doit contenir au moins une Majuscule, 1 chiffre et faire une longueur minimale de 8 caractères"
    );
    res.end("Le format du mot de passe est incorrect.");
    /*
    res.status(400).json({
      message:
        "Le mot de passe doit contenir au moins une Majuscule, 1 chiffre et faire une longueur minimale de 8 caractères",
    });
    */
  } else {
    next();
  }
};
