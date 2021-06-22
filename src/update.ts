import express, { Request, Response } from "express";
import Neo4JHandler from "./neo4j";

var ConfigFile = require('config');
var router = express.Router()

/**
 * @swagger
 * /merge_graph:
 *   get:
 *     summary: "Graph Updating"
 *     tags:
 *       - name: Update
 *     description: Merge graphs with pg object.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: pg
 *         description: PG object to be merged.
 *         in: "query"
 *         type: object
 *       - name: debug
 *         in: "query"
 *         description: Response includes the queries on request for debugging.
 *         type: boolean
 *     responses:
 *       200:
 *         description: success
 *       400:
 *         description: invalid parameter
 *       500:
 *         description: internal server error
 */

router.get('', function (req: Request, res: Response) {
    switch (ConfigFile.db.dbms) {
        case "neo4j":
            Neo4JHandler.merge_graph(req, res, true)
            break;
    
        default:
            break;
    }
})

module.exports = router
