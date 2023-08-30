const router = require('express').Router();
const userController = require("../controllerds/user.controller");

router.post("/",userController.CreateUserController);
router.put("/:id",userController.UpdateUserController);
router.delete("/:id",userController.DeleteUserController);
router.get("/:id",userController.GetUserController);
router.get("/",userController.GetUsersController);

module.exports = router;