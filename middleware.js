const listing = require("./models/listing.js");
const review = require("./models/review.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be Logged in !");
        return res.redirect("/login");
    }
    next();
}

module.exports.savedRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let list = await listing.findById(id);
    if(! (res.locals.currUser && list.owner._id.equals(res.locals.currUser._id))){
        req.flash("error","You don't have Permission to edit this Listing")
       return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.isReviewAuthor = async (req,res,next)=>{
    let {id,reviewId} = req.params;
    let rev = await review.findById(reviewId);
    if(! (res.locals.currUser && rev.author.equals(res.locals.currUser._id))){
       req.flash("error","You are not the author of this Review");
       return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((er)=>er.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((er)=>er.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}