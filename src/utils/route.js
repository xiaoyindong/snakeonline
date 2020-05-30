class Route {
    format() {

    }
    push(link) {
        if (!link) {
            alert('链接丢失');
            return;
        }
        location.href = link;
    }
    replace(link) {
        if (!link) {
            alert('链接丢失');
            return;
        }
        location.replace(link);
    }
}

export default new Route()