if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require('path');
const methodoverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const listingsRoute = require("./routes/listings.js");
const reviewsRoute = require("./routes/reviews.js"); 
const userRoute = require("./routes/user.js"); 
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const User = require('./models/user.js');
const passport = require("passport");
const LocalStrategy = require('passport-local');


const store = MongoStore.create({
    mongoUrl:process.env.ATLASDB_URL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})

const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true,
    }
}

store.on("error",(err)=>{
    console.log("Error in MongoDB session Store",err);
})

app.use(express.static(path.join(__dirname,"public")));
app.use(methodoverride("_method"));
app.use(express.urlencoded({extended:true}));

app.set("views",path.join(__dirname,"views"))
app.set("view engine","ejs");

app.engine("ejs",ejsMate);

main().then(()=>{console.log("connection is successfull")}).catch(err=>{console.log(err)});

async function main() {
    await mongoose.connect(process.env.ATLASDB_URL);
}
// async function main() {
//     await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
// }

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.use("/listings",listingsRoute);
app.use("/listings/:id/reviews",reviewsRoute);
app.use("/",userRoute);


app.get("/listings/category/:cat",listingsRoute);

app.get("/",(req,res)=>{
    res.redirect("/listings");
})

// app.get("/testlistings", async (req,res)=>{
//     let list1 = new listing({
//         title:"Abhishek sharma's villa",
//         description:"in Nagla Jhinga",
//         price: 120000,
//         location:"Mathura UttarPradesh",
//         country:"India"
//     });
//     await list1.save();
//     console.log("successfully saved");
//     res.send("success");
// })
// app.get("/",(req,res)=>{
//     res.send("Hii, I'm Groot");
// })

// app.get("/demouser", async(req,res)=>{
//     let fakeUser = new User ({
//         email:"student@gmail.com",
//         username:"student-01"
//     });

//     const registeredUser = await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// })

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found :( "));
})

app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong"} = err;
    // res.status(statusCode).send(message);
    console.log(err);
    res.status(statusCode).render("error.ejs",{message});
})

app.listen(8080,()=>{
    console.log("app is listening at port 8080");
})
