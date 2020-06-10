class Play {
    constructor(name, x, y, radius, level) {
        this.name = name;
        this.id = Math.round(Math.random() * 100000000);
        this.diff = 2;
        this.speedX = 1;
        this.speedY = 1;
        this.x = x || 60;
        this.y = y || 50;
        
        this.radius = radius || 8;
        this.level = level || 30;
        this.initBody();
        this.render();
        this.drawing();
        this.requestAnimationFrame();
    }
    initBody() {
        const body = []
        for (let i = 0; i < this.level; i++) {
            if (!i) {
                body[i] = {
                    x: this.x,
                    y: this.y,
                    radius: this.radius,
                }
            } else {
                body[i] = {
                    x: body[i - 1].x - this.diff,
                    y: body[i - 1].y - this.diff,
                    radius: body[i - 1].radius - 0.1,
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
            if (i % 4 === 0) {
                this.ctx.arc(data.x, data.y, data.radius, 0, Math.PI * 2, false);
            }
            
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
        // this.body = this.body.reverse();
        // this.updateBody();
        this.body.forEach((item, i) => {
            if (i) {
                this.body[i - 1].radius = item.radius;
            }
        })
        this.body.pop();
        // console.log(this.body);
        this.drawing();
    }

    requestAnimationFrame() {
        this.moveTo(this.x + this.speedX * this.diff, this.y + this.speedY * this.diff);
        requestAnimationFrame(this.requestAnimationFrame.bind(this))
    }
    setDir(speedX = this.speedX, speedY = this.speedY) {
        this.speedX = speedX;
        this.speedY = speedY;
    }
}

export default Play;