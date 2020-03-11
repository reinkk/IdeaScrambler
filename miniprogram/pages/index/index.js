//var saveImage = require('image.js'); 

Page({
  data: {
    height: 20,
    focus: false,
    cHeight: 900,
    cWidth: 600,
    usrText: '',
//    usrText: '全局禁忌”是一个产品一定不出现的条件，不论产品列在哪个基因报告里，禁忌都是一样的。1234, 12345, 123456, 1234567,12345678,123456789,1234567890\nlast week, i went to the thea/tre. i have a very week-sub-popu/lation.',
    textTile: '请输入需要乱序的文本：',
  },
  bindButtonTap: function () {
    this.setData({
      focus: true
    })
  },

  usrTextInput: function (e) {
    this.setData({
      usrText: e.detail.value
    })
  },


  bindTextAreaBlur: function (e) {
    console.log(e.detail.value)
  },
  cleanText: function (e) {
    var myThis = this;
    myThis.setData({
      usrText: '',
      textTile: '请输入需要乱序的文本：',
    })
  },

  clickButton2: function (e) {
    var myThis = this;
    if (this.data.usrText.trim() == '') {
      wx.showToast({
        title: '请输入文本',
        icon: 'none',
        duration: 2000
      }),
      this.setData({
        usrText: '',
      })
    } else {
//    console.log('Input:', this.data.usrText);
      myThis.setData({
        usrText: finaltrans(this.data.usrText),
        textTile: '以下为已经乱序的文本，已复制至剪切板',
      }),
      wx.setClipboardData({
        data: this.data.usrText,
      })
    }    
  },

  trySave: function () {
    var that = this;
    if (this.data.usrText.trim() == '') {
      wx.showToast({
        title: '请输入文本',
        icon: 'none',
        duration: 2000
      }),
        this.setData({
          usrText: '',
        })
    } else if (getMojiLength(this.data.usrText.trim()) > 4000) {
      wx.showToast({
        title: '输入文本不能长于4000个半角字符，您已输入' + getMojiLength(this.data.usrText.trim()) + '个半角字符',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.writePhotosAlbum']) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success() {
                that.saveImage();
              },
              fail() {
                wx.showToast({
                  title: '您已拒绝相册写入权限，将无法使用保存图片功能',
                  icon: 'none',
                  duration: 2000
                })
              }
            })
          } else {
            that.saveImage();
          }
        }
      })
    }
  },

  drawText: function (ctx, str, initHeight, titleHeight, canvasWidth) {
    canvasWidth = canvasWidth - 70;
    var lineWidth = 0;
    var lastSubStrIndex = 0; 
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
      if (str[i] == '\n') {
        ctx.fillText(str.substring(lastSubStrIndex, i).replace("\n",''), 35, initHeight);
        initHeight += 45;
        lineWidth = 0;
        lastSubStrIndex = i;
        titleHeight += 45;
      } else if (lineWidth > canvasWidth) {
        ctx.fillText(str.substring(lastSubStrIndex, i).replace("\n", ''), 35, initHeight);
        initHeight += 30;
        lineWidth = 0;
        lastSubStrIndex = i;
        titleHeight += 30;
      }
      if (i == str.length - 1) {
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), 35, initHeight);
      }
    }
    titleHeight = titleHeight + 10;
    return titleHeight
  },

  saveImage: function (e) {
    var that = this;
    var cWidth = this.data.cWidth;
    var cHeight = this.data.cHeight;
    var text = this.data.usrText;
    const ctx = wx.createCanvasContext('saveImage', this);

    ctx.fillStyle = "#F7F7F7";
    ctx.fillRect(0, 0, cWidth, 3000);
//    console.log('fitst cWidth cHeight:', cWidth, cHeight);

    ctx.setTextAlign('center');
    ctx.setFillStyle('#333333');
    ctx.setFontSize(28);
    ctx.fillText('混沌意念 Scrambled Idea', cWidth / 2, 50);

    ctx.setTextAlign('left');
    ctx.setFontSize(18);
    ctx.fillStyle = "#666666";
    ctx.lineWidth = 1;

    var titleHeight = 130;
    var initHeight = 110;

    ctx.fillStyle = "#666666";

    titleHeight = this.drawText(ctx, text, initHeight, titleHeight, cWidth);
    cHeight = titleHeight + 170;
    this.setData({ cWidth: cWidth, cHeight: titleHeight + 200 });

    ctx.fillStyle = "#999999";
    ctx.moveTo(30, initHeight-40);
    ctx.lineTo(cWidth - 30, initHeight - 40);
    ctx.moveTo(30, titleHeight);
    ctx.lineTo(cWidth-30, titleHeight);

    ctx.drawImage('../images/code.png', cWidth / 2 - 203.5, titleHeight+10, 407, 150);

    ctx.stroke();
    ctx.draw();

    wx.showToast({
      title: '混沌图片生成中...',
      icon: 'loading',
      duration: 2000
    })

    wx.canvasToTempFilePath({
      height: cHeight,
      canvasId: 'saveImage',
      success: function (res) {
//        console.log(res.tempFilePath);
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath
        })
        wx.showToast({
          title: '图片已保存至相册',
          duration: 2000
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '调用缓存失败',
          duration: 2000
        })
      }
    })
  }

