/**
 * 图文咨询主页
 */
import '@global';
import 'lib-flexible';
import './home.less';
// import animation from '@utils/Timer';
// import Background from './Background';
import Play from './Play';

class SnakeGame{
    constructor() {
        this.plays = {};
        const play1 = new Play('张三');
        // const play2 = new Play('李四');
        // this.plays.push();
        // this.plays.push(new Play('张三'));
        this.plays[play1.getId()] = play1;
        document.onkeypress = (e) => {
            console.log(e);
            if (e.key === 'a') {
                play1.setDir(-1, 0);
            } else if (e.key === 's') {
                play1.setDir(0, 1);
            } else if (e.key === 'd') {
                play1.setDir(1, 0);
            } else if (e.key === 'w') {
                play1.setDir(0, -1);
            }
        }
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


