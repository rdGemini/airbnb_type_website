const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


module.exports.createReview = async(req,res)=>{
    let {id} = req.params;
    let list = await Listing.findById(id);
    let rev1 = new Review(req.body.review);
    rev1.author = req.user._id;
    list.reviews.push(rev1);
    await rev1.save();
    await list.save();
    req.flash("success","New Review Added :)");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review DELETED :(");
    res.redirect(`/listings/${id}`);
}