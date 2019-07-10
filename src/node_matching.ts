import express, { Request, Response } from "express";
import Neo4JHandler from "./neo4j";

var ConfigFile = require('config');
var router = express.Router()

/**
 * @swagger
 * /node_match:
 *   get:
 *     summary: "Graph Retrieval By Node Matching"
 *     tags:
 *       - name: Retrieval
 *     description: Get graphs by node matching
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: node_ids
 *         description: Filter by nodes such that those ids are included in given node ids.
 *         in: "query"
 *         type: array
 *         items: 
 *           type: integer
 *       - name: node_labels
 *         description: Filter by nodes such that those labels are included in given node labels.
 *         in: "query"
 *         type: array
 *         items:
 *           type: string
 *       - name: node_props
 *         description: Filter by nodes such that those props are included in given node props.
 *         type: array
 *         in: "query"
 *         items:
 *           type: string
 *       - name: edge_ids
 *         description: Filter by nodes such that those adjacent edges ids are included in given edge ids.
 *         type: array
 *         items: 
 *           type: integer
 *         in: "query"
 *       - name: edge_labels
 *         description: Filter by nodes such that those adjacent edges labels are included in given edge labels.
 *         type: array
 *         items: 
 *           type: string
 *         in: "query"
 *       - name: edge_props
 *         description: Filter by nodes such that those adjacent edges props are included in given edge props.
 *         type: array
 *         items: 
 *           type: string
 *         in: "query"
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
            Neo4JHandler.traverse_graph(req, res, false)
            break;
    
        default:
            break;
    }
})

module.exports = router