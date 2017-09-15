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
					this.cutCommand(treeItem);
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
					this.copyCommand(treeItem);
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
					this.pasteCommand(treeItem);
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
					let del = treeItem.info.pathName;
					let parent = treeItem._parent ? treeItem._parent : treeItem;
					let relPath = parent.info.ext !== '' ? '' : parent.info.relativePathname;
					let path = parent.path !== '' ? parent.path.substr(1) + '/' + relPath : '/' + relPath;
					this.popups.confirm.show(null, {
						data: {
							title: 'Delete ' + (treeItem.info.ext === "" ? 'Folder' : 'File'),
							message: (treeItem.info.ext === "" ? 'Folder' : 'File') + ' at path:<br/>"' + del + '"<br/> are about to delete.' +
							'<small>Do you want to delete?</small>'
						}
					});
					this.deleteItem(del, path, parent, (res) => {
						if (res !== 'ok') {
							this.popups.info.show(null, {
								data: {
									title: (clip.info.ext === "" ? 'Folder' : 'File') + ' Error',
									message: res
								}
							});
						}
					});
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
};

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
};

// this.eventListener = (e, treeItem) => {
// 	console.log(e.target);
// 	e.target.addEventListener('keydown', (e) => { this.controlCommand(e, treeItem); });
// };

window.addEventListener('keydown', (e) => {
	var select = this.props.tree.selectedItems;
	console.log(this.props);
	this.controlCommand(e, select[select.length - 1]);
});

this.controlCommand = (e, treeItem) => {
	console.log('control');
	var key = e.which || e.keyCode; // keyCode detection
	var ctrl = e.ctrlKey ? e.ctrlKey : ((key === 17) ? true : false);

	//ctrl + x
	if(key == 88 && ctrl) {
		console.log('ctrl + x');
		this.cutCommand(treeItem);
	}
	//ctrl + c
	if(key == 67 && ctrl) {
		console.log('ctrl + c');
		this.copyCommand(treeItem);
	}
	//ctrl + v
	if(key == 86 && ctrl) {
		console.log('ctrl + v');
		this.pasteCommand(treeItem);
	}
};

this.cutCommand = (treeItem) => {
	this.props.copyItem([]);
	this.props.cutItem(treeItem);
};

this.copyCommand = (treeItem) => {
	this.props.cutItem([]);
	this.props.copyItem(treeItem);
};

this.pasteCommand = (treeItem) => {
	let clip = this.props.tree.copyItems.length > 0 ? this.props.tree.copyItems : this.props.tree.cutItems;
	let action = this.props.tree.copyItems.length > 0 ? 'copy' : 'move';
	console.log(clip);
	if (clip && treeItem != 'root') {
		this.doPasteItem(treeItem, clip, action);
	}
}

this.selectItem = (e, treeItem) => {
	let select = this.props.tree.selectedItems;
	let last_select = select[select.length - 1];
	if(e.ctrlKey) {
		if(!this.isItemSelected(treeItem)) {
			select.push(treeItem);
		} else {
			this.deselectItem(select, treeItem);
		}
	} else if(e.shiftKey) {
		select = this.selectShift(last_select, treeItem);
	} else {
		select = [treeItem];
	}
	this.props.selectItem(select);
};

this.selectShift = (lastSelect, select) => {
	var tree = this.props.tree.data[this.props.tree.active];
	var ls_id = this.getTreeIndex(lastSelect);
	var s_id = this.getTreeIndex(select);
	var i = ls_id;
	var res = [];

	while(i != s_id) {
		res.push(tree[i]);
		if(ls_id > s_id) {
			i--;
		} else {
			i++;
		}
	}
	res.push(select);

	return res;
};

this.deselectItem = (select, treeItem) => {
	for(var i = 0; i < select.length; i++) {
		if(this.isTreeEqual(select[i], treeItem)) {
			select.splice(i, 1);
			return true;
		}
	}
	return false;
};

this.getTreeIndex = (treeItem) => {
	var tree = this.props.tree.data[this.props.tree.active];
	for(var i = 0; i < tree.length; i++) {
		if(this.isTreeEqual(tree[i], treeItem)) return i;
	}
	return false;
};

