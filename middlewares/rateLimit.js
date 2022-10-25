import rateLimit from "express-rate-limit";

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
