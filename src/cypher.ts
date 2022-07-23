function properties_to_cypher(properties: object): string {
  let result = '{'
  for(var key in properties) {
    result += `${key}:"${properties[key]}",`
  }
  return (result.slice(0, -1) + '}')
}

function update_cypher(pg: object): string {
    pg.nodes.forEach(node => {
        let properties = properties_to_cypher(node.properties)
        let label = node.labels[0];
        let cypher = `MERGE (n:${label} ${properties})`
        execute_cypher(cypher);
    });

    pg.edges.forEach(edge => {
        let propoerties = properties_to_cypher(edge.properties)
        let label = edge.labels[0];
        let cypher = `MERGE (from)-[edge:${label} ${properties}]-(to) WHERE from.id = ${edge.from} AND to.id = ${edge.to}`
        execute_cypher(cypher);
    });
}


function update_opts(cypher: string): any {
    return ({
        method: 'POST',
        body: JSON.stringify({"statements" : [ {
            "statement" : cypher,
            "resultDataContents" : [ "row", "graph" ]
        }]}).replace(/\\"/g, '\\"'),
        headers: {'Content-Type': 'application/json', 'accept': 'application/json', 'Authorization': ConfigFile.db.auth || 'Basic bmVvNGo6bmVvNGp0ZXN0'}
    })
}

function execute_cypher(cypher: any): {
    fetch(url + '/db/data/transaction/commit', update_opts(cypher))
    .then(body => body.json())
    .then(json => res.json()))
    .catch(e => {console.error(e); res.status(500).send({ error: 'FetchError: request to backend.' })});
}

function shortest_cypher(query: any, k: number | string, m: number): string {
    let from_node_props_hash = query.from_node_props || {}; // {city: "Bangkok"}
    let to_node_props_hash = query.to_node_props || {}; // {city: "Kagoshima"}

    let where = "";
    const from_node_id = query.from_node_id;
    if (from_node_id !== "") { where += `id(start) = ${from_node_id} ` };
    const from_node_label = query.from_node_label ? ":" + query.from_node_label : ""; //  "airport"
    const from_node_props = JSON.stringify(from_node_props_hash).replace(/\"([^(\")"]+)\":/g,"$1:").replace(/\\"/g, '\\"'); // Remove double quotes on keys
    const to_node_id = query.to_node_id;
    if (to_node_id !== "") { where += (where === "") ? `id(end) = ${to_node_id}` : `AND id(end) = ${to_node_id}`  };
    if (where !== "") { where = `WHERE ${where}` }
    const to_node_label = query.to_node_label ? ":" + query.to_node_label : "" ; //":" + "airport"
    const to_node_props = JSON.stringify(to_node_props_hash).replace(/\"([^(\")"]+)\":/g,"$1:").replace(/\\"/g, '\\"'); // Remove double quotes on keys
    const edge_label = query.edge_label ? ":" + query.edge_label : "*"; // "has_flight_to"
    let iteration = edge_label == "*" ? "" : "*";
    if (m >= 2) {
        m = 1
    }
    if (k !== "*" || m !== 0) {
        iteration = m.toString() + ".." + (k.toString() === "*" ? "" : k.toString())
    }
    return `MATCH p=shortestPath((start${from_node_label} ${from_node_props})-[${edge_label}${iteration}]-(end${to_node_label} ${to_node_props})) ${where} RETURN p`
}

function cycle_cypher(query: any, k: number | string, m: number): string {
    let node_props_hash = query.node_props || {}; // {city: "Kagoshima"}

    let where = "";
    const node_id = query.node_id;
    if (node_id !== "") { where += `WHERE id(start) = ${node_id} AND id(end) = ${node_id}` };
    const node_label = query.node_label ? ":" + query.node_label : ""; //  "airport"
    const node_props = JSON.stringify(node_props_hash).replace(/\"([^(\")"]+)\":/g,"$1:").replace(/\\"/g, '\\"'); // Remove double quotes on keys
    const edge_label = query.edge_label ? ":" + query.edge_label : "*"; // "has_flight_to"
    const edge_first_label = query.edge_label ? (":" + query.edge_label) : "";
    let iteration = edge_label == "*" ? "" : "*";
    const max_hops = (k > 0) ? k - 1 : k;
    const min_hops = (m > 0) ? ((m > 2) ? 2 : m - 1) : m;
    if (k !== "*" || m !== 0) {
        iteration = min_hops.toString() + ".." + (max_hops.toString() === "*" ? "" : max_hops.toString())
    }
    return `MATCH
    (start${node_label} ${node_props})-[e${edge_first_label}]->(m2),
    cyclePath=shortestPath((m2)-[${edge_label}${iteration}]->(end${node_label} ${node_props}))
    ${where} RETURN start, e, cyclePath`

    /* 
    const edge_label = query.edge_label ? "e:" + query.edge_label : "e";
    `MATCH
    (start${node_label} ${node_props})-[e${edge_first_label}]-(m2),
    cyclePath=shortestPath((m2)-[${edge_label}${iteration}]-(end${node_label} ${node_props}))
    ${where} AND NOT (NOT e in p ) RETURN start, e, cyclePath` 
    // but it fails due to shortestPath cannot select 2-top query. Currently undirected graph is not supported.
    */
}


