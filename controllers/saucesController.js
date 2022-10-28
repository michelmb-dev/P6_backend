import { Sauce } from "../models/Sauce.js";
import * as fs from "fs";
import {sauceFormValidation} from "../middlewares/validation.js";

export const createSauce = (req, res) => {

  const { sauce } = req.body;
  const sauceObject = JSON.parse(sauce);
  delete sauceObject._id;

  const { error } = sauceFormValidation(sauceObject)
  if (error) return res.status(400).json({message: error.message})

  const sauceValidateObject = sauceFormValidation(sauceObject).value;

  const newSauce = new Sauce({
    ...sauceValidateObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${ req.file.filename }`,
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

  const { error } = sauceFormValidation(sauceObject)
  if (error) return res.status(400).json({message: error.message})

  const sauceValidateObject = sauceFormValidation(sauceObject).value;

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const { userId, imageUrl } = sauce;
      if (userId !== req.auth.userId) {
        res.status(403).json({ message: "Unauthorized !!!" });
      } else {
        /* This is deleting the old image from the server. */
        const oldImage = imageUrl.split("/images/")[1];
        if (req.file) {
          fs.rm(`images/${oldImage}`, (err) => {
            if (err) {
              res.status(409).json({ message: "Error, the old image can't be deleted !!!" })
            }
          });
        }
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceValidateObject, _id: req.params.id }
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
      const { userId, imageUrl } = sauce;
      if (userId !== req.auth.userId) {
        res.status(403).json({ message: "Non autorisé !" });
      } else {
        const filename = imageUrl.split("/images/")[1];
        fs.rm(`images/${filename}`, (err) => {
          if (err) {
            res.status(409).json({ message: "Error, the image can't be deleted !!!" })
          }
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
        const { usersLiked, usersDisliked } = sauce;
        if (usersLiked.includes(req.body.userId)) {
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
        if (usersDisliked.includes(req.body.userId)) {
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
