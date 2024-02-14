import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Token not found' });
  }

  const tokenParts = token.split(' ');

  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Invalid token format' });
  }

  const tokenValue = tokenParts[1];
  const secretKey = process.env.JWT_SECRET;

  jwt.verify(tokenValue, secretKey, (err, decodedToken) => {
    if (err) {
      console.error("JWT verification failed:", err.message);
      return res.status(401).json({ message: 'Invalid token' });
    }

    console.log("Decoded token:", decodedToken);
    req.user = decodedToken.user;
    next();
  });
};

