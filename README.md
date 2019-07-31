# X2: A Universal Graph Adapter

### Getting Start

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
$ yarn install
$ yarn build
$ yarn start
```

Access to `http://localhost:3000/`.

`http://localhost:3000/api-docs` provides a swagger-UI of this API definition.
