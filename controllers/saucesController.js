import { Sauce } from "../models/Sauce.js";
import * as fs from "fs";

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
    .then(() =>
      res.status(201).json({ message: "Sauce successfully registered." })
    )
    .catch((error) => res.status(400).json({ error }));
};

export const getAllSauces = (req, res) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(500).json({ error: error }));
};

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
        res.status(403).json({ message: "Unauthorized !!!" });
      } else {
        /* This is deleting the old image from the server. */
        const oldImage = sauce.imageUrl.split("/images/")[1];
        if (req.file) {
          fs.rm(`images/${oldImage}`, (err) => {
            if (err) {
              // File deletion failed
              // TODO => gérer l'erreur de suppression d'image
              console.error("Error while removing the image");
            }
          });
        }
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() =>
            res.status(200).json({ message: "Sauce updated successfully." })
          )
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

export const deleteSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId !== req.auth.userId) {
        res.status(403).json({ message: "Non autorisé !" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.rm(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() =>
              res.status(200).json({ message: "Sauce successfully removed." })
            )
            .catch((error) => res.status(500).json({ error }));
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

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
