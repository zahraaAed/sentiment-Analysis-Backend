import Jwt from "jsonwebtoken";

 export const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  const secretKey = process.env.JWT_SECRET;

  if (!token) {
    return res.redirect('/login');
  }

  Jwt.verify(token, secretKey, (err, decodedToken) => {
    if (err) {
      console.log(err.message);
      return res.redirect('/login')
    }

    console.log(decodedToken);
    next();
  })
};
