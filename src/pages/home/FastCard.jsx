import ossprocess from '@utils/ossprocess';
import route from '@route';
export default () => {
    return <img
        className="fast_consult_card"
        src={ossprocess.optimizationImg(
            '//img.qstcdn.com/commodity-center/2019/06/24/52af60be-db1c-4d8d-bf45-6a5bdea41ebe.png',
            { resize: `w_${document.body.offsetWidth}` }
        )}
        onClick={() => {
            route.push('/new/fastconsult/index.html');
        }}
    />
}