//  clickButton: function (e) {
//    var myThis = this;
//    console.log('Input:', this.data.usrText);
//    wx.request({
//      url: 'https://tool.ktwo.ml/ktwo/idscrmblr.php?array=\'' + this.data.usrText + '\'',
//      success: function (res) {
//        console.log('result:', res.data);
//        myThis.setData({
//          usrText: res.data,
//          textTile: '以下为已经乱序的文本，已复制至剪切板',
//        }),
//          wx.setClipboardData({
//            data: res.data,
//          })
//      },
//    })
//  },
})

var cnmark = /[\u3000|\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5|\n|\r]+/;
var enmark = /[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?|\n|\r]+/;
var allmark = /[\u3000|\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5|\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?|\n|\r]+/;
var allnonmark = /[^\u3000\u3002\uff1f\uff01\uff0c\u3001\uff1b\uff1a\u201c\u201d\u2018\u2019\uff08\uff09\u300a\u300b\u3008\u3009\u3010\u3011\u300e\u300f\u300c\u300d\ufe43\ufe44\u3014\u3015\u2026\u2014\uff5e\ufe4f\uffe5\ \~\`\!\@\#\$\%\^\&\*\(\)\-\_\+\=\\\\[\]\{\}\;\:\"\'\,\<\.\>\/\?\n\r]+/;
var firstmark = /^[\u3000\u3002\uff1f\uff01\uff0c\u3001\uff1b\uff1a\u201c\u201d\u2018\u2019\uff08\uff09\u300a\u300b\u3008\u3009\u3010\u3011\u300e\u300f\u300c\u300d\ufe43\ufe44\u3014\u3015\u2026\u2014\uff5e\ufe4f\uffe5\ \~\`\!\@\#\$\%\^\&\*\(\)\-\_\+\=\\\\[\]\{\}\;\:\"\'\,\<\.\>\/\?\n\r]+/;
var lastmark = /[\u3000\u3002\uff1f\uff01\uff0c\u3001\uff1b\uff1a\u201c\u201d\u2018\u2019\uff08\uff09\u300a\u300b\u3008\u3009\u3010\u3011\u300e\u300f\u300c\u300d\ufe43\ufe44\u3014\u3015\u2026\u2014\uff5e\ufe4f\uffe5\ \~\`\!\@\#\$\%\^\&\*\(\)\-\_\+\=\\\\[\]\{\}\;\:\"\'\,\<\.\>\/\?\n\r]+$/;


function finaltrans(data) {
  var finaltext = new Array();
  data = data.replace(/\r/g, '').replace(/\n+/g, '\n');
  data = data.replace(/([^\x00-\xff]+)/g, "/$1/");
  var aaall_orig = data.split(allmark);
  var aaall2_orig = data.split(allnonmark);
  var firstMark = firstmark.test(data);
  var lastMark = lastmark.test(data);
//  console.log('first mark:', firstMark);
//  console.log('all nonmark:', aaall);
//  console.log('all mark:', aaall2);

  if (firstMark) {
    aaall_orig.shift();
  }
  if (!lastMark) {
    aaall_orig.push('');
  }

  var aaall = aaall_orig;
  var aaall2 = aaall2_orig;

  var aaall = new Array();
  var aaall2 = new Array();

  for (var i = 0; i < aaall_orig.length; i++) {
    if (aaall_orig[i].length > 8) {
      var n = 5;
      aaall = aaall.concat(split2small(aaall_orig[i], n));
      aaall2.push(aaall2_orig[i]);
      aaall2 = aaall2.concat(split2small2(aaall_orig[i], n));
      
    } else if (aaall_orig[i].length > 6) {
      var n = 4;
      aaall = aaall.concat(split2small(aaall_orig[i], n));
      aaall2.push(aaall2_orig[i]);
      aaall2 = aaall2.concat(split2small2(aaall_orig[i], n));
    } else {
      aaall.push(aaall_orig[i]);
      aaall2.push(aaall2_orig[i]);
    }
  }


  aaall.forEach(function (aa) {
    finaltext = trans(aa, finaltext);
  })

  
  var finaltext2 = '';
//  console.log('all final:', finaltext);
  for (var i = 0; i < finaltext.length; i++) {
    finaltext2 = finaltext2 + aaall2[i] + finaltext[i]
  }
  finaltext2 = finaltext2.replace(/\//g,"");
  return finaltext2;
}

function split2small(str,n) {
  var tmp_arr = new Array;
  for (var i = 0, l = str.length; i < l / n; i++) {
    tmp_arr.push(str.slice(n * i, n * (i + 1)));
  }
//  console.log('tmp_arr:', tmp_arr);
  return tmp_arr;
}

function split2small2(str, n) {
  var tmp_arr2 = new Array;
  for (var i = 0, l = str.length; i < l / n; i++) {
    tmp_arr2.push('\/');
  }
  tmp_arr2.pop();
//  console.log('tmp_arr2:', tmp_arr2);
  return tmp_arr2;
}

function issbccase(strTmp) {
  for (var i = 0; i < strTmp.length; i++) {
    if (strTmp.charCodeAt(i) > 128) {
      return true;
      break;
    }
  }
  return false;
}

function unique(arr) {
  return Array.from(new Set(arr))
}

function shuffle(arr) {
  arr.sort(function () {
    return Math.random() - 0.5;
  });
}

var shuf = function (input) {
  var array = input.split("");
  var array2 = array.sort(function () {
    return .5 - Math.random();
  });
  var out = array2.join('');
  if (out != input) {
    return out;
  } else {
    return shuf(input);
  }
}

function getMojiLength(str) {
  var realLength = 0;
  var len = str.length;
  var charCode = -1;
  for (var i = 0; i < len; i++) {
    charCode = str.charCodeAt(i);
    if (charCode >= 0 && charCode <= 254) {
      if (charCode == 162
        || charCode == 163
        || charCode == 167
        || charCode == 168
        || charCode == 171
        || charCode == 172
        || charCode == 175
        || charCode == 176
        || charCode == 177
        || charCode == 180
        || charCode == 181
        || charCode == 182
        || charCode == 183
        || charCode == 184
        || charCode == 187
        || charCode == 215
        || charCode == 247) {
        realLength += 2;
      } else {
        realLength += 1;
      }
    } else if (charCode >= 65377 && charCode <= 65439) {
      if (charCode == 65381) { 
        realLength += 2;
      } else {
        realLength += 1;
      }
    } else {
      realLength += 2;
    }
  }
  return realLength;
}

function trans(input, finaltext) {
  if (input.length <= 3 || input.match(/^\d+$/g)) {
    finaltext.push(input);
  } else {
    var start = input.substr(0, 1);
    var end = input.substr(-1);
    var mid = input.substr(1, input.length - 2);
    var mids = mid.split("");
    mids = unique(mids);
    if (mids.length == 1) {
      finaltext.push(input);
    } else {
      var mid_shuf = shuf(mid);
      finaltext.push(start + mid_shuf + end);
    }
  }
  return finaltext;
};
