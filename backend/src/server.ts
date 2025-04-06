import express from "express";
import {connectDB, fetchData} from "./database";
import cors from "cors";
import * as path from "node:path";
import cron from "node-cron";
import router from "./routers";

const app = express();
const port = 1234;


// Middleware
app.use(cors())
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/api", router)

connectDB();


// Serve the index.html file in production
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

fetchData()


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
    cron.schedule("* * * * *", async () => {
        await fetchData();
    })
})

