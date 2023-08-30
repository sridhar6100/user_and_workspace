const router = require('express').Router();
const adminController = require("../controllerds/admin.controller");

router.post("/",adminController.CreateAdminUserController);
router.put("/:id",adminController.UpdateAdminUserController);
router.delete("/:id",adminController.DeleteAdminUserController);
router.get("/:id",adminController.GetAdminUserController);
router.get("/",adminController.GetAdminUsersController);

module.exports = router;