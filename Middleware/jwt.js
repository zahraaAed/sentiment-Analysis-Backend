import Jwt from "jsonwebtoken";

 export const requireAuth = (req, res, next) => {
  const token = req.headers['authorization']
  var token_split = token.split(' ');

  console.log("token ",token_split[1])
  const secretKey = process.env.JWT_SECRET;
console.log("secret key",secretKey)
  if (!token_split[1]) {
    res.status(401).send('Authentication required.');
    return;
  }

  Jwt.verify(token_split[1], secretKey, (err, decodedToken) => {
  
    if (err) {
      console.log("error : ",err.message);
      return res.status(401).json("Invalid token")
    }

    console.log("decodedToken :",decodedToken);
    next();
  })
};

