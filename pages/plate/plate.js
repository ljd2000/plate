// pages/plate/plate.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    territory: "粤",
    flag1:true,
    flag2:true,
    flag3:true,
    plate:"",
    buttonClicked:false,
    maxlength:7,
    building:"",
    owner:""
  },

  //开启 地域选择键盘
  open1: function () { 
    console.log("打开汉字键盘组件open");
    this.setData({ isShow: true, keyBoardType: 1 }); 
  },
   //开启 地域选择键盘
   open2: function () { 
    console.log("打开汉字键盘组件open");
    this.setData({ isShow: true, keyBoardType: 2 }); 
  },

  //开启 车牌选择键盘
  openInput: function () { this.setData({ isShow: true, keyBoardType: 2 });},

  //关闭键盘
  close: function () {  this.setData({ isShow: false });},

  //点击了删除
  delete: function (e) {
    this.setData({ plate: this.data.plate.substring(0, this.data.plate.length - 1) });
  },

  //点击键盘
  click: function (e) {
    var val = e.detail;
    if (!val) return;

    //汉字 正则表达式
    var reg = new RegExp('[u4E00-u9FFF]+', 'g');
    if (!reg.test(val)) {
      this.setData({ territory: val, keyBoardType: 2 });
    } else {
      if (this.data.plate.length == 7) return;
      this.setData({ plate: this.data.plate + val });
    }
  },

  //点击了 小键盘确认
  ok: function (e) { this.setData({ isShow: false }); },


  showLoading:function (message){
    if(wx.showLoading){
      // 基础库 1.1.0 微信6.5.6版本开始支持，低版本需做兼容处理
      wx.showLoading({
        title: message,
        mask: true
      });
    } else {
      // 低版本采用Toast兼容处理并将时间设为20秒以免自动消失
      wx.showToast({
        title: message,
        icon: 'loading',
        mask: true,
        duration: 20000
      });
    }
  },
 
  hideLoading:function () {
    if (wx.hideLoading) {
      // 基础库 1.1.0 微信6.5.6版本开始支持，低版本需做兼容处理
      wx.hideLoading();
    } else {
      wx.hideToast();
    }
  },

  /**
   * 按钮点击事件
   */
  btnClick:function(){
    var that =this;
    that.setData({
      buttonClicked: true,
      isShow: false
    });

    //检验处理
    var plate = this.data.plate;
    var territory = this.data.territory;
    if(plate != ""){

      // let reg = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/
      // const careg = reg.test(this.data.plate);
      // if (!careg) {
      //   wx.showToast({
      //     icon: 'none',
      //     title: '请输入正确车牌号',
      //   });
      //   that.setData({
      //     buttonClicked: false
      //   });
      //   return;
      // }
      //开始调用获取车牌号函数
      this.getPlateInfo(territory, plate, function(res){
        console.log(res.data) ;       
      });
      //3、点击按钮，调用getPlateInfo函数传入this.data.plate
    console.log("3、点击按钮后，调用getPlateInfo函数传入this.data.plate："+plate)
    }else{
      console.log("车牌号输入为空");
      that.setData({
        buttonClicked:false,
        isShow: false,
        maxlength:7,
        flag1:true,
        flag2:true,
        flag3:true
      });
      wx.showModal({
        title: '提示',
        content: '请输入车牌号',
        showCancel: false,
        confirmColor: '#0f77ff',
        success: (res) => {}
      });
    }
  },

  //粤BF62527
  /**
   * 输入框检测，同时去除输入的空格
   * @param {*} e 
   */
  getInputValue:function(e){
    var that =this;
    this.setData({
      plate:e.detail.value.replace(/\s+/g, '')
    });
    var plate = this.data.plate;
    if( plate == ""){
      that.setData({
        buttonClicked:false,
        flag1:true,
        flag2:true,
        flag3:true
      });
    }
   //1、当输入框input发生变化时，检测到输入框的内容已经赋给了data中的plate
   console.log("1、当输入框input发生变化时，检测到输入框的内容已经赋给了data中的plate，this.data.plate："+this.data.plate) 
  },

  /**
   * 获取车牌信息的函数
   * @param {*} plate 参数为所输入的车牌号
   */
  getPlateInfo:function(territory, plate){
    var that = this;
    console.log("2、进入getPlateInfo，并传入plate："+territory+plate);
    var plateUC = plate.toUpperCase();
    console.log("@@@@@@@即将传入的车牌号为："+territory+plateUC);

    wx.request({
      url: 'https://plate9443.ddnsto.com/plate/'+territory+plateUC,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data);
        var msg = res.data.msg;
        if(msg == "success"){
          console.log("success")
          if(res.data.listPlate != false){
            console.log("返回结果成功，且listPlate[]不为空")
            if(res.data.listPlate[0].ownerType == 0){            
              that.setData({
                building:res.data.listPlate[0].building,
                buttonClicked:false,
                flag1:false,
                owner:"业主",
                flag2:true,
                flag3:true
              });
              console.log("该车牌为"+res.data.listPlate[0].building+"栋业主车牌");
            }else if(res.data.listPlate[0].ownerType == 1){
              that.setData({
                building:res.data.listPlate[0].building,
                buttonClicked:false,
                flag1:false,
                owner:"租户",
                flag2:true,
                flag3:true
              });
              console.log("该车牌为"+res.data.listPlate[0].building+"栋租户车牌");
            }else if(res.data.listPlate[0].ownerType == 2){
              that.setData({
                buttonClicked:false,
                flag1:true,
                owner:"外来",
                flag2:false,
                flag3:true
              });
              console.log("该车牌为外来车牌");
            }
          }else{//此处为需求要点            
            console.log("返回结果成功，listPlate[]为空");
            that.setData({
              buttonClicked:false,
              flag1:true,
              flag2:true,
              flag3:false
            });
            console.log("该车牌为外来车牌,或者输入有误");
          }
        }
      },
      "fail" : (e)=> {
        console.log(e,999)
        if (e.errMsg ==="request:fail abort"){
          return
        };
        that.setData({
          buttonClicked:false,
          flag1:true,
          flag2:true,
          flag3:false
        });
        wx.showModal({
          title: '提示',
          content: '请求失败,请检查网络',
          showCancel: false,
          confirmColor: '#0f77ff',
          success: (res) => {}
        })
      }
    });
  },  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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