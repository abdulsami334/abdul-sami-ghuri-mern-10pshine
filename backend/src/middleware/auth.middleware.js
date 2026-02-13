// import jwt from "jsonwebtoken";
// import { findUserById } from "../models/user.model.js";
// const authMiddleware = async(req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     // Token missing
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({
//         message: "Authorization token missing"
//       });
//     }

//     const token = authHeader.split(" ")[1];

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//  const user = await findUserById(decoded.id);
//   if (!user) {
//       return res.status(401).json({ message: "User not found" });
//     }

//     req.user = user; 
//     // Attach user info to request
//   //  req.user = decoded; // { id: userId }

//     next(); // allow request
//   } catch (error) {
//     return res.status(401).json({
//       message: "Invalid or expired token"
//     });
//   }
// };

// export default authMiddleware;
import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default auth;
