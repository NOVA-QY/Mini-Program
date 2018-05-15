var postsData = require('../../data/posts-data.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
      //小程序总是会读取data对象来做数据绑定，这个动作称为动作A
      //而这个动作A的执行，是在onLoad事件执行之后发生的
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
      //页面初始化，options为页面跳转所带来的参数
      this.setData({
          posts_key: postsData.postList
      })
  },

  onPostTap:function(event){
      var postId = event.currentTarget.dataset.postid;
    // console.log("on post id is "+postId);
    wx.navigateTo({
        url: "post-detail/post-detail?id="+postId
    })
  }
})