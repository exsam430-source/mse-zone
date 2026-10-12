import express from "express";
import {
  subscribeNewsletter,
  checkNewsletterEmail,
  applyDiscount,
  clearDiscount,
  unsubscribeNewsletter 
} from "../controllers/newsletterController.js";

import authUser from "../middleware/auth.js";

const router = express.Router();

router.post("/subscribe", subscribeNewsletter);
router.get("/check", checkNewsletterEmail);

// NEW:
router.post("/apply-discount", authUser, applyDiscount);
router.post("/clear-discount", authUser, clearDiscount);

// Unsubscribe route
router.post("/unsubscribe", authUser, unsubscribeNewsletter);


export default router;
