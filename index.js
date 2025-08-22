const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError.js");
const { MessageChannel } = require("worker_threads");

const port = 8080;

app.set(__dirname, "views");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

main()
    .then(() => {
        console.log("Connection Successful");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');
}

function asyncWrap(fn) {
    return function(req, res, next) {
        fn(req, res, next).catch(err => next(err));
    }
        
}

//Index Route
app.get("/chats", async (req, res) => {
    let chats = await Chat.find();
    res.render("index.ejs", { chats });
});

//New Route
app.get("/chats/new", (req, res) => {
    res.render("new.ejs");
});

//Create Route
app.post("/chats", (req, res) => {
    let {from, msg, to} = req.body;
    let newChat = new Chat({
        from: from,
        to: to,
        msg: msg, 
        created_at: new Date()
    });
    Chat.insertOne(newChat)
        .then((data) => {
            console.log(data)
        })
        .catch((err) => {
            console.log(err)
        });
        
    res.redirect("/chats");
});

//Edit Route
app.get("/chats/:id/edit", async (req, res) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", { chat });
});

//Show route for --Error Handling Lecture
app.get("/chats/:id", async (req, res, next) => {
    let {id} = req.params;
    const chat = await Chat.findById(id);
    if(!chat) {
        next(new ExpressError(404, "Chat not found"));
    }
    res.render("edit.ejs", {chat});
});

//Update Route
app.patch("/chats/:id", async (req, res) => {
    let { id } = req.params;
    let { msg: newMsg } = req.body;
    let chat = await Chat.findById(id);
    Chat.findByIdAndUpdate(
        id, 
        {msg: newMsg},
        {
            runValidators: true,
            new: true
        },
        
    ).then((data) => {
        console.log(data);
    })
    .catch((err) => {
        console.log(err);
    });
    res.redirect("/chats")
});

//Destroy route
app.delete("/chats/:id", (req, res) => {
    let { id } = req.params;
    Chat.findByIdAndDelete(id)
        .then((data) => {
            console.log(data);
        })
        .catch((err) => {
            console.log(err);
        });
    res.redirect("/chats");
});


app.get("/", (req, res) => {
    res.send("root is working");
});

app.get('/async', async (req, res) => {
    throw new Error("BOOM"); // Rejected Promise
});




//Error Handling Middleware
app.use( (err, req, res, next) => {
    let { status=500, message="Some Error occured"} = err;
    res.status(status).send(message);
});

app.listen(port, () => {
    console.log(`Server is Listening on port ${port}`);
})