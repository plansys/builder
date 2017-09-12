this.api = null;

this.contextMenu = [
    {
        label: 'New Page',
        icon: '',
        props: (treeItem, menuItem, hide) => {
            return {
                onClick: (e) => {
                    this.popups.createNew.show(e, {
                        data: {
                            label: 'Page',
                            path: (treeItem.hasChild ? '/' + treeItem.label : '/' + treeItem.path)
                        }
                    });
                    hide();
                }
            }
        }
    },
    {
        label: 'New Folder',
        icon: '',
        props: (treeItem, menuItem, hide) => {
            return {
                  onClick: (e) => {
                      this.popups.createNew.show(e, {
                          data: {
                            label: 'Folder',
                            path: (treeItem.hasChild ? '/' + treeItem.label : '/' + treeItem.path)
                          }
                      });
                      hide();
                }
            }
        }
    },
    '---',
    {
        label: 'Cut',
        icon: '',
        props: (treeItem, menuItem, hide) => {
            return {
                onClick: (e) => {
                    this.treeCM.clipboard = treeItem;
                    this.update(treeItem, {cut: true});
                    hide();
                }
            }
        }
    },
    {
        label: 'Copy',
        icon: '',
        props: (treeItem, menuItem, hide) => {
            return {
                onClick: (e) => {
                    this.treeCM.clipboard = treeItem;
                    hide();
                }
            }
        }
    },
    {
        label: 'Paste',
        icon: '',
        props: (treeItem, menuItem, hide) => {
            return {
                onClick: (e) => {
                  console.log(e);
                    var parent = treeItem._parent ? treeItem._parent : treeItem;
                    var to = parent.info.pathName + (parent.info.ext == "" ? '/' + data.info.fileName : '');
                    var clip = this.treeCM.clipboard;
                    this.pasteItem(e, treeItem, this.treeCM.clipboard);
                    this.popups.yesNo.show(e, {
                        data: {
                            title: (clip.path.ext == "" ? 'Folder' : 'File') + ' Overwrite',
                            message: (clip.path.ext == "" ? 'Folder' : 'File') + ' in path:<br/>"' + to + '"<br/>is exist.' +
                            '<small>Do you want to overwrite?</small>'
                        }
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
        props: (treeItem, menuItem, hide) => {
            return {
                onClick: (e) => {
                    //rename
                    //save
                    hide();
                }
            }
        }
    },
    {
        label: 'Delete',
        icon: '',
        props: (treeItem, menuItem, hide) => {
            return {
                onClick: (e) => {
                    //delete
                    hide();
                }
            }
        }
    },
];

this.contextMenuVisible = (treeItem, menuItem) => {
    if (!menuItem) return true;
    if (typeof menuItem === 'object') {
        if (typeof menuItem.visible === 'undefined') return true;
        else if (typeof menuItem.visible === 'function') {
            return menuItem.visible(treeItem, menuItem);
        }
        else {
            return menuItem.visible;
        }
    } else {
        return true;
    }
}

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
    return this.api.query(params);
};

this.initTree = (ref) => {
    this.api = ref;
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

this.pasteItem = (e, item, data) => {
    if(data) {
        var action = data.cut ? 'move' : 'copy';
        var parent = item._parent ? item._parent : item;
        var to = parent.info.pathName + (parent.info.ext == "" ? '/' + data.info.fileName : '');
        console.log(e);
        this.query({
            action: action,
            path: parent.path !== '' ? parent.path.substr(1) + '/' + parent.info.relativePathname : '',
            from: data.info.pathName,
            to: to
        }).then(res => {
            console.log(res);
            if (res == 'overwrite') {
                console.log('harusnya');

            }
            // this.update(item._parent(), {
            //     expanded: true,
            //     childs: JSON.parse(res)
            // });
        });
    }
}

this.deleteTreeItem = (item) => {
    this.props.updateTree({
        active: this.props.tree.active,
        data: item._delete()
    })
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