window.onload = function() {
	var $ = function(e) {
		return document.querySelectorAll(e);
	};

	var more = $(".more")[0];
	
	var select = $('input');
	var content = $('#content')[0];

	var EventUtil = {
		addHandler: function(element, type, handler) {
			if(element.addEventListener) {
				element.addEventListener(type, handler, false);
			} else if(element.attachEvent) {
				element.attachEvent('on' + type, handler);
			} else {
				element['on'+type] = handler;
			}
		},

		getEvent: function(event) {
			return event ? event : window.event;
		},

		getTarget: function(event) {
			return event.target || window.event.target;
		},

		removeHandler: function(element, type, handler) {
			if(element.removeEventListener) {
				element.removeEventListener(type, handler, false);
			} else if(element.detachEvent) {
				element.detachEvent('on' + type, handler);
			} else {
				element['on'+type] = null;
			}
		}
	};

	// 点击更多按钮时切换页面
	EventUtil.addHandler(more,'click', function(){
		select[1].checked = true;
		scroll();
	});

	// 点击导航点时切换页面
	EventUtil.addHandler($("#nav")[0], 'click', scroll);

	// 滚动鼠标时切换页面
	if(isScroll) {
		EventUtil.addHandler(document, "mousewheel", slideByMouseAndKey);
		EventUtil.addHandler(document, "keyup", slideByMouseAndKey);
	}


	// 页面切换函数
	function scroll() {
		for(var i=0, len=select.length;i<len;i++) {
			if(select[i].checked) {
				content.style.top = (-100*i) + "%";
				if(i == 3) {
					showBar();
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

	// 通过鼠标滚轮和键盘俺就切换页面方法
	function slideByMouseAndKey(event) {
		var event = EventUtil.getEvent(event);
		var index = 0;

		for(var i=0; i<select.length;i++) {
			if(select[i].checked) {
				index = i;
			}
		}

		switch(event.type) {
			case "mousewheel":
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
				break;
			case "keyup":
				if(event.keyCode === 40) {
					index++;
					if(index == select.length) {
						index = select.length-1;
					}
				} else if(event.keyCode === 38) {
					index--;
					if(index < 0) {
						index = 0;
					}
				}
				break;
		}
		select[index].checked = true;
		scroll();
	}

}