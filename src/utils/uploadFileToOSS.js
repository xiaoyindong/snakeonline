import EXIF from 'exif-js';
import axios from 'axios';

class Upload {
  constructor(options, onResponse) {
    this.imgFile = {};
    this.defaultConfig = {
      imgCompassMaxSize: 200 * 1024,
      ratio: 0.95, //压缩质量
      maxSize: 20, //
      maxLength: 20, //一次最多上传图片数量
      type: 'image', //文件类型
      businessType: '00401', //业务使用场景类型
      uploadTerminal: '1', //1：APP端  2：PC 端,
      multiple: true,
      beforeUpload: () => {},
    };

    this.typelist = ['image', 'video', 'audio', 'application'];
    this.fileList = [];
    // this.signData = null
    this.needIndex = 0; //一共需要上传的数量
    this.currentIndex = 0; //当前上传index
    this.successCount = 0; //成功上传的数量
    this.onResponse = onResponse;
    // 合并参数
    this.config = Object.assign({}, this.defaultConfig, options);

    const { beforeUpload, base64File, files, type } = this.config;
    if (this.typelist.indexOf(type) == -1) {
      // type参数错误
      throw new TypeError('type参数错误');
    }
    // 直接传files
    if (files) {
      if (Object.prototype.toString.call(files) !== '[object Array]') {
        throw new Error('files 必须是文件数组');
      }
      // 上传前需要执行的方法
      const isContinue = beforeUpload(files) === false;
      if (isContinue) {
        return;
      }
      this.needIndex = files.length;
      // 请求数据单独处理
      this.directFiles(files, signData => {
        for (let i = 0; i < files.length; i++) {
          this.init(files[i], signData, i);
        }
      });
      return;
    }
    // 创建file input 初始化
    if (base64File) {
      // 如果是base64 直接上传不需要创建input file
      let dataUrl = base64File;
      this.needIndex = 1;
      const isContinue = beforeUpload(base64File) === false;
      if (isContinue) {
        return;
      }
      this.base64Files(dataUrl, signData => {
        this.init(dataUrl, signData);
      });
      return;
    }
    this.createInputFile((...arg) => {
      this.init(...arg);
    });
  }
  // 获取base64类型
  base64Type(dataUrl) {
    //data:image/png
    let type = dataUrl.split(';base64')[0];
    return type.split(':')[1];
  }
  async directFiles(files, callback) {
    const signData = await this.fetchSignData(files);
    callback && callback(signData);
  }
  async base64Files(dataUrl, callback) {
    const signData = await this.fetchSignData(dataUrl);
    callback && callback(signData);
  }

  response(code = 0, message = '', fileList = []) {
    this.onResponse({
      code,
      message,
      fileList,
    });
  }

