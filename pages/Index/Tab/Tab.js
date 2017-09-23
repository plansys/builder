
this.openTab = (item) => {
    this.props.openTab(item);
}

this.closeTab = (item, e) => {
    e.stopPropagation();
    e.preventDefault();
    this.props.updateTabs(item._close());
}

this.contextMenu = [{
    label: 'Close',
    icon: '',
    props: (tabItem, menuItem, hide) => {
        return {
            onClick: (e) => {
                this.props.updateTabs(tabItem._close());
                hide();
            }
        }
    }
}];
this.contextMenuProps = (treeItem, menuItem, hide) => {
    if (typeof menuItem.props === 'function') {
        return menuItem.props(treeItem, menuItem, hide);
    }
    return {
        onClick: (e) => {
            hide();
        }
    };
};