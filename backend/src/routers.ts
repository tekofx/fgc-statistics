import express from "express";
import trainModel from "./trainModel";
import {fetchData} from "./database";


const router = express.Router();


router.get("/occupation", async (req, res) => {

    const line = req.query.line;
    const nextStop = req.query.nextStop;

    const pipeline: any[] = [];
    if (line) {
        pipeline.push({$match: {line: line}});
    }

    if (nextStop) {
        pipeline.push({
            $match: {
                $expr: {
                    $eq: [{$arrayElemAt: ["$nextStops", 0]}, nextStop]
                }
            }
        });
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
    const filter = req.query.filter as string | undefined;
    const sort = req.query.sort as string | undefined;

    const pipeline: any[] = [];

    if (filter) {
        const key = filter.split("=")[0];
        const value = filter.split("=")[1];
        pipeline.push({
            $match: {
                [key]: {
                    $regex: value,
                    $options: "i"
                }
            }
        });
    }

    if (sort) {
        const sortKey = sort.split(":")[0];
        const sortDirection = parseInt(sort.split(":")[1]);
        pipeline.push({$sort: {[sortKey]: sortDirection}});
    }

    const filtersPipeline = [
        {
            $facet: {
                data: pipeline.length > 0 ? pipeline : [{$match: {}}],
                filters: [
                    {
                        $group: {
                            _id: null,
                            line: {$addToSet: "$line"},
                            origin: {$addToSet: "$origin"},
                            destination: {$addToSet: "$destination"},
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            filters: {
                                line: "$line",
                                origin: "$origin",
                                destination: "$destination",
                            }
                        }
                    }
                ]
            }
        },
        {
            $project: {
                data: 1,
                filters: {$arrayElemAt: ["$filters.filters", 0]}
            }
        }
    ];
    await trainModel.aggregate(filtersPipeline).then((result) => {
        const response = result[0];
        res.json(response);
    }).catch((err) => {
        console.log(err);
        res.status(500).json({error: "Error fetching data"});
    });
});
router.get("/fetch", async (req, res) => {
    await fetchData();
    await trainModel.find({}).then((data) => {
        res.json(data);
    })
})

export default router;