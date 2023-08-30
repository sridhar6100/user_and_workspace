const router = require('express').Router();
const authUser = require("../middlewares/auth.helper");
const authController = require("../controllerds/auth.controller");

router.post("/user/login",authController.UserLoginController);
router.get("/user/profile/:id", authController.UserProfileController);
router.post("/admin/login",authController.AdminLoginController);
router.get("/admin/profile/:id", authController.AdminProfileController);

module.exports = router;