const router = require('express').Router();
const multer = require('multer');
const authUser = require("../middlewares/auth.helper")
const workspaceController = require("../controllerds/workspace.controller");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post("/", upload.fields([{name:'icon'},{name:'attachments'}]), workspaceController.CreateWorkspaceController);
router.put("/:id", upload.fields([{name:'icon'},{name:'attachments'}]), workspaceController.UpdateWorkspaceController);
router.delete("/:id", workspaceController.DeleteWorkspaceController);
router.get("/", workspaceController.GetWorkspacesController);
router.get("/:id", workspaceController.GetWorkspaceController);

module.exports = router;