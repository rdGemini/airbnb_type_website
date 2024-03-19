const express = require("express");
const multer  = require('multer');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controller/listings.js");
const {storage} = require("../cloudinaryConfig.js");
const upload = multer({ storage });

// router.route can be use to make more compact things and use same path for different request

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));
// .post(upload.single('listing[image]'),wrapAsync(listingController.createListing));
// .post(upload.single('listing[image]'),(req,res)=>{
//     res.send(req.body);
// });

//index route

// new route
router.get("/new",isLoggedIn,listingController.renderNewForm);


router.get("/category/:cate",listingController.category);
router.post("/destination",listingController.searchPlace);

// show route
router.get("/:id", wrapAsync(listingController.showListings));


//Edit route

router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

// router.put("/:id",isLoggedIn,isOwner, wrapAsync(listingController.updateListing));
router.put("/:id",isLoggedIn,isOwner,upload.single('listing[image]'),validateListing, wrapAsync(listingController.updateListing));

//delete route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));


module.exports = router;
