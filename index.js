require("dotenv").config();
const express = require("express");
const app = express();
const connectToDb = require("./conn");
const cors = require("cors");
const loginRoute = require("./Router/login");
const verify = require("./Middleware/index");
var bodyParser = require("body-parser");
const Chat = require("./Modal/messageSchema");

connectToDb();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use("/login", loginRoute);

app.post("/api/messages/:userId", verify, async (req, res) => {
  const { userId } = req.params;
  const { id } = req;
  try {
    const messages = await Chat.find({
      $or: [
        { sender: id, receiver: userId },
        { sender: userId, receiver: id },
      ],
    }).sort({
      createdAt: -1,
    });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(5000, () => {
  console.log(`App is listening at port ${5000}`);
});
