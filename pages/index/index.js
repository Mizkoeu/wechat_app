//index.js
//获取应用实例
const app = getApp();
var amapFile = require('../../libs/amap-wx.js');
var markersData = [];
var index;
var nav_content_list = [
  ['曼哈顿', '新泽西', '我也不知道还有哪里了'],
  ['整租', '合租', '买房', '我有钱'],
  ['不限', '1000刀', '2000刀', '我钱多，随便'],
  ['价格', '满意度', '热度']
];
var house_list = [
  "你家大门常打开",
  "北京欢迎你",
  "曼哈顿的大房子",
  "特朗普的shithole",
  "习大大的中南海",
  "自由女神像"
]

Page({
  data: {
    //菜单初始信息
    nav_title: ['区域', '方式', '租金', '筛选'],
    shownavindex: null,
    navcontent: null,
    //抓取的用户数据
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    //地图数据
    markers: [],
    latitude: '',
    longitude: '',
    textData: {},
    //房产数据清单
    house_list: house_list,
    motto: 'Hello World'
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //点击下拉菜单时间处理
  click_nav: function(e) {
    if (index == e.currentTarget.dataset.index && this.data.nav_content != null) {
      //如果index相同, 收回菜单
      index = e.currentTarget.dataset.index;
      this.setData({
        nav_content: null,
        shownavindex: null
      })
    } else if (this.data.nav_content == null) {
      //drop-down menu. need to set off animation!
      console.log('test1');
      index = e.currentTarget.dataset.index;
      this.setData({
        nav_content: nav_content_list[Number(index)],
        shownavindex: index
      })
    } else {
      //switch menu tab
      console.log('test2');
      index = e.currentTarget.dataset.index;
      this.setData({
        nav_content: nav_content_list[Number(index)],
        shownavindex: index
      })
    }
  },
  //点击地图marker事件处理
  markertap: function (e) {
    var id = e.markerId;
    var that = this;
    that.showMarkerInfo(markersData, id);
    that.changeMarkerColor(markersData, id);
  },
  //显示marker信息事件
  showMarkerInfo: function (data, i) {
    var that = this;
    that.setData({
      textData: {
        name: data[i].name,
        desc: data[i].address
      }
    });
  },
  //更改marker颜色
  changeMarkerColor: function (data, i) {
    var that = this;
    var markers = [];
    for (var j = 0; j < data.length; j++) {
      if (j == i) {
        data[j].iconPath = null;//"选中 marker 图标的相对路径"
      } else {
        data[j].iconPath = null; //"未选中 marker 图标的相对路径"
      }
      markers.push(data[j]);
    }
    that.setData({
      markers: markers
    });
  },
  //页面初始化
  onLoad: function () {
    var that = this;
    //Instantite 高德object
    var myAmapFun = new amapFile.AMapWX({key: '92957592d1d598dc9f3394fec01e2715'});
    myAmapFun.getPoiAround({
      iconPathSelected: null,
      iconPath: null,
      success: function (data) {
        markersData = data.markers;
        that.setData({
          markers: markersData
        });
        that.setData({
          latitude: markersData[0].latitude
        });
        that.setData({
          longitude: markersData[0].longitude
        });
        that.showMarkerInfo(markersData, 0);
      },
      fail: function (info) {
        wx.showModal({ title: info.errMsg })
      }
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  changeMotto: function(e) {
    this.setData({
      motto: '聪明的孩子，你点对了。'
    })
  }
})
