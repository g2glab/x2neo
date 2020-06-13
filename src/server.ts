import express, { Request, Response } from "express";
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

var ConfigFile = require('config');
var shortest = require('./shortest');
var edge_matching = require('./edge_matching');
var node_matching = require('./node_matching');
var traversal = require('./traversal');
var query = require('./query');
var profile = require('./profile');

const app = express();

// SWAGGER

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var options = {
    swaggerDefinition: {
        info: {
            title: 'X2 API',
            version: '0.2.0',
            license: {
                name: "MIT"
            }
        },
    },
    apis: ['src/node_matching.ts', 'src/edge_matching.ts', 'src/traversal.ts', 'src/*.ts'],
};

var swaggerSpec = swaggerJSDoc(options);

app.get('/api-docs.json', function(req, res){
    res.setHeader('Content-Type','application/json');
    res.send(swaggerSpec);
});

var ui_options = {
    explorer: true
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, ui_options));

// GRAPH API

app.use("/node_match", node_matching);
app.use("/edge_match", edge_matching);
app.use("/traversal", traversal);
app.use("/query", query);
app.use("/shortest", shortest);
app.use("/cycle", shortest);
app.use("/profile", profile);

app.get("/", (_req: Request, res: Response) => res.send("X2 API"));

app.listen(ConfigFile.web.port, () => console.log("Example app listening on port " + ConfigFile.web.port));
