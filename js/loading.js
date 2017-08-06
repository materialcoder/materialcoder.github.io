// 加载进度条

var $ = function(e) {
	return document.querySelectorAll(e);
};
var imgs = $('img');
var num = 0;
var len = imgs.length;
var isScroll = false;

foreach(imgs, function(item, index) {
	var oImg = new Image();
	oImg.onload = function() {
		oImg.onload = null;
		num++;
		$(".loading b")[0].innerHTML = parseInt(num/len * 100) + "%";
		if(num >= len) {
			$('.loading')[0].style.transform = "scale(0) rotate(720deg)";
			$('.loading')[0].style.opacity = "0";
			isScroll = true;
		}
	}
	oImg.src = item.src
});

function foreach(ele, handler) {
	if(ele.forEach) {
		ele.forEach(handler);
	} else {
		// IE不支持forEach方法
		for(var i=0;i<ele.length;i++) {
			handler(ele[i], i);
		}
	}
}