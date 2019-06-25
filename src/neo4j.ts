import express, { Request, Response } from "express";
import fetch from 'node-fetch';
import { json } from "body-parser";
import { stringify } from "querystring";
let pg = require('./pg.js');
var ConfigFile = require('config');

function traverse_cypher(query: string, values: Array<string>, iterator: number): string {
    switch (query) {
        case "node_ids":
            return `MATCH p = (n)-[*0..${iterator}]->(node) WHERE ID(n) in [${values.join(",")}] WITH *, relationships(p) AS rels WITH *, nodes(p) AS ns UNWIND rels as r UNWIND ns as na RETURN DISTINCT r, na`
            break;
        
        case "node_labels":
            return `MATCH p = (n)-[*0..${iterator}]->(node) WHERE (${values.map(value => {return `"${value}" in LABELS(n)`}).join(" OR ")}) WITH *, relationships(p) AS rels WITH *, nodes(p) AS ns UNWIND rels as r UNWIND ns as na RETURN DISTINCT r, na`
            break;
    
        case "node_props":
            return `MATCH p = (n)-[*0..${iterator}]->(node) WHERE (${parse_props_as_array(values).map(value => {return `n.${value[0]} = "${value[1]}"`}).join(" OR ")}) WITH *, relationships(p) AS rels WITH *, nodes(p) AS ns UNWIND rels as r UNWIND ns as na RETURN DISTINCT r, na`
            break;

        case "edge_ids":
            return `MATCH p = ()-[r]-()-[*0..${iterator}]->(node) WHERE ID(r) in [${values.join(",")}] WITH *, relationships(p) AS rels WITH *, nodes(p) AS ns UNWIND rels as r UNWIND ns as na RETURN DISTINCT r, na`
            break;

        case "edge_labels":
            return `MATCH p = ()-[r]-()-[*0..${iterator}]->(node) WHERE TYPE(r) in [${values.join(",")}] WITH *, relationships(p) AS rels WITH *, nodes(p) AS ns UNWIND rels as r UNWIND ns as na RETURN DISTINCT r, na`
            break;

        case "edge_props":
            return `MATCH p = ()-[r]-()-[*0..${iterator}]->(node) WHERE ${parse_props_as_array(values).map(value => {return `r.${value[0]} = "${value[1]}"`}).join(" OR ")} WITH *, relationships(p) AS rels WITH *, nodes(p) AS ns UNWIND rels as r UNWIND ns as na RETURN DISTINCT r, na`
            break;

        default:
            break;
    }
    return "Match (n)-[r]-() WHERE r.country=\"Japan\" RETURN n,r"
}

function cypher(query: string, values: string | Array<string>): string {
    switch (query) {
        case "node_ids":   
            return `Match (n)-[r]-(m) WHERE ID(n) in [${typeof values === "string" ? values : values.join(",")}] AND ID(m) in [${typeof values === "string" ? values : values.join(",")}] RETURN n,r,m`
            break;

        case "node_labels":
            return `Match (n)-[r]-(m) WHERE (${typeof values === "string" ? `"${values}" in LABELS(n)` : values.map(value => {return `"${value}" in LABELS(n)`}).join(" OR ")}) AND (${typeof values === "string" ? `"${values}" in LABELS(m)` : values.map(value => {return `"${value}" in LABELS(m)`}).join(" OR ")}) RETURN n,r,m`
            break;
        
        case "node_props":
            return `MATCH (n)-[r]-(m) WHERE (${parse_props_as_array(values).map(value => {return `n.${value[0]} = "${value[1]}"`}).join(" OR ")}) AND (${parse_props_as_array(values).map(value => {return `m.${value[0]} = "${value[1]}"`}).join(" OR ")}) RETURN n,r,m`
            break;

        case "edge_ids":
            return `Match (n)-[r]-(m) WHERE ID(r) in [${valuesToArray(values).join(",")}] RETURN *`
            break;

        case "edge_labels":
            return `Match (n)-[r]-(m) WHERE TYPE(r) in [${valuesToArray(values).join(",")}] RETURN *`
            break;

        case "edge_props":
            return `Match (n)-[r]-(m) WHERE (${parse_props_as_array(values).map(value => {return `r.${value[0]} = "${value[1]}"`}).join(" OR ")}) RETURN *`
            break;
    
        default:
            return "Match (n)-[r]-() RETURN n,r"
            break;
    }
    return "Match (n)-[r]-() WHERE r.country=\"Japan\" RETURN n,r"
}

function valuesToArray(values: string | Array<string>): Array<string> {
    switch (typeof values) {
        case "string":
            return [values];
            break;
    
        default:
            return values;
            break;
    }
}

function parse_props_as_array(values: string | Array<string>): Array<[string, string]> {
    let map: [string, string][] = [];
    switch (typeof values) {
        case "string":
            const pair = values.split(/\:|\;/);
            map.push([pair[0], pair[1]]);
            break;
    
        default:
            values.forEach(value => {
                const pair = value.split(/\:|\;/);
                map.push([pair[0], pair[1]]);
            })
            break;
    }
    return map;
}

