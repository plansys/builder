this.db = null;

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
    return this.url + '/Img/' + (item.expanded ? 'dropdown.svg' : 'dropright.svg');
};

this.update = (item, data) => {
    this.props.updateTree({
        active: this.props.tree.active,
        data: item.$set(data).$getRawRoot()
    });
}

this.toggleExpand = (e, item) => {
    e.stopPropagation();
    e.preventDefault();

    if (!item.$set) {
        console.log(item);
        return;
    }

    if (!item.expanded) {
        if (!item.hasChild) {
            this.open(item);
            return;
        }

        this.query({
            action: 'expand',
            path: item.path.substr(1) + '/' + item.info.relativePathname
            // path: item.info.relativePathname
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
        let result = JSON.parse(res);
        console.log(result);
        this.props.openTab({
            data: result,
            treeItem: item
        });
    });
};