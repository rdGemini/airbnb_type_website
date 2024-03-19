const mongoose = require('mongoose');
const schema = mongoose.Schema;
const review = require('./review.js');
let listingSchema = new schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        url: String,
        filename: String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:schema.Types.ObjectId,
            ref:'review'
        }
    ],
    owner:{
        type:schema.Types.ObjectId,
        ref:'User',
    },
    geometry:{
        type:{
            type:String,
            default:"Point",
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    category:{
        type:String,
        required:true
    }
})

listingSchema.post("findOneAndDelete",async(list)=>{
    if(list){
        await review.deleteMany({_id :{$in: list.reviews}});
    }
    
})

const listing = mongoose.model("listing",listingSchema);

module.exports = listing;