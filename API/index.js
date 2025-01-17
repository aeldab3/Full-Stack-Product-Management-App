const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
require("dotenv").config();

const url = process.env.DATABASE_URL;

mongoose.connect(url).then(() => {
    console.log("Database connected");
});

app.use(cors({
    origin: 'http://localhost:4200'
}));
app.use(express.json());

const productRouter = require("./routes/product.route");
const userRouter = require("./routes/user.route");

app.use("/api/products", productRouter);
app.use("/api/users", userRouter);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});