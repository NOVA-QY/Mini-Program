var postsData = require('../../../data/posts-data.js')
Page({
    data: {
        isPlayingMusic: false
    },
    onLoad: function (option) {
        var postId = option.id;
        this.data.currentPostId = postId;    //1.中转获取postId
        var postData = postsData.postList[postId];
        this.setData({
            postData: postData
        })

        // var postsCollected = {
        //     1:"true",
        //     2:"false",
        //     3:"true"
        //     ...
        // }

        //读取文章收藏与否的状态（所有的），键任意指定
        var postsCollected = wx.getStorageSync('posts_collected')

        //判断是否存在
        if (postsCollected) {
            //获取其中一个是否已经缓存
            var postCollected = postsCollected[postId]
            //数据绑定
            //将detail文章是否被收藏的状态绑定到collected变量里
            if (postCollected) {
                this.setData({
                    collected: postCollected
                })
            }
        }
        //若缓存结构体为空
        else {
            var postsCollected = {};
            postsCollected[postId] = false;
            wx.setStorageSync('posts_collected', postsCollected);
        }

        var that = this;
        wx.onBackgroundAudioPlay(function(){
            that.setData({
                isPlayingMusic : true
            })
        });
        wx.onBackgroundAudioPause(function () {
            that.setData({
                isPlayingMusic : false
            })
        });

    },

    onCollectionTap: function (event) {
        this.getPostsCollectedSyc();
        // this.getPostsCollectedAsy();
    },

    getPostsCollectedAsy: function () {
        var that = this;
        //异步的方法后不加任何后缀
        wx.getStorage({
            key: "posts_collected",
            success: function (res) {
                var postsCollected = res.data;
                var postCollected = postsCollected[that.data.currentPostId];   //2.中转获取postId
                //取反：收藏变为未收藏，未收藏变为收藏
                postCollected = !postCollected;
                //更新缓存
                postsCollected[that.data.currentPostId] = postCollected;
                that.showToast(postsCollected, postCollected);  //必须加this
            }
        })
    },

    getPostsCollectedSyc: function () {
        //通过缓存了解是否已经被收藏
        var postsCollected = wx.getStorageSync('posts_collected');
        var postCollected = postsCollected[this.data.currentPostId];   //2.中转获取postId
        //取反：收藏变为未收藏，未收藏变为收藏
        postCollected = !postCollected;
        //更新缓存
        postsCollected[this.data.currentPostId] = postCollected;
        this.showToast(postsCollected, postCollected);  //必须加this
    },

    showModal: function (postsCollected, postCollected) {
        var that = this;//保存this
        wx.showModal({
            title: '收藏',
            content: postCollected ? "收藏该文章？" : "取消收藏该文章？",
            showCancel: "true",
            cancelText: "取消",
            cancelColor: "#333",
            confirmText: "确认",
            confirmColor: "#405f80",
            success: function (res) {
                if (res.confirm) {
                    //更新文件是否收藏的缓存值（相当于数据库更新）
                    wx.setStorageSync('posts_collected', postsCollected);
                    //更新数据绑定变量，从而实现切换图片
                    that.setData({
                        collected: postCollected
                    })
                }
            }
        })
    },

    showToast: function (postsCollected, postCollected) {
        //更新文件是否收藏的缓存值（相当于数据库更新）
        wx.setStorageSync('posts_collected', postsCollected);
        //更新数据绑定变量，从而实现切换图片
        this.setData({
            collected: postCollected
        })
        wx.showToast({
            title: postCollected ? "收藏成功" : "取消成功",
            duration: 1000,
            icon: "success"
        })
    },

    onShareTap: function (event) {
        var itemList = [
            "分享给微信好友",
            "分享到朋友圈",
            "分享到QQ",
            "分享到微博"
        ];
        wx.showActionSheet({
            itemList: itemList,
            itemColor: "#405f80",
            success: function (res) {
                // res.cancel 用户是否点击了取消按钮
                // res.tapIndex 数组元素的序号，从0开始
                wx.showModal({
                    title: "用户" + itemList[res.tapIndex],
                    content: "用户是否取消？" + res.cancel + "现在无法实现分享功能，什么时候能支持呢"
                })
            }
        })
    },

    onMusicTap: function (event) {
        var currentPostId = this.data.currentPostId;
        var postData = postsData.postList[currentPostId];
        var isPlayingMusic = this.data.isPlayingMusic;
        if (isPlayingMusic) {
            wx.pauseBackgroundAudio();
            this.setData({
                isPlayingMusic: false
            })
        }
        else {
            wx.playBackgroundAudio({
                dataUrl: postData.music.url,
                title: postData.music.title,
                coverImgUrl: postData.music.coverImg
            })
            this.setData({
                isPlayingMusic: true
            })
        }
    }
})