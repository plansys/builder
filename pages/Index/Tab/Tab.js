this.openTab = (item) => {
    this.props.openTab(item);
}

this.closeTab = (item, e) => {
    e.stopPropagation();
    e.preventDefault();
    this.props.updateTabs(item._close());
}