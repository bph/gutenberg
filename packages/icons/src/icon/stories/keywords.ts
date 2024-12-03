const keywords: Partial< Record< keyof typeof import('../../'), string[] > > = {
	cancelCircleFilled: [ 'close' ],
	create: [ 'add' ],
	file: [ 'folder' ],
	seen: [ 'show' ],
	thumbsDown: [ 'dislike' ],
	thumbsUp: [ 'like' ],
	trash: [ 'delete' ],
	unseen: [ 'hide' ],
	warning: [ 'alert', 'caution' ],
};

export default keywords;
