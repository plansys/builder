this.db = null;

this.contextMenu = [
    {
        label: 'New Page',
        icon: '',
        props: (treeItem, menuItem, hide) => {
            return {
                onClick: (e) => {
                    this.popups.createPage.show(e, {
                        data: '/jos'
                    });
                    hide();
                }
            }
        }
    },
    '---',
    {
        label: 'Rename',
        icon: '',
    },
    {
        label: 'Delete',
        icon: '',
    },
];

this.contextMenuProps = (treeItem, menuItem, hide) => {
    if (typeof menuItem.props === 'function') {
        return menuItem.props(treeItem, menuItem, hide);
    }
    return {
        onClick: (e) => {
            hide();
        }
    };
}

this.query = params => {
    params.active = this.props.tree.active;
    params.info = this.props.tree.info[this.props.tree.active];
    return this.db.query(params);
};

this.initTree = (ref) => {
    this.db = ref;

    this.query({
        action: 'load',
    }).then(res => {
        let result = JSON.parse(res);
        result.active = this.props.tree.active;
        this.props.load(result);
    });
};

this.getArrow = item => {
    return this.url + '/Img/' + (item.expanded ? 'down-arrow.svg' : 'right-arrow.svg');
};

this.update = (item, data) => {
    this.props.updateTree({
        active: this.props.tree.active,
        data: item._set(data)
    });
}

this.toggleExpand = (e, item) => {
    e.stopPropagation();
    e.preventDefault();

    if (!item._set) {
        throw Error(`item._set is not declared`, item);
    }

    if (!item.expanded) {
        if (!item.hasChild) {
            this.open(item);
            return;
        }

        this.query({
            action: 'expand',
            path: item.path.substr(1) + '/' + item.info.relativePathname
        }).then(res => {
            this.update(item, {
                expanded: true,
                childs: JSON.parse(res)
            });
        });
    } else {
        this.update(item, {
            expanded: false
        });
    }
};

this.open = item => {
    this.query({
        action: 'open',
        itemPath: item.path,
        itemLabel: item.label
    }).then(res => {
        try {
            let result = JSON.parse(res);
            this.props.openTab({
                data: result,
                treeItem: item
            });
        } catch (e) {
            console.log('error in json');
        }
    });
};