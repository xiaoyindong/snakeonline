import ossprocess from '@utils/ossprocess';

export default () => {
    return <div className="top_card">
        <img
            className="card_item"
            src={ossprocess.optimizationImg(
                '//img.qstcdn.com/commodity-center/2020/04/20/75cf9393-a653-451f-b95c-ab46276a7590.png',
                { resize: `w_180` }
            )}
        />
        <img
            className="card_item"
            src={ossprocess.optimizationImg(
                '//img.qstcdn.com/commodity-center/2019/09/02/b4879ff2-754e-4cf9-af99-d7089f7eede8.png',
                { resize: `w_180` }
            )}
        />
    </div>
}