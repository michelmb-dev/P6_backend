import rateLimit from "express-rate-limit";

const limitReached = (req, res) => {
  res.status(429).json({ message: "Too many requests. Try again later." });
};

export const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // Limit each IP to 3 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: limitReached,
});
