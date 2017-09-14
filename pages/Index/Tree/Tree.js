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
					console.log(this.props);
					this.props.cutItem(treeItem);
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
					this.props.cutItem([]);
					this.props.copyItem(treeItem);
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
					var clip = this.props.tree.copyItems.length > 0 ? this.props.tree.copyItems : this.props.tree.cutItems;
					console.log(clip);
					if(clip && treeItem == []) {
						for(var i = 0; i < clip.length; i++) {
							var action = clip[i].cut ? 'move' : 'copy';
							var parent = treeItem._parent ? treeItem._parent : treeItem;
							var relPath = parent.info.ext !== '' ? '' : parent.info.relativePathname;
							var path = parent.path !== '' ? parent.path.substr(1) + '/' + relPath : '/' + relPath;
							var from = clip[i].info.pathName;
							var to = parent.info.pathName + (parent.info.ext == "" ? '/' + clip[i].info.fileName : '');
							this.pasteItem(action, parent, path, from, to, false, (result) => {
								console.log(from, to);
								console.log(result);
								if (result == 'overwrite') {
									this.popups.yesNo.show(null, {
										data: {
											title: (clip.info.ext == "" ? 'Folder' : 'File') + ' Overwrite',
											message: (clip.info.ext == "" ? 'Folder' : 'File') + ' in path:<br/>"' + to + '"<br/>is exist.' +
											'<small>Do you want to overwrite?</small>'
										}
									});
									if (this.popups.yesNo.value == 'y') {
										this.pasteItem(action, parent, path, from, to, true, (result) => {
											if (result != 'ok') {
												this.popups.ok.show(null, {
													data: {
														title: (clip.info.ext == "" ? 'Folder' : 'File') + ' Error',
														message: result
													}
												});
											}
										});
									}
								} else if (result != 'ok') {
									this.popups.ok.show(null, {
										data: {
											title: (clip.info.ext == "" ? 'Folder' : 'File') + ' Error',
											message: result
										}
									});
								}
							});
						}
					}
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
					var del = treeItem.info.pathName;
					var parent = treeItem._parent ? treeItem._parent : treeItem;
					var relPath = parent.info.ext !== '' ? '' : parent.info.relativePathname;
					var path = parent.path !== '' ? parent.path.substr(1) + '/' + relPath : '/' + relPath;
					this.popups.yesNo.show(null, {
						data: {
							title: 'Delete ' + (treeItem.info.ext == "" ? 'Folder' : 'File'),
							message: (treeItem.info.ext == "" ? 'Folder' : 'File') + ' at path:<br/>"' + del + '"<br/> are about to delete.' +
							'<small>Do you want to delete?</small>'
						}
					});
					this.deleteItem(del, path, parent, (res) => {
						if(res != 'ok') {
							this.popups.ok.show(null, {
								data: {
									title: (clip.info.ext == "" ? 'Folder' : 'File') + ' Error',
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

this.selectItem = (treeItem) => {
	let select = this.props.tree.selectedItems;
	select = [treeItem];
	this.props.selectItem(select);
	this.update(treeItem, {});
};

this.isItemSelected = (treeItem) => {
	let select = this.props.tree.selectedItems;
	for(var i = 0; i < select.length; i++) {
		if(is.shallowEqual(select[i], treeItem)) {
			return true;
		}
	}
	return false;
};

this.isItemCutted = (treeItem) => {
	let cut = this.props.tree.cutItems;
	for(var i = 0; i < cut.length; i++) {
		if(is.shallowEqual(cut[i], treeItem)) {
			return true;
		}
	}
	return false;
};

this.pasteItem = (action, parent, path, from, to, overwrite, cb) => {
	this.query({
		action: action,
		path: path,
		from: from,
		to: to,
		overwrite: overwrite
	}).then(res => {
		var result = res;
		var isJSON = false;
		try {
			result = JSON.parse(res);
			isJSON = true;
		} catch (e) {}

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
		var result = res;
		var isJSON = false;
		try {
			result = JSON.parse(res);
			isJSON = true;
		} catch (e) {}

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
        let result = JSON.parse(res);
        result.treeItem = item;

        this.props.openTab(result);
    });
};