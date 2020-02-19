Page({
  data: {
    height: 20,
    focus: false,
    usrText: '',
    textTile: '请输入需要乱序的英文文本：',
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
    })
  },
  clickButton: function (e) {
    var myThis = this;
    console.log('Input:', this.data.usrText);
    wx.request({
      url: 'https://tool.ktwo.ml/ktwo/idscrmblr.php?array=\'' + this.data.usrText + '\'',
      success: function (res) {
        console.log('result:', res.data);
        myThis.setData({
          usrText: res.data,
          textTile: '以下为已经乱序的文本，已复制至剪切板',
        }),
          wx.setClipboardData({
            data: res.data,
          })
      },
    })
  },
})