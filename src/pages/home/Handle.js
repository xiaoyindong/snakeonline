class Handle {
    constructor() {
        this.render();
        this.drawing();
        this.setDir = () => {};
        this.getDir((x, y, dir) => {
           this.setDir(dir);
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
    drawing() {
        this.leftctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.leftctx.beginPath();
        this.leftctx.arc(80, 100, 34, 0, Math.PI * 2, false);

        this.leftctx.fillStyle = "rgba(192,80,77,0.7)";//半透明的红色
        this.leftctx.fill();
        this.leftctx.strokeStyle = "rgba(192,80,77,1)";//红色
        this.leftctx.stroke();


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
        var touch_screen = {
            //方向
            direction: {
                _clientX: 0,
                _clientY: 0,
                _moveX: 0,
                _moveY: 0,
                _startX: 0,
                _startY: 0,
                _object: null,
                _direction: "no",
                _controller: true,
                //开始滑动、拖动
                start: function () {
                    var self = this,
                        obj = self._object;
                    obj.addEventListener('touchstart', function (e) {
                        self._startX = e.touches[0].pageX;
                        self._startY = e.touches[0].pageY;
                        self._clientX = e.touches[0].clientX - parseInt(this.offsetLeft);
                        self._clientY = e.touches[0].clientY - parseInt(this.offsetTop);
                        self.move();
                    }, false);
                    obj.addEventListener('touchend', function (e) {
                        self._controller = true;
                    }, false);
                },
                //拖动滑动时
                move: function () {
                    var self = this;
                    self._object.addEventListener('touchmove', function (e) {
                        if (self._controller) {
                            var endX, endY;
                            endX = e.changedTouches[0].pageX;
                            endY = e.changedTouches[0].pageY;
                            var direction = self.get_slide_direction(self._startX, self._startY, endX, endY);
                            switch (direction) {
                                case 0:
                                    self._direction = "no";
                                    break;
                                case 1:
                                    self._direction = "up";
                                    break;
                                case 2:
                                    self._direction = "down";
                                    break;
                                case 3:
                                    self._direction = "right";
                                    break;
                                case 4:
                                    self._direction = "left";
                                    break;
                                default:
                            }
                            self._controller = false;
                        }
                        e.preventDefault();
                        self._moveX = e.touches[0].clientX - self._clientX;
                        self._moveY = e.touches[0].clientY - self._clientY;

                        let x = 0;
                        let y = 0;
                        if (self._moveX < 0) {
                            // dir = 'down';
                        }
                        if (self._moveX > 0) {
                            // dir = 'up';
                        }
                        if (self._moveY < 0) {
                            // dir = 'left';
                        }
                        if (self._moveY > 0) {
                            // dir = 'right';
                        }
                        // self.premoveX = self._moveX;
                        // console.log(dir);

                        // cb(self._moveX, self._moveY, dir);
                        // this.style.left = self._moveX + 'px';
                        // this.style.top = self._moveY + 'px';
                        // this.innerHTML = self._moveX + "|" + self._moveY + "|" + self._direction
                    }, false);
                },
                //计算滑动角度
                get_slide_angle: function (a, b) {
                    return Math.atan2(a, b) * 180 / Math.PI;
                },
                //根据角度给出方向
                get_slide_direction: function (a, b, c, d) {
                    var dy = b - d;
                    var dx = c - a;
                    var result = 0;
                    if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
                        return result
                    }
                    var angle = this.get_slide_angle(dx, dy);
                    if (angle >= -45 && angle < 45) {
                        result = 4;
                    } else if (angle >= 45 && angle < 135) {
                        result = 1;
                    } else if (angle >= -135 && angle < -45) {
                        result = 2;
                    } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
                        result = 3;
                    }
                    return result;
                },
                //通过一个dom对象进行初始化
                init: function (a) {
                    var class_clone = function (source) {
                        var result = {};
                        for (var key in source) {
                            result[key] = typeof source[key] === "object" ? class_clone(source[key]) : source[key];
                        }
                        return result;
                    }
                    var self = class_clone(touch_screen.direction);
                    self._object = a;
                    self.start();
                }
            }
        }
        touch_screen.direction.init(this.leftcanvas);
    }
}
export default Handle;