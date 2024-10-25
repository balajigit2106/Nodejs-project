const express = require("express");
const router = express.Router();
const { verifyToken } = require("../Validation/Validation");
const userController = require("../controllers/userController");
const loginController = require("../controllers/loginController");
const teamController = require("../controllers/teamController");
const organizationController = require("../controllers/organizationController");

router.post("/login", loginController.Login);

//organization apis
router.post(
  "/createOrganization",
  verifyToken,
  organizationController.createOrganization
);
router.get(
  "/getOrganizations",
  verifyToken,
  organizationController.getOrganizations
);
router.delete(
  "/deleteOrganization",
  verifyToken,
  organizationController.deleteOrganization
);
//user apis
router.post("/createUser", verifyToken, userController.createUser);
router.get("/getUsers", verifyToken, userController.getUsers);
router.put("/updateUser", verifyToken, userController.updateUser);
router.delete("/deleteUser", verifyToken, userController.deleteUser);

//team apis
router.post("/createTeam", verifyToken, teamController.createTeam);
router.put("/updateTeam", verifyToken, teamController.updateTeam);
router.get("/getTeams", verifyToken, teamController.getTeams);

module.exports = router;
