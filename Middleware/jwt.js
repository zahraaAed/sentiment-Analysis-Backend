import Jwt from "jsonwebtoken";

 export const requireAuth = (req, res, next) => {
  const token = req.headers['authorization']
  var token_split = token.split(' ');

  console.log("token ",token_split[1])
  const secretKey = process.env.JWT_SECRET;
console.log("secret key",secretKey)
try{
  if (!token_split[1]) {
    res.status(401).send('Authentication required.');
    return;
  }
  console.log("token ",token_split[1])
  console.log("secretKey ",secretKey)

  Jwt.verify(token_split[1], secretKey, (err, decodedToken) => {
  console.log(decodedToken)
    if (err) {
      console.log("error : ",err.message);
      return res.status(401).json("Invalid token")
    }

    console.log("decodedToken :",decodedToken);
    next();
   
  })
}
  catch (error) {
    console.error("Error in adding room:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }

// const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFsYWEzIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzA3ODk4Nzc5LCJleHAiOjE3MDc5MDIzNzl9.xEst2AMHhcy7rIMI9uTd2z27SLBa3SVLfBvxL0NkaSY";
// const secretKey = "1234567";

// jwt.verify(token, secretKey, (err, decoded) => {
//   if (err) {
//     console.error("JWT verification failed:", err.message);
//   } else {
//     console.log("Decoded token:", decoded);
//   }
// });

};



