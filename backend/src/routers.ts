import express from "express";
import trainModel from "./trainModel";
import {fetchData} from "./database";


const router = express.Router();


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

    pipeline.push({$limit: 100}); // Add a limit of 100 rows

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
router.get("/fetch", async (req, res) => {
    await fetchData();
    await trainModel.find({}).then((data) => {
        res.json(data);
    })
})

export default router;