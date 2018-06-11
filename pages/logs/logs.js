//logs.js
const util = require('../../utils/util.js')
var amapFile = require('../../libs/amap-wx.js');
var markersData = [];

Page({
  data: {
    //日志数据
    logs: [],
    //地图数据
    markers: [],
    latitude: '',
    longitude: '',
    textData: {}
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
  //初始化
  onLoad: function () {
    var that = this;
    //Instantite 高德object
    var myAmapFun = new amapFile.AMapWX({ key: '92957592d1d598dc9f3394fec01e2715' });
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
    }),
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  }
})
