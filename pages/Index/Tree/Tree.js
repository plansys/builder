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
        data: item.$set(data).$getRoot()
    });
}

this.toggleExpand = (e, item) => {
    e.stopPropagation();
    e.preventDefault();

    if (!item.expanded) {
        if (!item.hasChild) {
            this.open(item);
            return;
        }

        this.query({
            action: 'expand',
            path: item.info.relativePathname
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
    console.log(item);
};