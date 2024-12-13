const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();


app.use(cors(
    {
        origin: [""],
        methods: ["POST", 'GET'],
        credentials: true
    }
));
app.use(bodyParser.json());


mongoose
    .connect("mongodb+srv://srikakulamchandu:Schandu1%23@cluster0.gjov8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error(err));


const formRoutes = require("./routes/formRoutes");
app.use("/api/forms", formRoutes);


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
