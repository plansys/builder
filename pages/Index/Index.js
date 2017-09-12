this.changeModule = (value) => {
    this.props.changeModule(value);
    this.tree.initTree(this.tree.api);
};

console.log('index', this.props['[[name]]']);