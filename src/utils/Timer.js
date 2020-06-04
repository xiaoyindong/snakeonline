
class Timer {
    constructor() {
        this.list = {};
        this.animation();
    }
    add(id, func) {
        this.list[id] = func;
    }
    remove(id) {
        delete this.list[id];
    }
    animation() {
        Object.keys(this.list).forEach(key => {
            const handle = this.list[key];
            if (handle) {
                handle();
            }
        });
        requestAnimationFrame(this.animation.bind(this));
    }
}

export default new Timer();