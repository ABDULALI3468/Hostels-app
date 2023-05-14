import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  console.log(token);
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  console.log(` abc ${process.env.JWT}`);

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) {
      return next(createError(403, "Token is not valid!"));
    }
    req.user = user;
    console.log(req.user);
    if (req.user.active === false) {
      return next(createError(403, "User is not Active!"));
    }
    return next();
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, (err) => {
    if (err) {
      return next(err);
    }
    console.log(req.user.type);
    if (req.user.type === "manager" || req.user.type === "owner") {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

export const verifyUserType = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.type === "user") {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

export const verifyOwnerOrManager = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if ((req.user.type = "manager") || (req.user.type = "owner")) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};
