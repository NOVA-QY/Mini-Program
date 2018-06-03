// pages/movies/more-movie/more-movie.js
var app = getApp()      //引用全局变量
var util = require("../../../utils/util.js")

Page({
    // 设置中间变量，在两个函数之间共享变量
    data: {
        movies: {},
        navigateTitle: ""
    },

    onLoad: function (options) {
        var category = options.category;
        this.data.navigateTitle = category;
        var dataUrl = "";
        switch (category) {
            case "正在热映":
                dataUrl = app.globalData.doubanBase +
                    "/v2/movie/in_theaters";
                break;
            case "即将上映":
                dataUrl = app.globalData.doubanBase +
                    "/v2/movie/coming_soon";
                break;
            case "豆瓣Top250":
                dataUrl = app.globalData.doubanBase +
                    "/v2/movie/in_theaters";
                break;
        }
        util.http(dataUrl, this.processDoubanData)
    },

    // 接收http发射的res,进行数据处理
    processDoubanData: function (moviesDouban) {
        var movies = [];
        for (var idx in moviesDouban.subjects) {
            var subject = moviesDouban.subjects[idx];
            var title = subject.title;
            if (title.length >= 6) {
                title = title.substring(0, 6) + "...";
            }
            // [1,1,1,1,1] [1,1,1,0,0]
            var temp = {
                stars: util.convertToStarsArray(subject.rating.stars),
                title: title,
                average: subject.rating.average,
                coverageUrl: subject.images.large,
                movieId: subject.id
            }
            movies.push(temp)
        }
        this.setData({
            movies: movies
        });
    },

    onReady: function (event) {
        wx.setNavigationBarTitle({
            title: this.data.navigateTitle,
        })
    }

    
})