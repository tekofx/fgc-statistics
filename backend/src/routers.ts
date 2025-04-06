import express from "express";
import trainModel from "./trainModel";
import {fetchData} from "./database";


const router = express.Router();


router.get("/time", async (req, res) => {

    const line = req.query.line;

    const pipeline: any[] = [];
    if (line) {
        pipeline.push({$match: {line: line}});
    }

    pipeline.push(
        {
            $group: {
                _id: {
                    hour: {$hour: "$time"}
                },
                averageOccupation: {$avg: "$occupation"}
            }
        },
        {
            $sort: {"_id.hour": 1}
        },
        {
            $project: {
                _id: 0,
                hour: "$_id.hour",
                averageOccupation: {$round: [{$multiply: ["$averageOccupation", 100]}, 2]}
            }
        }
    );


    await trainModel.aggregate(pipeline).then((data) => {
        res.json(data);
    }).catch((err) => {
        console.log(err);
        res.status(500).json({error: "Error fetching data"});
    })

})

router.get('/data', async (req, res) => {
    await trainModel.find({}).then((data) => {
        res.json(data);
    })
})

router.get("/fetch", async (req, res) => {
    await fetchData();
    await trainModel.find({}).then((data) => {
        res.json(data);
    })
})

export default router;