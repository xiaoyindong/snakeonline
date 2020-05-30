
import ossprocess from '@utils/ossprocess';
import route from '@route';
import urlparams from '@utils/urlparams';

export default ({ data = [] }) => {
    const { areaId = 0, hosId = '' } = urlparams;
    return <div className="hot_dept">
        <h2 className="hot_dept_title">热门科室</h2>
        <div className="dept_list">
            {
                data.map(item => <div
                    onClick={() => {
                        if (!item.operaDptId) {
                            route.push(`./doctor_list.html?areaId=${areaId}&hosId=${hosId}&type=department`);
                        } else {
                            route.push(`./doctor_list.html?areaId=${areaId}&hosId=${hosId}&operateId=${item.operaDptId}`);
                            // route.push(`/new/dpr/doctorlist.html?filterParams=areaId0departmentId${item.operaDptId}&sortParams=areaId0&from=3`)
                        }
                    }}
                    className="dept_item">
                    <img src={ossprocess.optimizationImg(
                        item.image,
                        { resize: `w_${30}` }
                    )} />
                    <p>{item.operaDptName}</p>
                </div>)
            }
        </div>
    </div>
}