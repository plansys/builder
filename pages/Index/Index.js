this.changeModule = (value) => {
  this.props.changeModule(value);
  this.tree.initTree(this.tree.db);
};