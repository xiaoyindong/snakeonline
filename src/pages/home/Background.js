

class Background {
    constructor() {
        this.canvas = null;
        this.render();
        console.log(this.canvas);
    }

    render() {
        const canvas = document.createElement('canvas');
        canvas.id = 'background_style';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.canvas = canvas;
        document.body.appendChild(canvas);
    }
}
export default Background;