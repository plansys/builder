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
							label: 'Create New Page',
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
							label: 'Create New Folder',
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
					this.renameCommand(treeItem);
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
					this.deleteCommand(treeItem);
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
		result.rootPath = this.getRootPath(result);
		this.props.load(result);
	});
};

this.getRootPath = (result) => {
	let root = '';
	if (result.data.length > 0) {
		let info = result.data[0].info;
		root = info.pathName.replace(info.relativePath + info.relativePathname, '');
	}

	return root;
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

window.addEventListener('keydown', (e) => {
	let select = this.props.tree.selectedItems;
	if (this.activeSection === 'tree') {
		this.treeControlCommand(e, select);
	}
});

this.setTreeAsActiveSection = () => {
	this.activeSection = 'tree';
};

this.treeControlCommand = (e, treeItem) => {
	e.preventDefault();
	e.stopPropagation();

	let key = e.which || e.keyCode; // keyCode detection
	let ctrl = e.ctrlKey ? e.ctrlKey : ((key === 17) ? true : false);

	//ctrl + x
	if (key === 88 && ctrl) {
		console.log('ctrl + x');
		this.cutCommand(treeItem);
	}
	//ctrl + c
	if (key === 67 && ctrl) {
		console.log('ctrl + c');
		this.copyCommand(treeItem);
	}
	//ctrl + v
	if (key === 86 && ctrl) {
		console.log('ctrl + v');
		this.pasteCommand(treeItem);
	}
	//ctrl + r
	if (key === 82 && ctrl) {
		console.log('ctrl + r');
		this.renameCommand(treeItem);
	}

	//delete
	if (key === 46) {
		console.log('delete');
		this.deleteCommand(treeItem);
	}
};

this.cutCommand = (treeItem) => {
	this.props.copyItem([]);
	treeItem = treeItem === 'root' ? this.props.tree.selectedItems : treeItem;
	this.props.cutItem(treeItem);
	this.setTreeAsActiveSection();
};

this.copyCommand = (treeItem) => {
	this.props.cutItem([]);
	treeItem = treeItem === 'root' ? this.props.tree.selectedItems : treeItem;
	this.props.copyItem(treeItem);
	this.setTreeAsActiveSection();
};

this.pasteCommand = (treeItem) => {
	let clip = this.props.tree.copyItems.length > 0 ? this.props.tree.copyItems : this.props.tree.cutItems;
	let action = this.props.tree.copyItems.length > 0 ? 'copy' : 'move';
	if (clip) {
		this.doPasteItem(treeItem, clip, action);
	}
	this.setTreeAsActiveSection();
};

this.renameCommand = (treeItem) => {
	this.doRenameItem(treeItem, false);
};

this.deleteCommand = (treeItem) => {
	let del = this.getTreePaths(treeItem);
	console.log(del.join("'<br/>'"));
	this.popups.confirm.show(null, {
		data: {
			title: 'Delete File or Folder',
			message: 'File or Folder at path:<br/>"' + del.join('"<br/>"') + '"<br/> are about to delete.' +
			'<small>Do you want to delete?</small>'
		}
	}).then((res) => {
		console.log(res);
		if(res == 'y') {
			this.doDeleteItem(treeItem, this.props.tree.selectedItems);
		}
	});
};

this.selectItem = (e, treeItem, rightClick) => {
	let select = this.props.tree.selectedItems;
	let last_select = select[select.length - 1];
	if (e.ctrlKey || rightClick) {
		if (!this.isItemSelected(treeItem)) {
			if(!rightClick) {
				select.push(treeItem);
			} else {
				select = [treeItem];
			}
		} else {
			if(!rightClick) {
				this.deselectItem(select, treeItem);
			}
		}
	} else if (e.shiftKey) {
		select = this.selectShift(last_select, treeItem);
	} else {
		select = [treeItem];
	}
	this.props.selectItem(select);
	this.setTreeAsActiveSection();
};

this.selectShift = (lastSelect, select) => {
	let tree = this.props.tree.data[this.props.tree.active];
	let ls_id = this.getTreeIndex(lastSelect);
	let s_id = this.getTreeIndex(select);
	let i = ls_id;
	let res = [];

	while (i !== s_id) {
		res.push(tree[i]);
		if (ls_id > s_id) {
			i--;
		} else {
			i++;
		}
	}
	res.push(select);

	return res;
};

this.deselectItem = (select, treeItem) => {
	for (let i = 0; i < select.length; i++) {
		if (this.isTreeEqual(select[i], treeItem)) {
			select.splice(i, 1);
			return true;
		}
	}
	return false;
};

this.getTreeIndex = (treeItem) => {
	let tree = this.props.tree.data[this.props.tree.active];
	for (let i = 0; i < tree.length; i++) {
		if (this.isTreeEqual(tree[i], treeItem)) return i;
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
	if (!a || !b) return false;

	if (a.info && b.info) {
		if (a.info.pathName && b.info.pathName) {
			if (a.info.pathName !== b.info.pathName) {
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
	let paths = [];
	for (let i = 0; i < treeItems.length; i++) {
		if (treeItems[i].info) {
			if (treeItems[i].info.pathName) {
				if (treeItems[i].info.ext === '') {
					paths.push(treeItems[i].info.pathName + '/');
				} else {
					paths.push(treeItems[i].info.pathName);
				}
			}
		}
	}
	return paths;
};

this.doPasteItem = (treeItem, item, action, overwrite) => {
	let select = this.props.tree.selectedItems;
	let last_select = select[select.length - 1];
	let tree = null;
	if (treeItem == 'root') {
		tree = this.props.tree.data[this.props.tree.active][0];
	} else if (treeItem == 'last') {
		tree = last_select;
	} else {
		tree = last_select;
	}
	let parent = tree.info.ext == '' ? tree : tree._parent ? tree._parent : tree;
	let relPath = parent.info.ext !== '' ? '' : parent.info.relativePathname;
	let path = parent.path !== '' ? parent.path.substr(1) + '/' + relPath : '/' + relPath;
	let toPath = parent.info.pathName;// + (parent.info.ext !== 'php' ? '/' + parent.info.fileName : '');
	let from = this.getTreePaths(item);
	if (parent.info.ext === 'php') {
		toPath = toPath.replace(parent.info.fileName, '');
	}
	let to = [];
	if(['/', '\\'].indexOf(toPath.substr(toPath.length - 1)) < 0) {
		toPath = toPath + '/';
	}
	for (var i = 0; i < item.length; i++) {
		to.push(toPath + item[i].info.fileName);
	}

	this.copyMoveItem(action, parent, path, from, to, overwrite);
};

this.doRenameItem = (treeItem, overwrite) => {
	let select = this.props.tree.selectedItems;
	let tree = select[select.length - 1];
	let parent = tree.info.ext == '' ? tree : tree._parent ? tree._parent : tree;
	let relPath = parent.info.ext !== '' ? '' : parent.info.relativePathname;
	let path = parent.path !== '' ? parent.path.substr(1) + '/' + relPath : '/' + relPath;
	let toPath = parent.info.pathName;// + (parent.info.ext !== 'php' ? '/' + parent.info.fileName : '');
	let from = this.getTreePaths([tree]);
	if (parent.info.ext === 'php') {
		toPath = toPath.replace(parent.info.fileName, '');
	}
	let to = [];
	if(['/', '\\'].indexOf(toPath.substr(toPath.length - 1)) < 0) {
		toPath = toPath + '/';
	}

	this.popups.createNew.show(null, {
		data: {
			label: 'Rename Item',
			path: path
		}
	}).then((res) => {
		if (res) {
			to.push(toPath + item[i].info.fileName);
			this.copyMoveItem('move', parent, path, from, to, overwrite);
		} else {
			this.doRenameItem(treeItem, overwrite);
		}
	});
};

this.copyMoveItem = (action, parent, path, from, to, overwrite) => {
	this.pasteItem(action, parent, path, from, to, overwrite, (result) => {
		if (result === 'overwrite') {
			var clip = item[0];
			this.popups.confirm.show(null, {
				data: {
					title: (clip.info.ext === "" ? 'Folder' : 'File') + ' Overwrite',
					message: (clip.info.ext === "" ? 'Folder' : 'File') + ' in path:<br/>"' + to + '"<br/>is exist.' +
					'<small>Do you want to overwrite?</small>'
				}
			}).then((res) => {
				if (res == 'y') {
					this.doPasteItem(treeItem, item, action, 'y');
				}
			});
		} else if (result === 'overwrite-all') {
			this.popups.confirmAll.show(null, {
				data: {
					title: (clip.info.ext === "" ? 'Folder' : 'File') + ' Overwrite All',
					message: (clip.info.ext === "" ? 'Folder' : 'File') + ' in path:<br/>"' + to + '"<br/>is exist.' +
					'<small>Do you want to overwrite?</small>'
				}
			});
			if (res == 'y') {
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
	overwrite = overwrite ? overwrite : false;
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
			this.refreshTree(parent, path, result);
			cb('ok');
		}
	});
};

this.doDeleteItem = (treeItem, item) => {
	let del = this.getTreePaths(item);
	let select = this.props.tree.selectedItems;
	let last_select = select[select.length - 1];
	let tree = null;
	if (treeItem == 'root') {
		tree = this.props.tree.data[this.props.tree.active][0];
	} else if (treeItem == 'last') {
		tree = last_select;
	} else {
		tree = last_select;
	}
	let parent = tree.info.ext == '' ? tree : tree._parent ? tree._parent : tree;
	let relPath = parent.info.ext !== '' ? '' : parent.info.relativePathname;
	let path = parent.path !== '' ? parent.path.substr(1) + '/' + relPath : '/' + relPath;

	this.deleteItem(del, path, parent, (res) => {
		if (res !== 'ok') {
			this.popups.info.show(null, {
				data: {
					title: 'Delete File or Folder Operation Error',
					message: res
				}
			});
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
			this.refreshTree(parent, path, result);
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

this.refreshTree = (tree, path, data) => {
	if(path != '/') {
		this.update(parent, {
			expanded: true,
			childs: data
		});
	} else {
		this.initTree(this.api);
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
		} catch (ex) {
		}
	});
};