import express, { Request, Response } from "express";
import Neo4JHandler from "./neo4j";

var ConfigFile = require('config');
var router = express.Router()

/**
 * @swagger
 * /cycle:
 *   get:
 *     summary: "Graph Computation"
 *     tags:
 *       - name: Computation
 *     description: Find a cycle for the query.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: node_id
 *         description: Specify a source node that has given node id.
 *         in: "query"
 *         type: integer
 *       - name: node_label
 *         description: Specify a source node that has given node label.
 *         in: "query"
 *         type: string
 *       - name: node_props
 *         description: Specify a source node that has given node props.
 *         type: array
 *         in: "query"
 *         items:
 *           type: string
 *       - name: edge_label
 *         description: Filter by edges such that those label equals the given label.
 *         type: string
 *         in: "query"
 *       - name: max_hops
 *         in: "query"
 *         description: the number of maximum hops (>=0).
 *         type: integer
 *       - name: min_hops
 *         in: "query"
 *         description: the number of minimum hops (>=0).
 *         type: integer
 *       - name: limit
 *         in: "query"
 *         description: limit records of graph.
 *         type: integer
 *         default: 1000
 *       - name: debug
 *         in: "query"
 *         description: Response includes the queries on request for debugging.
 *         type: boolean
 *     responses:
 *       200:
 *         description: success
 *       400:
 *         description: invalid parameter
 */

router.get('', function (req: Request, res: Response) {
    switch (ConfigFile.db.dbms) {
        case "neo4j":
            Neo4JHandler.shortest_path(req, res, true)
            break;
    
        default:
            break;
    }
})

module.exports = router
