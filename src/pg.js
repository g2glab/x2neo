
exports.Graph = function() {

  //this.nodes = new Map();
  //this.nodes = {};
  this.nodes = new Array();
  this.edges = new Array();

  this.addNode = function(node) {
    //this.nodes.set(id, node);
    //this.nodes[id] = node;
    this.nodes.push(node);
  }

  this.addEdge = function(edge) {
    this.edges.push(edge);
  }

  // TO BE DELETED
  this.setNodeLabel = function(id, label) {
    if (node = this.getNode(id)) {
      node.addLabel(label);
    } else {
      console.log('The node does not exist. ID: ' + id);
    }
  }

  // TO BE DELETED
  this.setNodeProperty = function(id, key, value) {
    if (node = this.getNode(id)) {
      node.addProperty(label);
    } else {
      console.log('The node does not exist. ID: ' + id);
    }
  }

  this.exportJSON = function() {
    let json = JSON.stringify(this, null, 2);
    return json;
  }

}

exports.Node = function(id) {

  this.id = id;
  //this.labels = new Set();
  //this.properties = new Map();
  this.labels = [];
  this.properties = {};

  this.addLabel = function(label) {
    //this.labels.add(label);
    this.labels[this.labels.length] = label;
  }

  this.addProperty = function(key, value) {
    //this.properties.set(key, value);
    this.properties[key] = value;
  }
}

exports.Edge = function(from, to, undirected) {

  this.from = from;
  this.to = to;
  if (undirected) {
    this.undirected = undirected;
  }
  //this.labels = new Set();
  //this.properties = new Map();
  this.labels = [];
  this.properties = {};

  this.addLabel = function(label) {
    //this.labels.add(label);
    this.labels[this.labels.length] = label;
  }

  this.addProperty = function(key, value) {
    //this.properties.set(key, value);
    this.properties[key] = value;
  }
}

