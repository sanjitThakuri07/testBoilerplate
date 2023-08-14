// find a node from object
const findTreeNode = (callback, data) => {
  // If the callback returned true, it means the current node has the desired data, return the node.
  if (callback(data)) return data;

  // If there are children, search through them recursively
  if (data.children && data.children.length) {
    for (let i = 0; i < data.children.length; i++) {
      const child = data.children[i];
      const found = findTreeNode(callback, child);
      if (found) return found;
    }
  }

  // If the id is not found, return null
  return null;
};

// find node from a list of array
export function findNode(callback) {
  let found = null;
  for (let i = 0; i < this.length; i++) {
    const item = this[i];
    found = findTreeNode(callback, item);
    if (found) break;
  }
  return found;
}

export function filterNode(callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    const item = this[i];
    const found = findTreeNode(callback, item);
    if (found) result.push(found);
  }
  return result;
}

// work in progress
// update each node with name='firoj';
const mapTreeNode = (data) => {
  // If the callback returned true, it means the current node has the desired data, return the node.
  // if (callback(data)) return data;
  data.name = "firoj";

  // If there are children, search through them recursively
  if (data.children && data.children.length) {
    for (let i = 0; i < data.children.length; i++) {
      const child = data.children[i];
      mapTreeNode(child);
    }
  }
};

// Array.prototype.mapNode = function (callback) {};
