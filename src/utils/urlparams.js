const getUrlQuery = () => {
    let search = window.location.search.replace(/&amp;/g, '&');
    if (search) {
        search = search.replace(/&amp;/g, '&');
    }
    if (search) {
        const groups = search.substring(1).split('&');
        const ret = {};
        groups.forEach((group) => {
            const idx = group.indexOf('=');
            ret[group.substring(0, idx)] = group.substring(idx + 1);
        });
        return ret;
    }
    return {};
};

export default getUrlQuery();