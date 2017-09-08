window.onload = function() {
	var $ = function(e) {
		if(document.querySelectorAll(e).length === 1) {
			return document.querySelector(e);
		} else {
			return document.querySelectorAll(e);
		}
	};


	// 不同浏览器兼容
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

	// 自定义事件
	function EventTarget() {
		this.handlers = {};
	}

	EventTarget.prototype = {
		constructor: EventTarget,
		
		on: function(type, handler) {
			if(typeof this.handlers[type] == "undefined") {
				this.handlers[type] = [];
			}
			this.handlers[type].push(handler);
			return this;
		},

		fire: function(event) {
			if(!event.target) {
				event.target = this;
			}
			if(this.handlers[event.type] instanceof Array) {
				var handlers = this.handlers[event.type];
				for(var i=0, len=handlers.length;i<len;i++) {
					handlers[i](event);
				}
			}
			return this;
		},
		cancel: function(type, handler) {
			if(this.handlers[type] instanceof Array) {
				var handlers = this.handlers[type];
				for(var i=0,len=handlers.length;i<len;i++) {
					if(handlers[i] === handler) {
						break;
					}
				}
				handlers.splice(i,1);
			}
		}
	};


	// on 和 leave事件处理函数
	var EventHandler = {
		loadHandler: function(event) {
			switch(event.index) {
				case 1:
					var title = $(".banner h1");
					var p = $(".banner p");
					title.style.transform = "translateX(0px)";
					title.style.opacity = 1;
					p.style.transform = "translateX(0px)";
					p.style.opacity = 1;
					title.style.transition = "all .5s ease-in-out .5s";
					p.style.transition = "all .5s ease-in-out .5s";
				case 4:
					var bar = $(".bar-item_bar");
					var tootip = $(".bar-item_tooltip");
					for(var i=0, len = bar.length;i<len;i++) {
						bar[i].style.width = bar[i].dataset.value + "%";
						tootip[i].innerHTML = bar[i].dataset.value + "%";
						tootip[i].style.right = (100 - bar[i].dataset.value + 3) +"%";
						tootip[i].style.opacity = 1;
						bar[i].style.transition = "all .5s ease-in-out .5s";
						tootip[i].style.transition = "all .5s ease-in-out 1s";
					}
					break;
			}
			// console.log("page "+event.index+" load");
		},

		leaveHandler: function(event) {
			switch(event.index){
				case 1:
					var title = $(".banner h1");
					var p = $(".banner p");
					title.style.transform = "translateX(-300px)";
					title.style.opacity = 0;
					p.style.transform = "translateX(300px)";
					p.style.opacity = 0;
					title.style.transition = "all .5s ease-in-out";
					p.style.transition = "all .5s ease-in-out";
				case 4:
					var bar = $(".bar-item_bar");
					var tootip = $(".bar-item_tooltip");
					for(var i=0, len = bar.length;i<len;i++) {
						bar[i].style.width = "0%";
						tootip[i].style.right = 0;
						tootip[i].style.opacity = 0;
						bar[i].style.transition = "all .5s ease-in-out";
						tootip[i].style.transition = "all .5s ease-in-out"
					}
			}
			// console.log("page "+event.index+" leave");
		}
	};


	var more = $(".more"); //首页more按钮
	
	var select = $('#nav input'); //导航点
	var content = $('#content'); //所有内容
	
	var target = new EventTarget();


	// 点击更多按钮时切换页面
	EventUtil.addHandler(more,'click', function(){
		select[1].checked = true;
		scroll();
	});

	// 点击导航点时切换页面
	EventUtil.addHandler($("#nav"), 'click', scroll);

	// 滚动鼠标时切换页面
	if(isScroll) {
		target.on("load", EventHandler.loadHandler).fire({type:"load", index: 1}).cancel("load", EventHandler.loadHandler);
		EventUtil.addHandler(document, "mousewheel", slideByMouseAndKey);
		EventUtil.addHandler(document, "keyup", slideByMouseAndKey);
	}


	// 页面切换函数
	function scroll() {
		var top = parseInt(content.style.top) || 0;
		var index = top/(-100);
		var curIndex = 0;
		for(var i=0, len=select.length;i<len;i++) {
			if(select[i].checked) {
				content.style.top = (-100*i) + "%";
				curIndex = i;
			}
		}

		// 添加load和leave事件
		if(curIndex != index) {
			target.on("load", EventHandler.loadHandler).fire({type:"load", index: (curIndex+1)}).cancel("load", EventHandler.loadHandler);
			target.on("leave", EventHandler.leaveHandler).fire({type:"leave", index: (index+1)}).cancel("leave", EventHandler.leaveHandler);
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

	// 通过鼠标滚轮或键盘按键切换页面方法
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