// 判断浏览器是否支持webp
const checkWebp = (() => {
  try {
    return (
      document
        .createElement('canvas')
        .toDataURL('image/webp')
        .indexOf('data:image/webp') === 0
    );
  } catch (err) {
    return false;
  }
})();

class OssProcess {
  // 图片压缩、webp、size
  static optimizationImg(url, params) {
    if (!url) {
      return;
    }
    if (url.includes('?') || !(url.includes('.qstcdn.com') || url.includes('.myweimai.com'))) {
      return url;
    }

    url = OssProcess.replaceHttp(url);
    url = OssProcess.changeOssCdn(url);

    url = url.split('?')[0];
    const d = url.split('.');
    let imgType = d[d.length - 1];

    // 格式为'jpg', 'png', 'bmp', 'webp', 'gif', 'tiff'
    if (!['jpg', 'png', 'bmp', 'webp', 'gif', 'tiff'].includes(imgType)) {
      return url;
    }

    if (checkWebp) {
      imgType = 'webp';
    }

    const p = { ...params, format: imgType };
    const data = [];

    Object.keys(p).forEach(key => {
      let value = p[key];
      if (key === 'resize') {
        const wh = p[key].split(',');
        value = wh
          .map(v => {
            const x = v.split('_');
            return `${x[0]}_${+x[1] * parseInt((window.devicePixelRatio || 1) + '', 0)}`;
          })
          .join(',');
      }
      data.push(`${key},${value}`);
    });

    return `${url}?x-oss-process=image/${data.join('/')}`;
  }

  // http: -> // h2访问加速
  static replaceHttp(url) {
    return url.replace(/^(http:|https:)/g, '');
  }

  // oss -> cdn 访问
  static changeOssCdn(url) {
    return url.replace(/weimai-yunyin.oss-cn-hangzhou.aliyuncs.com/g, 'article.myweimai.com');
  }
}

export default OssProcess;
