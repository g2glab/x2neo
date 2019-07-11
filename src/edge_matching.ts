import express, { Request, Response } from "express";
import Neo4JHandler from "./neo4j";

var ConfigFile = require('config');
var router = express.Router()

/**
 * @swagger
 * /edge_match:
 *   get:
 *     summary: "Graph Retrieval By Edge Matching"
 *     tags:
 *       - name: Retrieval
 *     description: Get graphs by edge matching
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: node_ids
 *         description: Filter by edges that both ends of edges are included in given node ids.
 *         in: "query"
 *         type: array
 *         items: 
 *           type: integer
 *           example: 851
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
 *       - name: limit
 *         in: "query"
 *         description: limit records of graph
 *         type: integer
 *         example: 100
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
            Neo4JHandler.get_graph(req, res)
            break;
    
        default:
            break;
    }
})

module.exports = router