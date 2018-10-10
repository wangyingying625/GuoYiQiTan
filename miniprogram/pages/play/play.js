// miniprogram/pages/play/play.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentId:0,
    current: {
      poster: '../index/001.jpg',
      name: '国医馆',
      author: 'author',
      src: '../../audio/001.mp3',
    },
    audioAction: {
      method: 'pause'
    }
  },
  playAudio: function () {
    this.setData({
      audioAction: {
        method: 'play'
      }
    });
  },
  pauseAudio: function () {
    this.setData({
      audioAction: {
        method: 'pause'
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this
    console.log(this.data.currentId)
    console.log(options)
    console.log(options.id)
    wx.request({
        url: 'https://meng.taropowder.cn//audio/content.json',
        method: 'GET',
      data: {
        id: options.id
      },
      headers: {
        'Content-Type': 'application/json'
      },
      success:function(res)
      {
        console.log(res)
       that.setData({
         current:{
           poster:res.data.poster,
           name:res.data.name,
           author:res.data.author,
           src:res.data.src,
           content:res.data.content,
           date:res.data.date
         }
       }) 
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})