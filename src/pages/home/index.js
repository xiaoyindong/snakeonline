/**
 * 图文咨询主页
 */
import '@global';
import 'lib-flexible';
import './home.less';
// import anmition from '@utils/Timer';
// import Background from './Background';
import Play from './Play';

let id = 1;
class SnakeGame{
    constructor() {
        this.plays = {};
        this.plays[id] = new Play();
        // this.anmition();
    }

    // anmition() {
    //     anmition.add('1', () => {
    //         // console.log(123);
    //         // play1.moveTo(Math.round(Math.random() * 2), Math.round(Math.random() * 2));
    //     });
    // }

}

new SnakeGame();

// const back = new Background();

// const canvas = back.getTarget();

// const ctx = canvas.getContext('2d');
// ctx.fillStyle="#FF0000";
// ctx.fillRect(0,0,150,75);


const play1 = new Play();




// const anmition = new Timer();


