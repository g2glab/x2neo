import express, { Request, Response } from "express";
import Neo4JHandler from "./neo4j";

var ConfigFile = require('config');
var router = express.Router()

/**
 * @swagger
 * /graph:
 *   get:
 *     description: Get graphs with filtering 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: node_ids
 *         description: Filter by edges that both ends of edges are included in given node ids.
 *         type: number
 *       - name: node_labels
 *         description: Filter by edges that both ends of edges have any of given node labels.
 *         type: string
 *       - name: node_props
 *         description: Filter by edges that both ends of edges have any of given node props.
 *         type: key:value
 *       - name: limit
 *         description: limit records of graph
 *         type: number
 *     responses:
 *       200:
 *         description: success
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