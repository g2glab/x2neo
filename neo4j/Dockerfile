FROM neo4j:4.1

ENV NEO4J_AUTH=neo4j/neo4jtest \
    GDS_VERSION=1.3.0

ENV GDS_URI https://github.com/neo4j/graph-data-science/releases/download/${GDS_VERSION}/neo4j-graph-data-science-${GDS_VERSION}-standalone.jar
RUN sh -c 'cd /var/lib/neo4j/plugins && wget "${GDS_URI}"'

EXPOSE 7474 7473 7687
CMD ["neo4j"]