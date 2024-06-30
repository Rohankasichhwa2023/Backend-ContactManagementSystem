const contact = require("./routes/contact.route.js");
const user = require("./routes/user.route.js");
const connectDB = require("./config/dbConnection.js");
const errorHandler = require("./middleware/errorhandler.js");
const dotenv = require("dotenv").config();

connectDB();
const express = require("express");
const app = express();

app.use(express.json());

app.use("/api/contacts", contact);
app.use("/api/users", user);
app.use(errorHandler);

app.listen(5000, () => {
  console.log("Server is listening at port 5000");
});
