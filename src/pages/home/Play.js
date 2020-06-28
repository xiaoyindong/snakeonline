class Play {
    constructor(name, x, y, level) {
        this.name = name;
        // this.id = Math.round(Math.random() * 100000000);
        this.dirX = 1;
        this.dirY = 1;
        this.x = x || 200;
        this.y = y || 300;
        this.order = 0;
        this.limit = 10;
        
        this.level = level || 8;
        this.radius = Math.floor(this.level / 8) + 5;
        if (this.radius > 14) {
            this.radius = 10;
        }
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
                let x = body[i - 1].x - this.radius;
                let y = body[i - 1].y - this.radius;
                let radius = body[i - 1].radius - 0.05;
                if (x < 0) {
                    x = 0;
                }
                if (y < 0) {
                    y = 0;
                }
                radius = radius.toFixed(2);
                if (radius < 5) {
                    radius = 5;
                }
                body[i] = {
                    x,
                    y,
                    radius,
                }
            }
        }
        
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
    moving() {
        this.x += (this.radius * this.dirX);
        this.y += (this.radius * this.dirY);
        this.body.unshift({
            x: this.x,
            y: this.y,
            radius: this.radius,
        });
        this.body.forEach((item, i) => {
            if (i) {
                this.body[i - 1].radius = item.radius;
            }
        })
        this.body.length = this.level;
        this.drawing();
    }

    requestAnimationFrame() {
        if (this.order === this.limit) {
            this.moving();
            this.order = 0;
        }
        this.order++;
        requestAnimationFrame(this.requestAnimationFrame.bind(this))
    }
    setDir(dirX = this.dirX, dirY = this.dirY) {
        this.dirX = dirX;
        this.dirY = dirY;
    }
    setSpeed(limit) {
        this.limit = limit;
        this.order = 0;
    }
}

export default Play;


