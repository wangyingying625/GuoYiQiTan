//获取应用实例
var app = getApp()
Page({
  data: {
    audioList: [],
    audioIndex: 0,
    pauseStatus: true,
    timer: '',
    currentPosition: 0,
    duration: 0,
  },
  onLoad: function (options) {
    var that=this
    console.log('onLoad')
    console.log(options)
that.setData({
  audioIndex: options.id
})
    wx.request({
      url: 'https://meng.taropowder.cn//audio/newData.json',
      method:'GET',
      data:{
        id: options.id
      },
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        that.setData({
          audioList: res.data,
          audioIndex: options.id,
        })
      }
    })
    //  获取本地存储存储audioIndex
    /*var audioIndexStorage = wx.getStorageSync('audioIndex')
    console.log(audioIndexStorage)
    if (audioIndexStorage) {
      this.setData({ audioIndex: audioIndexStorage })
    }*/
  },
  onReady: function (e) {
    console.log('onReady')
  },
  bindSliderchange: function (e) {
    // clearInterval(this.data.timer)
    let value = e.detail.value
    let that = this
    console.log(e.detail.value)
    wx.getBackgroundAudioPlayerState({
      success: function (res) {
        console.log(res)
        let { status, duration } = res
        if (status === 1 || status === 0) {
          that.setData({
            sliderValue: value
          })
          wx.seekBackgroundAudio({
            position: value * duration / 100,
          })
        }
      }
    })
  },
  bindTapPrev: function () {
    console.log('bindTapNext')
    let length = this.data.audioList.length
    let audioIndexPrev = this.data.audioIndex
    let audioIndexNow = audioIndexPrev
    if (audioIndexPrev === 0) {
      audioIndexNow = length - 1
    } else {
      audioIndexNow = audioIndexPrev - 1
    }
    this.setData({
      audioIndex: audioIndexNow,
      sliderValue: 0,
      currentPosition: 0,
      duration: 0,
    })
    let that = this
    setTimeout(() => {
      if (that.data.pauseStatus === true) {
        that.play()
      }
    }, 1000)
    wx.setStorageSync('audioIndex', audioIndexNow)
  },
  bindTapNext: function () {
    console.log('bindTapNext')
    let length = this.data.audioList.length
    let audioIndexPrev = this.data.audioIndex
    let audioIndexNow = audioIndexPrev
    if (audioIndexPrev === length - 1) {
      audioIndexNow = 0
    } else {
      audioIndexNow = audioIndexPrev + 1
    }
    this.setData({
      audioIndex: audioIndexNow,
      sliderValue: 0,
      currentPosition: 0,
      duration: 0,
    })
    let that = this
    setTimeout(() => {
      if (that.data.pauseStatus === false) {
        that.play()
      }
    }, 1000)
    wx.setStorageSync('audioIndex', audioIndexNow)
  },
  bindTapList: function (e) {
    var thatId = this.data.audioIndex
    console.log('bindTapList')
    console.log(e)
    wx.navigateTo({
      url: "../play/play?id=" + thatId,
    })
  },
  bindTapPlay: function () {
    console.log('bindTapPlay')
    console.log(this.data.pauseStatus)
    if (this.data.pauseStatus === true) {
      this.play()
      this.setData({ pauseStatus: false })
    } else {
      wx.pauseBackgroundAudio()
      this.setData({ pauseStatus: true })
    }
  },
  bindTapChoose: function (e) {
    console.log('bindTapChoose')
    console.log(e)
    this.setData({
      audioIndex: parseInt(e.currentTarget.id, 10),
      listShow: false
    })
    let that = this
    setTimeout(() => {
      if (that.data.pauseStatus === false) {
        that.play()
      }
    }, 1000)
    wx.setStorageSync('audioIndex', parseInt(e.currentTarget.id, 10))
  },
  play() {
    let { audioList, audioIndex } = this.data
    wx.playBackgroundAudio({
      dataUrl: audioList[audioIndex].src,
      title: audioList[audioIndex].name,
      coverImgUrl: audioList[audioIndex].poster
    })
    let that = this
    let timer = setInterval(function () {
      that.setDuration(that)
    }, 1000)
    this.setData({ timer: timer })
  },
  setDuration(that) {
    wx.getBackgroundAudioPlayerState({
      success: function (res) {
        console.log(res)
        let { status, duration, currentPosition } = res
        if (status === 1 || status === 0) {
          that.setData({
            currentPosition: that.stotime(currentPosition),
            duration: that.stotime(duration),
            sliderValue: Math.floor(currentPosition * 100 / duration),
          })
        }
      }
    })
  },
  stotime: function (s) {
    let t = '';
    if (s > -1) {
      let min = Math.floor(s / 60) % 60;
      let sec = s % 60;

      if (min < 10) { t += "0"; }
      t += min + ":";
      if (sec < 10) { t += "0"; }
      t += sec;
    }
    return t;
  },
  onShareAppMessage: function () {
    let that = this
    return {
      title: '国医奇谈：' + that.data.audioList[that.data.audioIndex].name,
      success: function (res) {
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '分享失败',
          icon: 'cancel',
          duration: 2000
        })
      }
    }
  }
})
