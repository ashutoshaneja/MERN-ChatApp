const express = require("express");
const app = express();
const path = require("path");
const cors = require('cors')

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const server = require("http").createServer(app);
const io = require("socket.io")(server);
const config = require("./config/key");

const { Chat } = require("./models/Chat");

const mongoose = require("mongoose");
const connect = mongoose.connect(config.mongoURI,
  {
    useNewUrlParser: true, useUnifiedTopology: true,
    useCreateIndex: true, useFindAndModify: false
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api/users', require('./routes/users'));
app.use('/api/chat', require('./routes/chat'));

io.on("connection", socket => {
  socket.on("Input Chat Message", msg => {
    connect.then(db => {
      try {
        let chat = new Chat({ message: msg.chatMessage, sender: msg.userId, type: msg.type })

        chat.save((err, doc) => {
          if(err) return res.json({success: false, err})
          
          console.log("inside chat.save");
          Chat.find({"_id": doc._id})
          .populate("sender")
          .exec((err, doc) => {
            return io.emit("Output Chat Message", doc);
          })
        })

      } catch (error) {
        console.log(error)
      }
    })
  })

})
/* Netlify Deployment Code
app.use('/uploads', express.static('uploads'));

if (process.env.NODE_ENV === "production") {

  app.use(express.static("client/build"));

  // index.html for all page routes    html or routing and naviagtion
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
} */

const port = process.env.PORT || 5000

server.listen(port, () => {
  console.log(`Server Listening on ${port}`)
});