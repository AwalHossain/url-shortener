import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UrlController } from "./url.controller";
import { UrlValidation } from "./url.validation";

const router = Router();

router.post("/",
    validateRequest(UrlValidation.createShortenUrlSchema),
    UrlController.createShortenUrl);

router.get("/:shortId",
    validateRequest(UrlValidation.redirectToUrlSchema),
    UrlController.redirectToUrl);

export default router;