function opts(query: string, values: string | Array<string>, limit: number): any {
    return ({
        method: 'POST',
        body: JSON.stringify({"statements" : [ {
            "statement" : limit > 0 ? cypher(query, values) + ` LIMIT ${limit}` : cypher(query, values),
            "resultDataContents" : [ "row", "graph" ]
        }]}).replace(/\\"/g, '\\"'),
        headers: {'Content-Type': 'application/json', 'accept': 'application/json', 'Authorization': 'Basic bmVvNGo6bmVvNGp0ZXN0'}
    })
}

function traverse_opts(query: string, values: string | Array<string>, iteration: number, limit: number): any {
    return ({
        method: 'POST',
        body: JSON.stringify({"statements" : [ {
            "statement" : limit > 0 ? traverse_cypher(query, valuesToArray(values), iteration) + ` LIMIT ${limit}` :  traverse_cypher(query, valuesToArray(values), iteration),
            "resultDataContents" : [ "row", "graph" ]
        }]}).replace(/\\"/g, '\\"'),
        headers: {'Content-Type': 'application/json', 'accept': 'application/json', 'Authorization': 'Basic bmVvNGo6bmVvNGp0ZXN0'}
    })
}

const url = ConfigFile.db.host + ":"+ ConfigFile.db.port

export default class Neo4JHandler {
    constructor() {
    }

    static neo4j2pg(response: any) {
        let graph = new pg.Graph();
        response.results[0].data.forEach(element => {
            element.graph.nodes.forEach(node_elem => {
                let node = new pg.Node(node_elem.id);
                node_elem.labels.forEach(label => {
                    node.addLabel(label);
                })
                Object.keys(node_elem.properties).forEach(key => {
                    node.addProperty(key, node_elem.properties[key]);
                })
                graph.addNode(node.id, node);
            });
            element.graph.relationships.forEach(rel => {
                let edge = new pg.Edge(rel.startNode, rel.endNode);
                edge.addLabel(rel.type);
                edge.addProperty('id', rel.id);
                Object.keys(rel.properties).forEach(key => {
                    edge.addProperty(key, rel.properties[key]);
                })
                graph.addEdge(edge)
            });
        });
        return graph
    }

    static traverse_graph(req: Request, res: Response) {
        var options;
        let iteration = parseInt(req.query.iteration);
        if (iteration < 0) {
            res.status(400);
        }
        let limit = parseInt(req.query.limit);
        if (limit <= 0) {
            res.status(400);
        }
        if (req.query.node_ids !== undefined) {
            options = traverse_opts("node_ids", req.query.node_ids, iteration, limit)
        } else if (req.query.node_labels !== undefined) {
            options = traverse_opts("node_labels", req.query.node_labels, iteration, limit);
        } else if (req.query.node_props !== undefined) {
            options = traverse_opts("node_props", req.query.node_props, iteration, limit);
        } else if (req.query.edge_ids !== undefined) {
            options = traverse_opts("edge_ids", req.query.edge_ids, iteration, limit);
        } else if (req.query.edge_labels !== undefined) {
            options = traverse_opts("edge_labels", req.query.edge_labels, iteration, limit);
        } else if (req.query.edge_props !== undefined) {
            options = traverse_opts("edge_props", req.query.edge_props, iteration, limit);
        } else {
            res.status(400);
        }
        console.log(req.query, options)

        fetch(url + '/db/data/transaction/commit', options)
            .then(body => body.json())
            //.then(json => res.json(json))
            .then(json => res.json(Neo4JHandler.neo4j2pg(json)))
            .catch(e => console.error(e));
    }

    static get_graph(req: Request, res: Response) {
        let limit = parseInt(req.query.limit);
        if (limit <= 0) {
            res.status(400);
        }

        var options;
        if (req.query.node_ids !== undefined) {
            options = opts("node_ids", req.query.node_ids, limit);
        } else if (req.query.node_labels !== undefined) {
            options = opts("node_labels", req.query.node_labels, limit);
        } else if (req.query.node_props !== undefined) {
            options = opts("node_props", req.query.node_props, limit);
        } else if (req.query.edge_ids !== undefined) {
            options = opts("edge_ids", req.query.edge_ids, limit);
        } else if (req.query.edge_labels !== undefined) {
            options = opts("edge_labels", req.query.edge_labels, limit);
        } else if (req.query.edge_props !== undefined) {
            options = opts("edge_props", req.query.edge_props, limit);
        } else {
            options = opts("", "", limit);
        }
        console.log(req.query, options)

        fetch(url + '/db/data/transaction/commit', options)
            .then(body => body.json())
            //.then(json => res.json(json))
            .then(json => res.json(Neo4JHandler.neo4j2pg(json)))
            .catch(e => console.error(e));
    }
}