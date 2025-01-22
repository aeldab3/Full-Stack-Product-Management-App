const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const path = require("path");
require("dotenv").config();

const url = process.env.DATABASE_URL;

mongoose.connect(url).then(() => {
    console.log("Database connected");
});

app.use(cors({
    origin: 'http://localhost:4200'
}));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const productRouter = require("./routes/product.route");
const userRouter = require("./routes/user.route");

app.use("/api/products", productRouter);
app.use("/api/users", userRouter);

app.use('*', (req, res, next) => {
    return res.status(404).json({status: httpStatusText.ERROR, data: null, message: "This route is not found"});
});

app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});