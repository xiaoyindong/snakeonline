

class Background {
    constructor() {
        this.canvas = null;
        this.render();
    }

    render() {
        const canvas = document.createElement('canvas');
        canvas.id = 'background_style';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.canvas = canvas;
        document.body.appendChild(canvas);
    }

    getTarget() {
        return this.canvas;
    }
    
}
export default Background;