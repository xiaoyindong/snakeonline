/**
 * 图文咨询主页
 */
import '@global';
import 'lib-flexible';
import './home.less';
// import animation from '@utils/Timer';
// import Background from './Background';
import Play from './Play';
import Handle from './Handle';

class SnakeGame {
    constructor() {
        this.plays = {};
        const handle = new Handle();
        const play1 = new Play('张三');

        handle.dir((x, y, dir) => {
            play1.setDir(x, y);
        })

        handle.fast(() => {
            play1.setSpeed(1);
        });
        handle.slow(() => {
            play1.setSpeed(3);
        });
    }
}

new SnakeGame();

// const back = new Background();

// const canvas = back.getTarget();

// const ctx = canvas.getContext('2d');
// ctx.fillStyle="#FF0000";
// ctx.fillRect(0,0,150,75);





// const anmition = new Timer();


