import express, { Request, Response } from "express";
import swaggerJSDoc from 'swagger-jsdoc';

var ConfigFile = require('config');

// const fetch = require ('node-fetch');
var graph = require('./graph');

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
            version: '1.0.0'
        },
    },
    apis: ['src/graph.ts'],
};

var swaggerSpec = swaggerJSDoc(options);

app.get('/api-docs.json', function(req, res){
    res.setHeader('Content-Type','application/json');
    res.send(swaggerSpec);
});

app.use("/graph", graph);

app.get("/", (_req: Request, res: Response) => res.send("Hello World!"));

app.listen(ConfigFile.web.port, () => console.log("Example app listening on port " + ConfigFile.web.port));
