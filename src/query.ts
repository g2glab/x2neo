import express, { Request, Response } from "express";
import Neo4JHandler from "./neo4j";

var ConfigFile = require('config');
var router = express.Router()

/**
 * @swagger
 * /query:
 *   get:
 *     summary: "Graph Query"
 *     tags:
 *       - name: Query
 *     description: Get graphs with arbitral query.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: q
 *         description: Query for backend dbms.
 *         in: "query"
 *         type: string
 *     responses:
 *       200:
 *         description: success
 *       403:
 *         description: prohibited
 */
router.get('', function (req: Request, res: Response) {
    switch (ConfigFile.db.dbms) {
        case "neo4j":
            if (ConfigFile.db.query) {
                res.status(403)
            } else {
                Neo4JHandler.query(req, res)
            }
            break;
    
        default:
            break;
    }
})

module.exports = router