// 加载进度条

var $ = function(e) {
	return document.querySelectorAll(e);
};
var imgs = $('img');
var num = 0;
var len = imgs.length;
var isScroll = false;
imgs.forEach(function(item, index) {
	var oImg = new Image();
	oImg.onload = function() {
		oImg.onload = null;
		num++;
		$(".loading b")[0].innerHTML = parseInt(num/len * 100) + "%";
		if(num >= len) {
			$('.loading')[0].style.display = "none";
			isScroll = true;
		}
	}
	oImg.src = item.src
});