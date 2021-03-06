import express, { Request, Response } from "express";
import Neo4JHandler from "./neo4j";

var ConfigFile = require('config');
var router = express.Router()

/**
 * @swagger
 * /traversal:
 *   get:
 *     summary: "Graph Traversal"
 *     tags:
 *       - name: Traversal
 *     description: Get graphs with traversing from the specified nodes or edges
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: node_ids
 *         description: Filter by edges that either end of edges are included in given node ids.
 *         in: "query"
 *         type: array
 *         items: 
 *           type: integer
 *       - name: node_labels
 *         description: Filter by edges that either end of edges have any of given node labels.
 *         in: "query"
 *         type: array
 *         items:
 *           type: string
 *       - name: node_props
 *         description: Filter by edges that either end of edges have any of given node props.
 *         type: array
 *         in: "query"
 *         items:
 *           type: string
 *       - name: edge_ids
 *         description: Filter by edges such that those ids are included in given edge ids.
 *         type: array
 *         items: 
 *           type: integer
 *         in: "query"
 *       - name: edge_labels
 *         description: Filter by edges such that those ids are included in given edge labels.
 *         type: array
 *         items: 
 *           type: string
 *         in: "query"
 *       - name: edge_props
 *         description: Filter by edges such that those ids are included in given edge props.
 *         type: array
 *         items: 
 *           type: string
 *         in: "query"
 *       - name: max_hops
 *         in: "query"
 *         description: The number of maximal iteration (>=0).
 *         type: integer
 *         required: true
 *         default: 2
 *       - name: directed
 *         in: "query"
 *         description: Consider only forward-edge when the traversal is computed.
 *         type: boolean
 *         default: true
 *       - name: limit
 *         in: "query"
 *         description: Limit records of graph.
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
            Neo4JHandler.traverse_graph(req, res, true)
            break;
    
        default:
            break;
    }
})

module.exports = router
