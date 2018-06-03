/*
    存放公共函数
*/


function convertToStarsArray(stars) {
    var num = stars.toString().substring(0, 1);
    var array = [];
    for (var i = 1; i <= 5; i++) {
        if (i <= num) {
            array.push(1);
        } else {
            array.push(0);
        }
    }
    return array;
}

// 获取豆瓣的数据
// 异步方法，需要回调函数
// 可拓展：添加method、post等参数进行传参（服务器代码）
function http(url,callBack){
    wx.request({
        url: url,
        method: 'GET',
        header: {
            "content-type": "json"
        },
        success: function (res) {
            callBack(res.data);
        },
        fail: function (error) {
            console.log(error)
        }
    })
}

module.exports = {
    convertToStarsArray: convertToStarsArray,
    // 输出
    http:http
}