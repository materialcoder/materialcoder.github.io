// 页面切换
var $ = function(e) {
	return document.querySelectorAll(e);
};

window.onload = function() {

	var more = $(".more")[0];
	
	var select = $('input');
	var content = $('#content')[0];

	// 点击更多按钮时切换页面
	more.addEventListener('click', function(){
		select[1].checked = true;
		scroll();
	}, false);

	// 点击导航点时切换页面
	$("#nav")[0].addEventListener('click', function(event) {
		scroll();
	}, false);

	// 滚动鼠标时切换页面
	document.addEventListener('mousewheel', function(event){
		var event = event || window.event,
			index;
		for(var i=0; i<select.length;i++) {
			if(select[i].checked) {
				index = i;
			}
		}
		if(event.wheelDelta < 0) {
			index++;
			if(index == select.length) {
				index = select.length-1;
			}
		} else {
			index--;
			if(index < 0) {
				index = 0;
			}
		}
		select[index].checked = true;
		scroll();
	}, false);


	// 页面切换函数
	function scroll() {
		for(var i=0, len=select.length;i<len;i++) {
			if(select[i].checked) {
				content.style.top = (-100*i) + "%";
				switch(i) {
					case 3:
						showBar();
					break;
				}
			}
		}
	}

	// 显示进度条
	function showBar() {
		var bar = $(".bar-item_bar");
		var tootip = $(".bar-item_tooltip");
		for(var i=0, len = bar.length;i<len;i++) {
			bar[i].style.width = bar[i].dataset.value + "%";
			tootip[i].innerHTML = bar[i].dataset.value + "%";
			tootip[i].style.right = (100 - bar[i].dataset.value + 3) +"%";
			tootip[i].style.opacity = 1;
		}
	}

}