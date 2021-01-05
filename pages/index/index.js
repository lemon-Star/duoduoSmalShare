const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: '',
    arr: [],
    msg: {},
    showLoading: false,
    menuList: [
      {
        id: 0,
        name: '1.9包邮'
      },
      {
        id: 1,
        name: '今日爆款'
      },
      {
        id: 2,
        name: '品牌好货'
      },
      {
        id: 3,
        name: '猜你喜欢'
      },
      {
        id: 4,
        name: '实时热销'
      },
      {
        id: 5,
        name: '今日热销'
      },
      {
        id: 6,
        name: '品质好货'
      }
    ],
    currentTab: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getinfo();
    this.qryproduct(0)
  },
  getinfo(){
    let that = this;
    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        // 获取可使用窗口宽度
        let clientHeight = res.windowHeight;
        // 获取可使用窗口高度
        let clientWidth = res.windowWidth;
        // 算出比例
        let ratio = 750 / clientWidth;
        // 算出高度(单位rpx)
        let height = clientHeight * ratio;
        // 设置高度
        that.setData({
          height: height
        });
      }
    });
  },
  showLoading:function(){
    this.setData({
      showLoading:true
    })
  },
  cancelLoading:function(){
    this.setData({
      showLoading:false
    })
  },

  //查询商品列表
  qryproduct(id){
    if(this.data.arr.length>0){
      this.setData({ arr:[] })
    }
    this.showLoading()
    wx.request({
      url: 'https://starlemon.cn/p2p/duoduo/qryProduct', //仅为示例，并非真实的接口地址
      data: {
        channelType:id,
        offset:20
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) =>{
        this.cancelLoading()
        console.log(res)
          const arr = res.data.list
          console.log(arr)
          // arr.unshift(all)
          this.setData({ arr })
      }
    })
  },
  initdata(param){
    console.log('***',param)
    let data ='';
    param==undefined?data='':data=param
    wx.request({
      url: 'https://starlemon.cn/p2p/league', //仅为示例，并非真实的接口地址
      data: {type:data},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) =>{
        console.log(res)
          const arr = res.data.list
          console.log(arr)
          // arr.unshift(all)
          this.setData({ arr })
      }
    })
  },
  clickMenu(e) {
      const index = e.target.dataset.current
      console.log(index)
      this.setData({ currentTab: parseInt(index) })
      this.qryproduct(index);
  },
  changeContent(e){
    console.log(e);
  },
  toCoupon(e) {
      const couponIdx = e.currentTarget.dataset.index
      const wxappinfo = this.data.tabs[this.data.activeTab].coupon[couponIdx].minapp


      console.log('miniinfo', wxappinfo)

      wx.navigateToMiniProgram({
          appId: wxappinfo.appid,
          path: wxappinfo.path,
          success(res) {
              // 打开成功
              console.log('打开成功', res)
          }
      })
  },
  
  getDiscountCoup: function(e){
    wx.navigateToMiniProgram({
      appId: e.currentTarget.dataset.appid,
      path: e.currentTarget.dataset.pagePath,
      extraData: {
      },
      envVersion: 'release',
      success(res) {
        // 打开成功
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
  onShareAppMessage: function (res) {
      if (res.from === 'button') {
          // 来自页面内转发按钮
          console.log(res.target)
      }
      return {
          title: this.data.msg.title,
          path: this.data.msg.path,
          imageUrl: this.data.msg.imageUrl,
      }
  }
})