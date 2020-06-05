class Play {
    constructor(name, x, y) {
        this.name = name;
        this.x = x || 60;
        this.y = y || 50;
        this.render();
        this.drawing();

    }

    render() {
        const canvas = document.createElement('canvas');
        canvas.id = 'play_style';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        document.body.appendChild(canvas);
    }
    drawing() {
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, 10, 0, Math.PI * 2, false);
        this.ctx.fillStyle = "rgba(192,80,77,0.7)";//半透明的红色
        this.ctx.fill();
        this.ctx.strokeStyle = "rgba(192,80,77,1)";//红色
        this.ctx.stroke();
    }
    moveTo(diffX = 0, diffY = 0) {
        this.x = this.x + diffX;
        this.y = this.y + diffY;
        this.drawing();
    }
}

export default Play;