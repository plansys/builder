this.changeModule = (value) => {
    this.props.changeModule(value);
    this.tree.initTree(this.tree.db);
};

console.log('index', this.props['[[name]]']);