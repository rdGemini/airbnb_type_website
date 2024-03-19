const listing = require("../models/listing.js");
const axios = require('axios');



module.exports.index = async (req,res)=>{
    const allListings = await listing.find();
    res.render("./listings/index.ejs",{allListings});
}

module.exports.category = async(req,res)=>{
    let {cate} = req.params;
    const allListings = await listing.find({category:cate});
    if(allListings.length!=0){
        res.render("./listings/index.ejs",{allListings});
    }else{
        req.flash("error","This category does not have any listing");
        res.redirect("/listings");
    }
}

module.exports.searchPlace = async(req,res)=>{
    let {place} = req.body;
    let arr = place.split(",");
    const allList = await listing.find();
    let allListings = allList.filter((list)=>list.location.split(",")[0] === arr[0]);
    if(allListings.length!=0){
        res.render("./listings/index.ejs",{allListings});
    }else{
        req.flash("error","This Destination does not have any listing");
        res.redirect("/listings");
    }
}

module.exports.renderNewForm = (req,res)=>{
    res.render("./listings/new.ejs");
}

module.exports.createListing =async (req,res)=>{
    console.log(req.body);
    let url = req.file.path;
    let filename = req.file.filename;
    const newList = new listing(req.body.listing);
    newList.owner = req.user._id;
    newList.image = {url,filename};
    let locate = newList.location;
    let locationiqUrl = `https://us1.locationiq.com/v1/search?key=${process.env.LOCATION_API_KEY}&q=${locate}&format=json`;
    let addresscoord = await axios.get(locationiqUrl);
    let coords = addresscoord.data[0];
    newList.geometry.coordinates[0] = coords.lat;
    newList.geometry.coordinates[1] = coords.lon;
    let savedList = await newList.save();
    req.flash("success","New listing created successfully !");
    res.redirect("/listings");      
}

module.exports.showListings =async (req,res)=>{
    let {id} = req.params;
    const list = await listing.findById(id).populate({path:"reviews", populate:{path:"author"}}).populate("owner");
    if(!list){
        req.flash("error","Listing Does not exist");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{list});
}

module.exports.renderEditForm =async (req,res)=>{
    let{id} = req.params;
    const list = await listing.findById(id);
    if(!list){
        req.flash("error","Listing Does not exist");
        res.redirect("/listings")
    }
    let originalUrl = list.image.url;
    originalUrl = originalUrl.replace("/upload","/upload/w_250");
    res.render("./listings/edit.ejs",{list,originalUrl});
}

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    let list = await listing.findByIdAndUpdate(id,{...req.body.listing});
    
    let locate = list.location;
    let locationiqUrl = `https://us1.locationiq.com/v1/search?key=${process.env.LOCATION_API_KEY}&q=${locate}&format=json`;
    let addresscoord = await axios.get(locationiqUrl);
    let coords = addresscoord.data[0];
    list.geometry.coordinates[0] = coords.lat;
    list.geometry.coordinates[1] = coords.lon;
    await list.save();

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        list.image = {url,filename};
        await list.save();

    }
    req.flash("success","listing UPDATED :)");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req,res)=>{
    let{id} = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success","listing DELETED :(");
    res.redirect("/listings");
}