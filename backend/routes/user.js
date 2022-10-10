const express = require("express");
const multer = require('multer');
const upload = multer({dest:"uploads"})

const UserController = require("../controllers/User.controller");
const { checkAuthentication } = require("../middleware/Auth");
const router = express.Router();

router.get("/me", UserController.me);
router.post("/login", UserController.login);
router.post("/register", UserController.register);
router.put("/updateInfo", UserController.updateInfo);
router.put("/signContract", checkAuthentication, UserController.signContract);
router.put("/uploadDocument", checkAuthentication, upload.single("image") ,  UserController.uploadDocument);
router.get("/logout", checkAuthentication, UserController.logout);
router.post('/forgot', UserController.forgotPassword);
router.get('/reset', UserController.resetPassword);
router.put('/updatePasswordViaEmail', UserController.updatePasswordViaEmail);
// Settings routes
router.put('/updatePassword', checkAuthentication, UserController.updatePassword);
router.put('/updateContactInfo', checkAuthentication, UserController.updateContactInfo);
router.put('/updatePersonalDetails', checkAuthentication, UserController.updatePersonalDetails);
router.put('/updateNotificationStatus', checkAuthentication, UserController.updateNotificationStatus);

module.exports = router;