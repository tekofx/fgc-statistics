import express from "express";
import trainModel from "./trainModel";


const router = express.Router();


router.get("/occupation", async (req, res) => {
    const line = req.query.line;
    const nextStop = req.query.nextStop;
    const from = req.query.from ? new Date(req.query.from as string) : null;
    const to = req.query.to ? new Date(req.query.to as string) : null;

    console.log(line, from, to, nextStop);

    const pipeline: any[] = [];

    if (line) {
        pipeline.push({ $match: { line: line } });
    }

    if (nextStop) {
        pipeline.push({
            $match: {
                $expr: {
                    $eq: [{ $arrayElemAt: ["$nextStops", 0] }, nextStop]
                }
            }
        });
    }

    if (from) {
        pipeline.push({ $match: { time: { $gte: from } } });
    }

    if (to) {
        pipeline.push({ $match: { time: { $lte: to } } });
    }

    pipeline.push(
        {
            $group: {
                _id: {
                    hour: { $hour: "$time" }
                },
                averageOccupation: { $avg: "$occupation" }
            }
        },
        {
            $sort: { "_id.hour": 1 }
        },
        {
            $project: {
                _id: 0,
                hour: "$_id.hour",
                averageOccupation: { $round: [{ $multiply: ["$averageOccupation", 100] }, 2] }
            }
        }
    );

    await trainModel.aggregate(pipeline).then((data) => {
        res.json(data);
    }).catch((err) => {
        console.log(err);
        res.status(500).json({ error: "Error fetching data" });
    });
});
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

    // Add a $limit stage to restrict the number of entries to 100
    pipeline.push({$limit: 100});

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
                data: {
                    $map: {
                        input: "$data",
                        as: "item",
                        in: {
                            id: "$$item._id",
                            time: {
                                $dateToString: {
                                    format: "%d/%m/%Y %H:%M",
                                    date: "$$item.time",
                                    timezone: "UTC"
                                }
                            },
                            line: "$$item.line",
                            origin: "$$item.origin",
                            destination: "$$item.destination",
                            occupation: "$$item.occupation",
                            nextStops: {
                                $reduce: {
                                    input: "$$item.nextStops",
                                    initialValue: "",
                                    in: {
                                        $concat: [
                                            "$$value",
                                            {$cond: [{$eq: ["$$value", ""]}, "", ", "]},
                                            "$$this"
                                        ]
                                    }
                                }
                            }
                        }
                    }
                },
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

export default router;