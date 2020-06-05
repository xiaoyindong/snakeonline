/**
 * 图文咨询主页
 */
import '@global';
import 'lib-flexible';
import './home.less';
import anmition from '@utils/Timer';
import Background from './Background';
import Play from './Play';

const back = new Background();

// const canvas = back.getTarget();

// const ctx = canvas.getContext('2d');
// ctx.fillStyle="#FF0000";
// ctx.fillRect(0,0,150,75);
anmition.add('1', () => {
    // play1.moveTo(Math.round(Math.random() * 2), Math.round(Math.random() * 2));
})

const play1 = new Play();




// const anmition = new Timer();


