require("dotenv").config()
const express = require("express");
const app = express()
const cors = require("cors")
const connectDB = require("./config/database");
const authRouter = require("./Route/authRoute");
const attractionRouter = require("./Route/attractionsRoute");
const reviewRoute = require("./Route/review")
const bookingRoute = require("./Route/bookingRoute")
const eventRoute = require("./Route/eventRoute")
const hotelRoute = require("./Route/hotel")
const recommendation = require("./Route/recommendation")
const userRoute = require("./Route/userRoute")
const paymentRoute = require("./Route/payment")
const PORT = process.env.PORT || 7000


app.use(express.json());
app.use(cors());

app.use("/Tour-Edo/auth", authRouter)
app.use("/Tour-Edo/attraction", attractionRouter)
app.use("/Tour-Edo/review", reviewRoute)
app.use("/Tour-Edo/booking", bookingRoute)
app.use("/Tour-Edo/event", eventRoute)
app.use("/Tour-Edo/hotel", hotelRoute)
app.use("/Tour-Edo/recommendation", recommendation)
app.use("/Tour-Edo/user", userRoute)
app.use("/Tour-Edo/payment", paymentRoute)

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