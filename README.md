# X2: A Universal Graph-DB Adapter

[![](https://images.microbadger.com/badges/version/g2glab/x2.svg)](https://microbadger.com/images/g2glab/x2 "Get your own version badge on microbadger.com") [Documentation](https://x2.readthedocs.io/en/latest/index.html)

We collected useful queries for graph visualization and provided them as REST API. X2 saves your time from annoying queries for graph database.

In addition, every endpoint returns a property graph exchange format called PG-JSON, by converting various outputs of graph databases.

### Getting Started

Pull and run Neo4j Docker container.

```bash
mkdir -p $HOME/work/x2/neo4j/data
docker run \
  --publish=7474:7474 --publish=7687:7687 \
  --volume=$HOME/work/x2/neo4j/data:/data \
  -e NEO4J_AUTH=neo4j/neo4jtest \
  --name neo4j \
  neo4j:3.5.5                # 3.5.5 is the latest on Jun 2
```

`node` is pre-required.

```bash
$ git clone https://github.com/g2glab/x2
$ cd x2
$ yarn install
$ yarn build
$ yarn start
```

Access to `http://localhost:3000/`.

`http://localhost:3000/api-docs` provides a swagger-UI of this API definition.

### Load neo4j CSV on creating nodes

Copy `*.neo.nodes` and `*.neo.edges` on `./neo4j` directory.

```
$ docker-compose build
$ docker-compose up
```