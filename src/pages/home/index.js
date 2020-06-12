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
        // document.onkeypress = (e) => {
        //     console.log(e);
        //     if (e.key === 'a') {
        //         play1.setDir(-1, 0);
        //     } else if (e.key === 's') {
        //         play1.setDir(0, 1);
        //     } else if (e.key === 'd') {
        //         play1.setDir(1, 0);
        //     } else if (e.key === 'w') {
        //         play1.setDir(0, -1);
        //     }
        // }

        handle.dir((dir) => {
            if (dir === 'up') {
                play1.setDir(1, 0);
            }
            if (dir === 'right') {
                play1.setDir(0, 1);
            }
            if (dir === 'down') {
                play1.setDir(-1, 0);
            }
            if (dir === 'left') {
                play1.setDir(0, -1);
            }
            console.log(dir);
        })

        handle.fast(() => {
            play1.setSpeed(1);
        });
        handle.slow(() => {
            play1.setSpeed(3);
        });
        // this.plays[play2.getId()] = play2;
        // this.animation();
    }

    // animation() {
    //     Object.keys(this.plays).forEach(id => {
    //         this.plays[id].animation();
    //     })
    //     // console.log(123);
    //     requestAnimationFrame(this.animation.bind(this))
    //     // anmition.add('1', () => {
    //     //     // console.log(123);

    //     //     // play1.moveTo(Math.round(Math.random() * 2), Math.round(Math.random() * 2));
    //     // });
    // }

}

new SnakeGame();

// const back = new Background();

// const canvas = back.getTarget();

// const ctx = canvas.getContext('2d');
// ctx.fillStyle="#FF0000";
// ctx.fillRect(0,0,150,75);





// const anmition = new Timer();


