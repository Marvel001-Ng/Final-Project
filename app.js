require("dotenv").config()
const express = require("express");
const app = express()
const cors = require("cors")
const connectDB = require("./config/database");
const authRouter = require("./Route/authRoute")
const PORT = process.env.PORT || 7000


app.use(express.json());
app.use(cors());

app.use("/Tour-Edo/auth", authRouter)
// app.use("/", (req, res) => {
//     res.send("<h1>welcome</h1>")

// })
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        console.log("connected to DB")
        app.listen(PORT,()=>{
        console.log(`server running at port ${PORT}`)
})
    } catch (error) {
        console.error("Failed to start server:", error.message)
    }
}
start();