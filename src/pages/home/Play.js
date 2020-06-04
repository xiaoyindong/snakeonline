class Play {
    constructor(name) {
        this.name = name;
        this.render();
    }

    render() {
        const ele = document.createElement('div');
        ele.id = 'play';
        const html = `<div>123</div>`;
        ele.innerHTML = html;
        document.body.appendChild(ele);
    }
}

export default Play;