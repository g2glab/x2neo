var ConfigFile = require('config');

const body = {
    "statements" : [ {
        "statement" : "Match (n)-[r]-() WHERE r.country=\"Japan\" RETURN n,r",
        "resultDataContents" : [ "row", "graph" ]
    } ]
}

const default_options = {
    method: 'POST',
    body: JSON.stringify(body).replace(/\\"/g, '\\"'),
    headers: {'Content-Type': 'application/json', 'accept': 'application/json', 'Authorization': ConfigFile.db.auth || 'Basic bmVvNGo6bmVvNGp0ZXN0'}
}