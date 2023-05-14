import createError from "../utils/error.js";
import Review from "../models/review.model.js";
import Hostel from "../models/Hostel.js";

export const createReview = async (req, res, next) => {
  if (req.isSeller) return next(createError(403, "Sellers can't create a review!"));

  const newReview = new Review({
    userId: req.user.id,
    hostelId: req.body.hostelId,
    desc: req.body.desc,
    star: req.body.star,
  });

  try {
    const review = await Review.findOne({
      hostelId: req.body.hostelId,
      userId: req.user.id,
    });

    if (review) return next(createError(403, "You have already created a review for this Hostel!"));

    //TODO: check if the user purchased the Hostel.

    const savedReview = await newReview.save();

    await Hostel.findByIdAndUpdate(req.body.hostelId, {
      $inc: { totalStars: req.body.star, starNumber: 1 },
    });
    res.status(201).send(savedReview);
  } catch (err) {
    next(err);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ hostelId: req.params.hostelId });
    res.status(200).send(reviews);
  } catch (err) {
    next(err);
  }
};
export const deleteReview = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
