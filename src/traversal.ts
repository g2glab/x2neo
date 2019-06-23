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
 *         description: Filter by edges that both ends of edges are included in given node ids.
 *         in: "query"
 *         type: array
 *         items: 
 *           type: integer
 *       - name: node_labels
 *         description: Filter by edges that both ends of edges have any of given node labels.
 *         in: "query"
 *         type: array
 *         items:
 *           type: string
 *       - name: node_props
 *         description: Filter by edges that both ends of edges have any of given node props.
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
 *       - name: iteration
 *         in: "query"
 *         description: the number of iteration (>=0).
 *         type: integer
 *         required: true
 *       - name: limit
 *         in: "query"
 *         description: limit records of graph.
 *         type: integer
 *     responses:
 *       200:
 *         description: success
 *       400:
 *         description: invalid parameter
 */

router.get('', function (req: Request, res: Response) {
    switch (ConfigFile.db.dbms) {
        case "neo4j":
            Neo4JHandler.traverse_graph(req, res)
            break;
    
        default:
            break;
    }
})

module.exports = router