  async fetchSignData(obj) {
    let signData = {};
    if (!obj) {
      this.response(-1, '读取文件失败');
    }
    let res = await this.getSignData(obj);
    if (res && res.code === 0) {
      let data = res.data || {};
      signData = data && data.signData ? data.signData : null;
    } else {
      // 获取签名失败
      this.response(-2, '获取签名失败');
      return;
    }
    return signData;
  }
  async init(file, signData, i = 0) {
    // 暂存file信息
    let isBase64 = false;
    if (typeof file === 'string') {
      isBase64 = true;
      // file 是 base64 url
    } else {
      this.storeFile(file);
    }

    if (isBase64) {
      return this.processData(file, signData);
    }
    // 不是图片了类型 直接压缩
    if (this.imgFile.type.indexOf('image') === -1) {
      // 直接上传
      return this.transformFileToFormData(file, signData, i);
    }
    // canvas 压缩处理
    this.transformFileToDataUrl(file, signData, i);
  }
  createInputFile(fn) {
    const { maxLength, beforeUpload, multiple, type, accept } = this.config;
    // 创建一个input file
    let $input = document.getElementById('create_upload_file');

    if (!$input) {
      // 判断是 文件格式 默认图片上传
      let inputAttr = {
        type: 'file',
        accept: accept || `${type || 'image'}/*`,
      };
      if (type === 'image' && multiple && maxLength > 1) {
        inputAttr['multiple'] = true;
      }
      $input = document.createElement('input');
      $input.id = 'create_upload_file';
      for (let key in inputAttr) {
        $input.setAttribute(key, inputAttr[key]);
      }
      $input.style.display = 'none';
      document.body.appendChild($input);
    } else {
      $input.setAttribute('accept', accept || `${this.config.type || 'image'}/*`);
    }
    // 清空之前的选择的文件
    $input.value = '';
    $input.click();
    $input.onchange = async e => {
      // 执行回调初始化fn
      const f = [...e.target.files];
      if (f.length > maxLength) {
        this.response(-7, `图片最多只能再传${maxLength}张`);
        f.splice(maxLength, f.length);
      }
      this.needIndex = f.length;
      const isContinue = beforeUpload(f) === false;
      if (isContinue) {
        return;
      }
      // 多文件上传时 先获取signData数据数组
      const signData = await this.fetchSignData(f);
      for (let i = 0; i < f.length; i++) {
        // 调用init方法
        fn && fn(f[i], signData, i);
      }
    };
  }
  storeFile(file) {
    this.imgFile.type = file.type || 'image/jpeg'; // 部分安卓出现获取不到type的情况
    this.imgFile.size = file.size || 0;
    this.imgFile.name = file.name || 'defaultPng';
    this.imgFile.file = file;
    this.imgFile.lastModifiedDate = file.lastModifiedDate;
  }
  getFilesType(files) {
    let types = [];
    for (let i = 0; i < files.length; i++) {
      types.push(files[i].type);
    }
    return types.join(',');
  }
  async getSignData(file) {
    // 获取服务的配置信息

    const { businessType, uploadTerminal, getConfigUrl, isOpen } = this.config;
    const fileAmount = typeof file === 'string' ? 1 : file.length;
    const fileType = typeof file === 'string' ? this.base64Type(file) : this.getFilesType(file);
    const data = {
      fileType: fileType,
      fileAmount: fileAmount,
      businessType: businessType,
      uploadTerminal: uploadTerminal, //1：APP端  2：PC 端
      ...(isOpen ? { _noFilter_: true } : null), // 如果是渠道对接情况下，则传入此参数告诉 choice-open 不拦截些接口
    };
    return axios({
      method: 'get',
      url: getConfigUrl,

      headers: {
        Accept: '*',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        AccessToken: '',
        'x-weimai-token': this.config.token || '',
      },
      params: data,
    });
  }
  jsonToFormdata(obj) {
    // 转成formdata格式
    let formdata = new FormData();
    for (let key in obj) {
      formdata.append(key, obj[key]);
    }
    return formdata;
  }
  transformFileToDataUrl(file, signData, index) {
    const { imgCompassMaxSize, ratio } = this.config;
    // 存储文件相关信息
    var reader = new FileReader();
    reader.onload = e => {
      const result = e.target.result;
      if (result.length < imgCompassMaxSize) {
        // compress(result, processData, false) // 图片不压缩
        this.compress(result, this.processData, signData, index);
      } else {
        // 图片压缩 后期需要把ratio暴露出去
        this.compress(result, this.processData, signData, index, ratio);
      }
    };
    reader.readAsDataURL(file);
  }
  // 获取图片的拍照角度
  getOrientation(img) {
    let orientation = '';
    EXIF.getData(img, function() {
      orientation = EXIF.getTag(this, 'Orientation');
    });
    return orientation;
  }
  imgRotation(orientation) {
    /**
     * 图片转换为canvas
     * @param  旋转角度 1:0,3:180,6:90,8:270
     */
    let imgRotation =
      {
        '1': 0,
        '3': Math.PI,
        '6': Math.PI * 0.5,
        '8': Math.PI * 1.5,
      }[orientation] || 0;
    return imgRotation;
  }
  async compress(dataUrl, callback, signData, index, ratio = 1) {
    //图片压缩处理
    let img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      // 获取源图中拍照方向信息
      let orientation = this.getOrientation(img);
      // 计算出需要旋转的角度
      const imgRotation = this.imgRotation(orientation);
      // 绘制canvas
      // const canvas = document.getElementById('canvas')
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      // 获取图片原来大小
      const originWidth = img.width;
      const originHeight = img.height;
      // 最大尺寸限制，可通过国设置宽高来实现图片压缩程度
      let maxWidth = 750;
      // 目标尺寸
      // 需要根据旋转角度 更换宽高
      let cw = originWidth;
      let ch = originHeight;

      if (orientation === 6 || orientation === 8) {
        // 需要垂直旋转
        canvas.width = Math.min(maxWidth, originHeight);
        let scale = canvas.width / originHeight;
        canvas.height = originWidth * scale;
        cw = canvas.height;
        ch = canvas.width;
      } else {
        // 水平旋转 不替换宽高
        canvas.width = Math.min(maxWidth, originWidth);
        let scale = canvas.width / originWidth;
        canvas.height = originHeight * scale;
        cw = canvas.width;
        ch = canvas.height;
      }
      // 设置中心点旋转
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(imgRotation);
      ctx.drawImage(img, 0, 0, originWidth, originHeight, -cw / 2, -ch / 2, cw, ch);
      // 压缩后的base64url
      const newDataUrl = canvas.toDataURL(this.imgFile.type, ratio);
      callback.call(this, newDataUrl, signData, index);
    };
  }
  processData(dataUrl, signData, index) {
    // 这里使用二进制方式处理dataUrl
    try {
      const binaryString = window.atob(dataUrl.split(',')[1]);
      const arrayBuffer = new ArrayBuffer(binaryString.length);
      const intArray = new Uint8Array(arrayBuffer);
      const imgFile = this.imgFile;
      for (let i = 0, j = binaryString.length; i < j; i++) {
        intArray[i] = binaryString.charCodeAt(i);
      }
      const data = [intArray];
      let blob;
      try {
        blob = new Blob(data, { type: imgFile.type });
      } catch (error) {
        window.BlobBuilder =
          window.BlobBuilder ||
          window.WebKitBlobBuilder ||
          window.MozBlobBuilder ||
          window.MSBlobBuilder;
        if (error.name === 'TypeError' && window.BlobBuilder) {
          const builder = new BlobBuilder();
          builder.append(arrayBuffer);
          blob = builder.getBlob(imgFile.type);
        } else {
          // Toast.error("版本过低，不支持上传图片", 2000, undefined, false);
          throw new Error('版本过低，不支持上传图片');
        }
      }
      // blob
      this.transformFileToFormData(blob, signData, index);
    } catch (error) {
      this.response(-3, '图片名称或格式有误');
    }

    // try {
    // 	// 例如：ios 8不支持new File
    // 	fileOfBlob = new File([blob], imgFile.name);
    // 	this.transformFileToFormData(fileOfBlob, this.signData)
    // } catch (error) {
    // 	this.transformFileToFormData(blob, this.signData)
    // }
  }

  transformFileToFormData(file, signData, i = 0) {
    if (signData === null || typeof signData !== 'object') {
      // 缺少参数
      this.response(-3, '获取签名失败');
      return;
    }
    // ！！！注意了 前方高能了 oss 对象顺序千万不要随意变更 极有可能res.data为空 欲哭无泪的bug
    const oss = {};
    // oss['x:obj_id'] = objId || ''
    // oss['x:obj_type'] = objType
    oss['x:file_old_name'] = this.imgFile.name;
    oss['x:file_name'] = signData.fileName[i];
    oss['x:user_id'] = signData.userId;
    oss['x:business_type'] = signData.businessType;
    oss['key'] = signData.fileName[i];
    oss['policy'] = signData.policy;
    oss['OSSAccessKeyId'] = signData.accessKeyId;
    if (signData.callback) {
      oss['callback'] = signData.callback;
    }
    oss['signature'] = signData.signature;
    oss['file'] = file;
    oss['success_action_status'] = '200';

    // 返回装载好的formData 发起上传
    let callbackUrl = signData.url[i];
    signData.host = /^http(s)?:/.test(signData.host)
      ? signData.host.replace(/^http(s)?:/, 'https:')
      : `${location.protocal}${signData.host}`;
    this.uploadImg({
      url: signData.host,
      data: this.jsonToFormdata(oss),
      type: file.type,
      callbackUrl: callbackUrl,
    });
  }
  uploadImg(option) {
    // 上传到oss
    const { url, data, callbackUrl } = option;
    const { onProgress } = this.config;
    // 发送请求
    axios({
      method: 'post',
      timeout: 30000,
      url: url,
      headers: {
        'Content-type': 'multipart/form-data',
        Accept: '*',
        'Access-Control-Allow-Origin': '*',
        AccessToken: '',
      },
      onUploadProgress: progressEvent => {
        //原生获取上传进度的事件
        if (progressEvent.lengthComputable) {
          //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
          //如果lengthComputable为false，就获取不到progressEvent.total和progressEvent.loaded
          let precent = (progressEvent.loaded / progressEvent.total) * 100;
          onProgress && onProgress(precent);
        }
      },
      data: data,
    }).then(
      res => {
        let url = res && res.code === 0 ? res.data.url : callbackUrl;
        url = /http(s)?:\/\//.test(url) ? url : `https:${url}`;
        let index = res && res.code === 0 ? res.data.index : null;
        // result 成功后的回调
        this.fileList.push({
          url: url,
          index: index,
          type: option.type || 'image/png',
        });
        this.currentIndex++;
        this.successCount++;
        if (this.needIndex == this.currentIndex) {
          this.response(
            this.needIndex > this.successCount ? -5 : 0,
            this.needIndex > this.successCount
              ? `有${this.needIndex - this.successCount}张上传失败`
              : '',
            this.fileList
          );
        }
      },
      err => {
        this.currentIndex++;
        if (this.needIndex == this.currentIndex) {
          // 失败
          this.response(-4, `有${this.needIndex - this.successCount}张上传失败`, this.fileList);
        }
      }
    );
  }
}

export default Upload;
