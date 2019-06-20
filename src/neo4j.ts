import express, { Request, Response } from "express";
import fetch from 'node-fetch';
var ConfigFile = require('config');

const body = {
    "statements" : [ {
        "statement" : "Match (n)-[r]-() WHERE r.country=\"Japan\" RETURN n,r",
        "resultDataContents" : [ "row", "graph" ]
    } ]
}
const options = {
    method: 'POST',
    body: JSON.stringify(body).replace(/\\"/g, '\\"'),
    headers: {'Content-Type': 'application/json', 'accept': 'application/json', 'Authorization': 'Basic bmVvNGo6bmVvNGp0ZXN0'}
}

const url = ConfigFile.db.host + ":"+ ConfigFile.db.port

export default class Neo4JHandler {
    constructor() {
    }

    static get_graph(req: Request) {
        console.log(req)
        fetch(url + '/db/data/transaction/commit', options)
            .then(res => res.json())
            .then(body => res.json(body))
            .catch(e => console.error(e));
    }
}