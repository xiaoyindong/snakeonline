class Play {
    constructor(name, x, y, radius, level) {
        this.name = name;
        this.id = Math.round(Math.random() * 100000000);
        this.speedX = 1;
        this.speedY = 1;
        this.x = x || 60;
        this.y = y || 50;
        this.radius = radius || 10;
        this.level = level || 3;
        this.initBody();
        this.render();
        this.drawing();
        this.requestAnimationFrame();
    }
    initBody() {
        const body = []
        for (let i = 0; i < 3; i++) {
            if (!i) {
                body[i] = {
                    x: this.x,
                    y: this.y,
                    radius: this.radius,
                }
            } else {
                body[i] = {
                    x: body[i - 1].x - body[i - 1].radius,
                    y: body[i - 1].y - body[i - 1].radius,
                    radius: body[i - 1].radius - 1,
                }
            }
        }
        console.log(body);
        this.body = body;
    }
    getId() {
        return this.id;
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
        this.body.forEach((data, i) => {
            this.ctx.beginPath();
            this.ctx.arc(data.x, data.y, data.radius, 0, Math.PI * 2, false);
            this.ctx.fillStyle = "rgba(192,80,77,0.7)";//半透明的红色
            this.ctx.fill();
            this.ctx.strokeStyle = "rgba(192,80,77,1)";//红色
            this.ctx.stroke();
        });
    }
    moveTo(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        this.body.unshift({
            x,
            y,
            radius: this.radius,
        });
        this.body = this.body.reverse();
        // this.updateBody();
        console.log(this.body);
        this.drawing();
    }

    requestAnimationFrame() {
        this.moveTo(this.x + this.speedX, this.y + this.speedY);
        // requestAnimationFrame(this.requestAnimationFrame.bind(this))

    }
}

export default Play;