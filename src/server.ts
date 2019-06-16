import express, { Request, Response } from "express";
const fetch = require ('node-fetch')

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
console.log(options)

fetch('http://localhost:7474/db/data/transaction/commit', options)
	.then(res => res.json())
	.then(body => console.log(body));

const app = express();

app.get("/", (_req: Request, res: Response) => res.send("Hello World!"));

// app.listen(3000, () => console.log("Example app listening on port 3000!"));
