import express, { Request, Response } from "express";
import Neo4JHandler from "./neo4j";

var ConfigFile = require('config');
var router = express.Router()

/**
 * @swagger
 * /compute/personalized_pagerank:
 *   get:
 *     summary: "Graph Computation"
 *     tags:
 *       - name: Computation
 *     description: Write personalized pagerank value on each node.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: from_node_id
 *         description: Specify a source node that has given node id.
 *         in: "query"
 *         type: integer
 *       - name: from_node_label
 *         description: Specify a source node that has given node label.
 *         in: "query"
 *         type: string
 *       - name: from_node_props
 *         description: Specify a source node that has given node props.
 *         type: array
 *         in: "query"
 *         items:
 *           type: string
 *       - name: to_node_id
 *         description: Specify a target node that has given node id.
 *         in: "query"
 *         type: integer
 *       - name: to_node_label
 *         description: Specify a target node that has given node label.
 *         in: "query"
 *         type: string
 *       - name: to_node_props
 *         description: Specify a target node that has given node props.
 *         type: array
 *         in: "query"
 *         items:
 *           type: string
 *       - name: edge_label
 *         description: Filter by edges such that those label equals the given label.
 *         type: string
 *         in: "query"
 *       - name: max_iterations
 *         in: "query"
 *         description: the maximum number of iterations of pagerank  (>=0).
 *         type: integer
 *       - name: dumpling_factor
 *         in: "query"
 *         description: the damping factor of the pagerank calculation. (>=0).
 *         type: float
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
            Neo4JHandler.personalized_pagerank(req, res)
            break;
    
        default:
            break;
    }
})

module.exports = router
