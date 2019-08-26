import express, { Request, Response } from "express";
import Neo4JHandler from "./neo4j";

var ConfigFile = require('config');
var router = express.Router()

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: "Graph Profile"
 *     tags:
 *       - name: Profile
 *     description: Get data profiling of graphs
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: type
 *         description: Request types of metadata.
 *         in: "query"
 *         type: string
 *         enum:
 *           - node
 *           - edge
 *     responses:
 *       200:
 *         description: success
 */

router.get('', function (req: Request, res: Response) {
    switch (ConfigFile.db.dbms) {
        case "neo4j":
            Neo4JHandler.profile_graph(req, res)
            break;
    
        default:
            break;
    }
})

module.exports = router
