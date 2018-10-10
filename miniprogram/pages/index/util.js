function getNewData( pageindex, callbackcount, callback) {
  wx.request({
     url: 'https://meng.taropowder.cn//audio/newData.json',
     data: {
        g_tk: 5381,
        uin: 0, 
        format: 'json', 
        inCharset: 'utf-8', 
        outCharset: 'utf-8', 
        notice: 0, 
        platform: 'h5',
        needNewCode: 1, 
        zhidaqu: 1, 
        catZhida: 1, 
        t: 0, 
        flag: 1, 
        ie: 'utf-8', 
        sem: 1, 
        aggr: 0, 
        perpage: 20, 
        n: callbackcount, 
        p: pageindex,      
        remoteplace: 'txt.mqq.all',      
        _: Date.now()    },    
        method: 'GET',    
        header: {'content-Type': 'application/json'},    
        success: function(res){      
          if(res.statusCode == 200)
          {        callback(res.data);      }    
          }  
          }
          )} 
module.exports = { getNewData: getNewData}