function traverse_cypher(query: string, values: Array<string>, iterator: number, directed: boolean): string {
    const arrow = directed ? "->" : "-";
    switch (query) {
        case "node_ids":
            return `MATCH p = (n)-[*0..${iterator}]${arrow}(node) WHERE ID(n) in [${values.join(",")}] WITH *, relationships(p) AS rels WITH *, nodes(p) AS ns UNWIND rels as r UNWIND ns as na RETURN DISTINCT r, na`
            break;
        
        case "node_labels":
            return `MATCH p = (n)-[*0..${iterator}]${arrow}(node) WHERE (${values.map(value => {return `"${value}" in LABELS(n)`}).join(" OR ")}) WITH *, relationships(p) AS rels WITH *, nodes(p) AS ns UNWIND rels as r UNWIND ns as na RETURN DISTINCT r, na`
            break;
    
        case "node_props":
            return `MATCH p = (n)-[*0..${iterator}]${arrow}(node) WHERE (${parse_props_as_array(values).map(value => {return `n.${value[0]} = "${value[1]}"`}).join(" OR ")}) WITH *, relationships(p) AS rels WITH *, nodes(p) AS ns UNWIND rels as r UNWIND ns as na RETURN DISTINCT r, na`
            break;

        case "edge_ids":
            return `MATCH p = ()-[r]-()-[*0..${iterator}]${arrow}(node) WHERE ID(r) in [${values.join(",")}] WITH *, relationships(p) AS rels WITH *, nodes(p) AS ns UNWIND rels as r UNWIND ns as na RETURN DISTINCT r, na`
            break;

        case "edge_labels":
            return `MATCH p = ()-[r]-()-[*0..${iterator}]${arrow}(node) WHERE TYPE(r) in [${values.join(",")}] WITH *, relationships(p) AS rels WITH *, nodes(p) AS ns UNWIND rels as r UNWIND ns as na RETURN DISTINCT r, na`
            break;

        case "edge_props":
            return `MATCH p = ()-[r]-()-[*0..${iterator}]${arrow}(node) WHERE ${parse_props_as_array(values).map(value => {return `r.${value[0]} = "${value[1]}"`}).join(" OR ")} WITH *, relationships(p) AS rels WITH *, nodes(p) AS ns UNWIND rels as r UNWIND ns as na RETURN DISTINCT r, na`
            break;

        default:
            return "Match (n)-[r]-() RETURN n,r"
            break;
    }
}

function cypher(query: string, values: Array<string>): string {
    switch (query) {
        case "node_ids":   
            return `Match (n)-[r]-(m) WHERE ID(n) in [${values.join(",")}] AND ID(m) in [${typeof values === "string" ? values : values.join(",")}] RETURN n,r,m`
            break;

        case "node_labels":
            return `Match (n)-[r]-(m) WHERE (${values.map(value => {return `"${value}" in LABELS(n)`}).join(" OR ")}) AND (${values.map(value => {return `"${value}" in LABELS(m)`}).join(" OR ")}) RETURN n,r,m`
            break;
        
        case "node_props":
            return `MATCH (n)-[r]-(m) WHERE (${parse_props_as_array(values).map(value => {return `n.${value[0]} = "${value[1]}"`}).join(" OR ")}) AND (${parse_props_as_array(values).map(value => {return `m.${value[0]} = "${value[1]}"`}).join(" OR ")}) RETURN n,r,m`
            break;

        case "edge_ids":
            return `Match (n)-[r]-(m) WHERE ID(r) in [${values.join(",")}] RETURN *`
            break;

        case "edge_labels":
            return `Match (n)-[r]-(m) WHERE TYPE(r) in [${values.join(",")}] RETURN *`
            break;

        case "edge_props":
            return `Match (n)-[r]-(m) WHERE (${parse_props_as_array(values).map(value => {return `r.${value[0]} = "${value[1]}"`}).join(" OR ")}) RETURN *`
            break;
    
        default:
            return "Match (n)-[r]-() RETURN n,r"
            break;
    }
}
