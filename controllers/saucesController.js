import { Sauce } from "../models/Sauce.js";
import * as fs from "fs";

/**
 * It creates a new sauce in the database
 * @param req - the request object
 * @param res - the response object
 */
export const createSauce = (req, res) => {
  const { sauce } = req.body;
  const sauceObject = JSON.parse(sauce);
  delete sauceObject._id;

  const newSauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });

  newSauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée" }))
    .catch((error) => res.status(400).json({ error }));
};

/**
 * It finds all the sauces in the database and returns them in the response
 * @param req - the request object
 * @param res - the response object that will be sent back to the client
 */
export const getAllSauces = (req, res) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(500).json({ error: error }));
};

/**
 * It finds a sauce in the database by its id and returns it
 * @param req - the request object
 * @param res - the response that will be sent to the client
 */
export const getSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      try {
        res.status(200).json(sauce);
      } catch (error) {
        res.status(404).json({ error: error });
      }
    })
    .catch((error) => res.status(500).json({ error: error }));
};

/**
 * It updates the sauce in the database with the new sauce object, and if the user uploaded a new image, it deletes the old
 * image from the server
 * @param req - The request object.
 * @param res - The response object.
 */
export const updateSauce = (req, res) => {
  const { sauce } = req.body;

  const sauceObject = req.file
    ? {
        ...JSON.parse(sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId !== req.auth.userId) {
        res.status(403).json({ message: "Non autorisé !" });
      } else {
        /* This is deleting the old image from the server. */
        if (req.file) {
          const oldImage = sauce.imageUrl.split("/images/")[1];
          fs.rm(`images/${oldImage}`, (err) => {
            if (err) {
              // File deletion failed
              console.error(err.message);
            }
          });
        }
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Sauce Mise à jour." }))
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

/**
 * It deletes the sauce whose id is passed in the request parameters, but only if the user who made the request is the same
 * as the one who created the sauce
 * @param req - the request object
 * @param res - the response object
 */
export const deleteSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId !== req.auth.userId) {
        res.status(403).json({ message: "Non autorisé !" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.rm(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
            .catch((error) => res.status(500).json({ error }));
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

/**
 * It checks if the user has already liked or disliked the sauce, and if so, it removes the user from the array of users
 * who liked or disliked the sauce. If the user hasn't liked or disliked the sauce, it adds the user to the array of users
 * who liked or disliked the sauce
 * @param req - the request object
 * @param res - the response object
 */
export const likeSauce = (req, res) => {
  const { like } = req.body;

  if (like === 0) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (sauce.usersLiked.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $pull: { usersLiked: req.body.userId },
              $inc: { likes: -1 },
            }
          )
            .then(() => res.status(200).json({ message: "null" }))
            .catch((error) => res.status(500).json({ error }));
        }
        if (sauce.usersDisliked.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $pull: { usersDisliked: req.body.userId },
              $inc: { dislikes: -1 },
            }
          )
            .then(() => res.status(200).json({ message: "null" }))
            .catch((error) => res.status(500).json({ error }));
        }
      })
      .catch((error) => res.status(500).json({ error }));
  }

  if (like === 1) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $push: { usersLiked: req.body.userId },
        $inc: { likes: +1 },
      }
    )
      .then(() => res.status(200).json({ message: "liked" }))
      .catch((error) => res.status(500).json({ error }));
  }

  if (like === -1) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $push: { usersDisliked: req.body.userId },
        $inc: { dislikes: +1 },
      }
    )
      .then(() => res.status(200).json({ message: "disliked" }))
      .catch((error) => res.status(500).json({ error }));
  }
};
