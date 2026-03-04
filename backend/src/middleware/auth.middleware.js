import { clerkClient } from "@clerk/express";
import { UnauthorizedError, ForbiddenError } from "./error.middleware.js";

export const protectRoute = async (req, res, next) => {
  if (!req.auth.userId) {
    return next(new UnauthorizedError("You must be logged in to access this resource"));
  }
  next();
};

export const requireAdmin = async (req, res, next) => {
  try {
    const currentUser = await clerkClient.users.getUser(req.auth.userId);
    const isAdmin =
      process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress.emailAddress;

    if (!isAdmin) {
      throw new ForbiddenError("Admin access required");
    }

    next();
  } catch (error) {
    next(error);
  }
};
