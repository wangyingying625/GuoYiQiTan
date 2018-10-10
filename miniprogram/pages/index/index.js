//index.js
var util = require('/util.js')
const app = getApp()
Page({

      data: {
        displayMore:false,
        displayLoading: true,
        displayOver: true,
        newIndex: 0,
        avatarUrl: './user-unlogin.png',
        userInfo: {},
        logged: false,
        takeSession: false,
        requestResult: '',
        list: {},
        newList: [],
        isFromSearch: true,
        callbackcount: 5,
        searchPageNum: 1
      },
      onLoad: function() {
        var str = {ppp:"p"}
        console.log(str)
        console.log(typeof(str))
          var that = this
        this.setData({ 
          searchPageNum: 1,   //第一次加载，设置1          
          isFromSearch: true,  //第一次加载，设置true             
          })   
          this.fetchSearchList();

          console.log(that.data.newList)
          wx.request({
            url: 'https://meng.taropowder.cn//audio/hotData.json',
            headers: {
              'Content-Type': 'application/json'
            },
            success: function(res) {
              that.setData({
                list: res.data,
              })
            }
          })
               if (!wx.cloud) {
                  wx.redirectTo({
                    url: '../chooseLib/chooseLib',
                  })
                  return
                }

                // 获取用户信息
                wx.getSetting({
                  success: res => {
                    if (res.authSetting['scope.userInfo']) {
                      // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                      wx.getUserInfo({
                        success: res => {
                          this.setData({
                            avatarUrl: res.userInfo.avatarUrl,
                            userInfo: res.userInfo
                          })
                        }
                      })
                    }
                  }
                })
              },
  searchNav:function(){
    wx.navigateTo({
      url: '../search/search',
    })
  },
  fetchSearchList: function () {
    let that = this; 
    let searchPageNum = that.data.searchPageNum,
        callbackcount =that.data.callbackcount;     
  util.getNewData(searchPageNum,callbackcount, function(data){         console.log(data)            
    let searchList = [];
    var i=that.data.newList.length   
    var count=data.length
    if(count-i>4){
      searchList = that.data.newList.concat(data[i], data[i + 1], data[i + 2], data[i + 3], data[i + 4])
      that.setData({
        newList: searchList,
        displayMore: false,
        displayOver: true
      });
    }
    else {
      for(;i<count;i++)
      {
        searchList = that.data.newList.concat(data[i])
        that.setData({
          newList: searchList
        })
      }
      that.setData({
        displayMore: true,
        displayOver: false
      });
    }         
    });  
  },
  searchScrollLower: function () {
    let that = this; 
    if (!that.data.displayMore && that.data.displayOver) {
      that.setData({ searchPageNum: that.data.searchPageNum + 1,       
      isFromSearch: false      });     
      that.fetchSearchList();   
       } 
       },

              onGetUserInfo: function(e) {
                  if (!this.logged && e.detail.userInfo) {
                    this.setData({
                      logged: true,
                      avatarUrl: e.detail.userInfo.avatarUrl,
                      userInfo: e.detail.userInfo
                    })
                  }
                },

                onGetOpenid: function() {
                  // 调用云函数
                  wx.cloud.callFunction({
                    name: 'login',
                    data: {},
                    success: res => {
                      console.log('[云函数] [login] user openid: ', res.result.openid)
                      app.globalData.openid = res.result.openid
                      wx.navigateTo({
                        url: '../userConsole/userConsole',
                      })
                    },
                    fail: err => {
                      console.error('[云函数] [login] 调用失败', err)
                      wx.navigateTo({
                        url: '../deployFunctions/deployFunctions',
                      })
                    }
                  })
                },
                // 上传图片
                doUpload: function() {
                  // 选择图片
                  wx.chooseImage({
                    count: 1,
                    sizeType: ['compressed'],
                    sourceType: ['album', 'camera'],
                    success: function(res) {

                      wx.showLoading({
                        title: '上传中',
                      })

                      const filePath = res.tempFilePaths[0]

                      // 上传图片
                      const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
                      wx.cloud.uploadFile({
                        cloudPath,
                        filePath,
                        success: res => {
                          console.log('[上传文件] 成功：', res)

                          app.globalData.fileID = res.fileID
                          app.globalData.cloudPath = cloudPath
                          app.globalData.imagePath = filePath

                          wx.navigateTo({
                            url: '../storageConsole/storageConsole'
                          })
                        },
                        fail: e => {
                          console.error('[上传文件] 失败：', e)
                          wx.showToast({
                            icon: 'none',
                            title: '上传失败',
                          })
                        },
                        complete: () => {
                          wx.hideLoading()
                        }
                      })

                    },
                    fail: e => {
                      console.error(e)
                    }
                  })
                },

            })