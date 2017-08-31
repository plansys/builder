this.types = [];
this.html = undefined;
this.css = undefined;
this.js = undefined;
this.setting = undefined;
this.redux = undefined;

this.initPage = (ref) => {
    console.log('1234');
    var content = this.props.content;
    for(var i = 0; i < content.length; i++) {
        this.types.push(content[i]);
        switch (content[i].type) {
            case 'html':
                this.html = content[i].value;
                break;
            case 'css':
                this.css = content[i].value;
                break;
            case 'js':
                this.js = content[i].value;
                break;
            case 'setting':
                this.setting = content[i].value;
                break;
            case 'redux':
                this.redux = content[i].value;
                break;
        }
    }
    console.log(this);
};