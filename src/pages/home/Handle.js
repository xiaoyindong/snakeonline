class Handle {
    constructor() {
        this.render();
        this.drawingLeft(0, 0);
        this.drawingRight();
        this.setDir = () => { };
        this.getDir((x, y, dir) => {
            this.setDir(x, y, dir);
        });
    }

    render() {
        const leftcanvas = document.createElement('canvas');
        leftcanvas.id = 'hanle_left_style';
        leftcanvas.width = window.innerWidth;
        leftcanvas.height = window.innerHeight / 2;
        this.leftcanvas = leftcanvas;
        this.leftctx = leftcanvas.getContext('2d');
        document.body.appendChild(leftcanvas);

        const rightcanvas = document.createElement('canvas');
        rightcanvas.id = 'hanle_right_style';
        rightcanvas.width = window.innerWidth;
        rightcanvas.height = window.innerHeight / 2;
        this.rightctx = rightcanvas.getContext('2d');
        document.body.appendChild(rightcanvas);
        rightcanvas.ontouchstart = () => {
            this.fastcb();
        }
        rightcanvas.ontouchend = () => {
            this.slowcb();
        }
    }
    drawingLeft(x, y) {
        this.leftctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.leftctx.beginPath();
        this.leftctx.arc(80 + x, 100 + y, 34, 0, Math.PI * 2, false);
        this.leftctx.fillStyle = "rgba(192,80,77,0.7)";//半透明的红色
        this.leftctx.fill();
        this.leftctx.strokeStyle = "rgba(192,80,77,1)";//红色
        this.leftctx.stroke();
    }
    drawingRight() {
        this.rightctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.rightctx.beginPath();
        this.rightctx.arc(80, (window.innerHeight / 2) - 100, 34, 0, Math.PI * 2, false);

        this.rightctx.fillStyle = "rgba(192,80,77,0.7)";//半透明的红色
        this.rightctx.fill();
        this.rightctx.strokeStyle = "rgba(192,80,77,1)";//红色
        this.rightctx.stroke();
    }
    fast(cb) {
        this.fastcb = cb;
    }
    slow(cb) {
        this.slowcb = cb;
    }
    dir(cb) {
        this.setDir = cb;
    }

    getDir(cb) {
        let _startX = 0;
        let _startY = 0;
        this.leftcanvas.addEventListener('touchstart', (e) => {
            _startX = e.touches[0].pageX;
            _startY = e.touches[0].pageY;
            this.leftcanvas.addEventListener('touchmove', move);
        });
        const move = (e) => {
            const endX = e.changedTouches[0].pageX;
            const endY = e.changedTouches[0].pageY;
            
            const diffX = endX - _startX;
            const diffY = endY - _startY;
            if (Math.abs(diffX) < 5 && Math.abs(diffY) < 5) {
                return;
            }
            let dir = 'no';
            let x = 0;
            let y = 0;
            if (diffX < -5) {
                dir = 'down';
                y = -1;
            }
            if (diffX > 5) {
                dir = 'up';
                y = 1;
            }
           
            if (diffY < -5) {
                dir = 'left';
                x = -1;
            }
            if (diffY > 5) {
                dir = 'right';
                x = 1;
            }
            if (Math.abs(diffY) > Math.abs(diffX) * 1.5) {
                y = 0;
            }
            if (Math.abs(diffX) > Math.abs(diffY) * 1.5) {
                x = 0;
            }
            cb(y, x);
            this.drawingLeft(y * 30, x * 30);
        }
        this.leftcanvas.addEventListener('touchend', (e) => {
            this.drawingLeft(0, 0);
            this.leftcanvas.removeEventListener('touchmove', move);
        })
    }
}
export default Handle;