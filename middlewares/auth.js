import jwt from "jsonwebtoken";

/**
 * Get the token from the request header and then verifies the token used.
 *
 * @param req - The request object.
 * @param res - the response object
 * @param next - This is a callback function that is called when the middleware is complete.
 */
export const authorization = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(
      token,
      `${process.env.TOKEN_SECRET}`,
      (err, decoded) => {
        if (err) {
          console.error("error token");
        } else {
          req.auth = {
            userId: decoded.userId,
          };
          next();
        }
      }
    );
  } catch (error) {
    res.status(401).json({ error });
  }
};