this.isItemSelected = (treeItem) => {
	let select = this.props.tree.selectedItems;
	for (let i = 0; i < select.length; i++) {
		if (this.isTreeEqual(select[i], treeItem)) {
			return true;
		}
	}
	return false;
};

this.isItemCutted = (treeItem) => {
	let cut = this.props.tree.cutItems;
	for (let i = 0; i < cut.length; i++) {
		if (this.isTreeEqual(cut[i], treeItem)) {
			return true;
		}
	}
	return false;
};

this.isTreeEqual = (a, b) => {
	if (a.info && b.info) {
		if (a.info.pathName && b.info.pathName) {
			if (a.info.pathName != b.info.pathName) {
				return false;
			}
		} else {
			return false;
		}
	} else {
		return false;
	}
	return true;
};

this.getTreePaths = (treeItems) => {
	var paths = [];
	for(var i = 0; i < treeItems.length; i++) {
		if(treeItems[i].info) {
			if(treeItems[i].info.pathName) {
				paths.push(treeItems[i].info.pathName);
			}
		}
	}
	return paths;
}

this.doPasteItem = (treeItem, item, action, overwrite) => {
	let parent = treeItem._parent ? treeItem._parent : treeItem;
	let relPath = parent.info.ext !== '' ? '' : parent.info.relativePathname;
	let path = parent.path !== '' ? parent.path.substr(1) + '/' + relPath : '/' + relPath;
	let from = this.getTreePaths(item);
	let to = parent.info.pathName + (parent.info.ext === "" ? '/' + clip[i].info.fileName : '');
	this.pasteItem(action, parent, path, to, overwrite, (result) => {
		console.log(from, to);
		console.log(result);
		if (result === 'overwrite') {
			this.popups.confirm.show(null, {
				data: {
					title: (clip.info.ext === "" ? 'Folder' : 'File') + ' Overwrite',
					message: (clip.info.ext === "" ? 'Folder' : 'File') + ' in path:<br/>"' + to + '"<br/>is exist.' +
					'<small>Do you want to overwrite?</small>'
				}
			});
			if (this.popups.confirm.value === 'y') {
				this.doPasteItem(treeItem, item, action, 'y');
			}
		} else if (result === 'overwrite-all') {
			this.popups.confirmAll.show(null, {
				data: {
					title: (clip.info.ext === "" ? 'Folder' : 'File') + ' Overwrite All',
					message: (clip.info.ext === "" ? 'Folder' : 'File') + ' in path:<br/>"' + to + '"<br/>is exist.' +
					'<small>Do you want to overwrite?</small>'
				}
			});
			if (this.popups.confirm.value === 'y') {
				this.doPasteItem(treeItem, item, action, 'y');
			}
		} else if (result !== 'ok') {
			this.popups.info.show(null, {
				data: {
					title: (clip.info.ext === "" ? 'Folder' : 'File') + ' Operation Error',
					message: result
				}
			});
		}
	});
};

this.pasteItem = (action, parent, path, from, to, overwrite, cb) => {
	this.query({
		action: action,
		path: path,
		from: from,
		to: to,
		overwrite: overwrite
	}).then(res => {
		let result = res;
		let isJSON = false;
		try {
			result = JSON.parse(res);
			isJSON = true;
		} catch (e) {
		}

        if (!isJSON) {
            cb(result);
        } else {
            this.update(parent, {
                expanded: true,
                childs: result
            });
            cb('ok');
        }
    });
};

this.deleteItem = (del, path, parent, cb) => {
	this.query({
		action: 'delete',
		del: del,
		path: path
	}).then(res => {
		let result = res;
		let isJSON = false;
		try {
			result = JSON.parse(res);
			isJSON = true;
		} catch (e) {
		}

        if (!isJSON) {
            cb(result);
        } else {
            this.update(parent, {
                expanded: true,
                childs: result
            });
            cb('ok');
        }
    });
};

this.toggleExpand = (e, item) => {
    e.stopPropagation();
    e.preventDefault();

    if (!item._set) {
        throw Error(`item._set is not declared`, item);
    }

	if (!item.expanded && !e.shiftKey && !e.ctrlKey) {
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
			result.treeItem = item;
			this.props.openTab(result);
		} catch (ex) {}
	});
};