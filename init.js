const mongoose = require("mongoose");
const Chat = require("./models/chat.js");

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

let allChats = [
    {
        from: "Shiva",
        to: "Parvathi",
        msg: "Sri Rama Rama Ramethe Rame Raame monorame saharanama tatthulyam Rama nama varanane",
        created_at: new Date() 
    },
    {
        from: "Shiva",
        to: "Parvathi",
        msg: "Sri Rama Jayam",
        created_at: new Date() 
    },
    {
        from: "Parvathi",
        to: "Shiva",
        msg: "Sitayascharitam mahat",
        created_at: new Date()
    },
    {
        from: "Rama",
        to: "Sita",
        msg: "Shivaya Namah",
        created_at: new Date() 
    },
    {
        from: "Krishna",
        to: "Radha",
        msg: "Dharmo Rakshathi Rakshitah",
        created_at: new Date() 
    },
];

Chat.insertMany(allChats);


