import rateLimit from "express-rate-limit";

/**
 * If the user makes too many requests, they will get a 429 status code and a message saying "Too many requests, please try
 * again in an hour!"
 * @param {Object} req - The request object.
 * @param {Object} res - the response object
 */
const limitReached = (req, res) => {
  res.status(429).json({ message: "Too many requests, please try again in an hour!" });
};

export const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: limitReached,
});
