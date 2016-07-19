/*
 * 非遗详情
 */
var Magnifier = (function($){
	var _msg = {};
	var _doScroll = function(e){
//		console.log('x坐标为：'+e.pageX+'y坐标为：'+e.pageY);
		// var coordinate = {
		// 	'needLeastx':803,
		// 	'needLeasty':150,
		// 	'currentx':e.pageX,
		// 	'currenty':e.pageY
		// 	'needMostx':803+showImg.width
		// 	'needMosty':150+showImg.height
		// };
		var coordinate = [_msg.showImgBound.left + _msg.scrollLeft,
						  _msg.showImgBound.top  + _msg.scrollTop,
						  e.pageX,
						  e.pageY,
						  _msg.showImgBound.right  + _msg.scrollLeft,
						  _msg.showImgBound.bottom + _msg.scrollTop
						 ];
//		console.log(coordinate);
		if( coordinate[3] >= coordinate[1] &&
			coordinate[3] <= coordinate[5] &&
			coordinate[2] >= coordinate[0] &&
			coordinate[2] <= coordinate[4]
			){
			_showMagnifier(coordinate);
			coordinate=null;
		}
		else{
			_hideMagnifier();
		}
	}
	var _hideMagnifier = function(){
		_msg.magnifier.hide();
	}
	var _showMagnifier = function(coordinate){
		_msg.magnifier.show();
		_msg.magnifier.css({
			'top' :coordinate[3]-_msg.wrapHeight/2+'px',
			'left':coordinate[2]-_msg.wrapHeight/2+'px'
		});
		_msg.magnifier_img.css({
			'top':-(coordinate[3]-coordinate[1]-_msg.wrapHeight/3.2)*_msg.scale+'px',
			'left':-(coordinate[2]-coordinate[0]-_msg.wrapWidht/3.2)*_msg.scale+'px'
		});

	}
	var _bindMouse = function(){
		_msg.showImg.on('mousemove',function(e){
			_doScroll(e);
		});
		_msg.magnifier.on('mousemove',function(e){
			_doScroll(e);
		});
	}
	var _UnBindMouse = function(){
		_msg.showImg.off();
		_msg.magnifier.off();
	}
	var init = function(showImg,magnifier){
		if(arguments.length == 2){
			_msg = {
			'showImg': showImg,
			'magnifier':magnifier,
			'magnifier_img': magnifier.children('img'),
			'wrapHeight'   : magnifier.height(),
			'wrapWidht'    : magnifier.width(),
 			'showImgBound' : showImg[0].getBoundingClientRect(),
 			'scale'		   : 1,
 			'scrollLeft'   : Math.max(document.documentElement.scrollLeft,  
　　                             document.body.scrollLeft),  
            'scrollTop'    : Math.max(document.documentElement.scrollTop,  
　　                             document.body.scrollTop) 
			}
			$(window).on('resize',function(){
				_msg.showImgBound = showImg[0].getBoundingClientRect();
			})
			_bindMouse();
		}
		
	};
	var _checkUrl = function(){
		var url = window.location.hash;
		_msg.location = url? parseInt(url.replace(/#/,'')): url;
	}
	var _windowLoad = function(){
		_checkUrl();
		if(_msg.location !== undefined){
			_changeStatus(_msg.location);
			_changeStepSmallImg();
			_changeStepBigImg();
			_changeText();
		}
	}
	var addClick = function(obj){
		_msg.big           = [obj.leftarrow,obj.rightarrow];
		_msg.small         = [obj.smallleft,obj.smallright];
		_msg.ul            = obj.her_img_ul;
		_msg.liImgs        = obj.li_imgs;
		_msg.activeClass   = obj.activeClass;
		_msg.oneColNum     = obj.oneColNum;
		_msg.oneColLength  = obj.oneColLength;
		_msg.bigImg        = obj.bigImg; 
		_msg.magnifierImg  = obj.magnifierImg;
		_msg.scale         = obj.scale;
		_msg.text          = obj.text;
		_msg.textContainer = obj.textContainer;
		if(obj.audio){
			_msg.audio = obj.audio;
		}
		_msg.big[0].on('click',function(e){_doBigLeft(e)});
		_msg.big[1].on('click',function(e){_doBigRight(e)});
		_msg.small[0].on('click',function(e){_doSmallLeft(e)});
		_msg.small[1].on('click',function(e){_doSmallRight(e)});
		_msg.ul.on('click',function(e){_doUl(e)});
		_windowLoad();
	}
	var _doUl = function(e){
		var ele = e.target.nodeName=='IMG'? $(e.target).parent():$(e.target);
		var currentCount = ele.data('count');
//		console.log(currentCount);
		if(_changeStatus(currentCount)){
			_changeStepSmallImg();
			_changeStepBigImg();
			_changeText();
			
		}
	}
	var _doSmallLeft = function(e){
		if(_changeStatus(false)){
			_changeStepSmallImg(false);
			_changeStepBigImg();
			_changeText();
		}
	}
	var _doSmallRight = function(e){
		if(_changeStatus(true)){
			_changeStepSmallImg(true);
			_changeStepBigImg();
			_changeText();
		}
	}
	var _doBigLeft = function(e){
		if(_changeStatus(false)){
			_changeStepSmallImg(false);
			_changeStepBigImg();
			_changeText();
		}
	}
	var _doBigRight = function(e){
		if(_changeStatus(true)){
			_changeStepSmallImg(true);
			_changeStepBigImg();
			_changeText();
		}
	}
	//传false代表往左移,传true代表往右移
	var _changeStatus = function(flag){
		
		_msg.lastLi = _msg.liImgs.filter('.'+_msg.activeClass);
		_msg.lastCount = _msg.lastLi.data('count');
		var flag2 = _changeCurrentEle(flag,_msg.lastCount);
		_changeUrl();
		return flag2;
		
	}
	var _changeCurrentEle = function(flag,lastCount){
		var flag2 = false;
		if(typeof flag == 'number'){
			if(flag == 6){
				_msg.audio.attr('src','../music/heritage.mp3');
			}
			_msg.currentCount = flag;
			_msg.nextLi = $(_msg.liImgs[_msg.currentCount]);
			flag2 = true;
		}
		else if(flag && lastCount<_msg.liImgs.length-1){
			_msg.currentCount = _msg.lastCount+1;
			_msg.nextLi = $(_msg.liImgs[_msg.currentCount]);
			flag2 = true;
		}else if(!flag && lastCount>0 ){
			_msg.currentCount = _msg.lastCount-1; 	
			_msg.nextLi = $(_msg.liImgs[_msg.currentCount]);
			flag2 = true;
		}
		return flag2;
	}
	var _changeText = function(){
		var data = _msg.nextLi.data('count');
		_msg.textContainer.title.text(_msg.text[data].title);
		_msg.textContainer.content.text(_msg.text[data].content);
	}
	var _changeUrl = function(){
		var data = _msg.nextLi.data('count');
		if(data != _msg.location){
			window.history.replaceState(null,null,'\#'+data);
//			console.log(window.location.hash);
			_msg.location = parseInt(window.location.hash.replace(/#/,''));
//			console.log(_msg.location);	
		}
		
	}
	
	var _getUrl = function(){
		return $(_msg.liImgs[_msg.currentCount]).children().attr('src');
	}
	var _resizeImg = function(img1,img2,scale){
		var height = img1.height();
		var width = img1.width();
		img2.css({
			'height': height*scale+'px',
			'width' : width*scale+'px'
		});
	};
	var _changeStepBigImg = function(){
		var src = _getUrl();
		_msg.bigImg.attr('src',src);
		_msg.magnifierImg.attr('src',src);
		_resizeImg(_msg.bigImg,_msg.magnifierImg,_msg.scale);
	}
	var _changeStepSmallImg = function(flag){
		var currentRate    = Math.floor((_msg.currentCount) / 7),
			lastRate = Math.floor((_msg.lastCount) / 7),
			diff = currentRate - lastRate;
		if(_isEnd(flag)){
			console.log('该换一页了');
			var lefv = parseInt(_msg.ul.css('left'));
			if(flag){
				_msg.ul.animate({
						left:lefv-_msg.oneColLength+'px'
				},500);
			}else{
				_msg.ul.animate({
						left:lefv+_msg.oneColLength+'px'
				},500);
			}
		}
		else if(diff > 0){
			var lefv = parseInt(_msg.ul.css('left'));
			_msg.ul.css("left",lefv-_msg.oneColLength*currentRate+'px')
		}
		
		_msg.lastLi.removeClass(_msg.activeClass);
		_msg.nextLi.addClass(_msg.activeClass);
	}
	var _isEnd = function(flag){
		if(flag === true && _msg.lastCount !== 0){
			var lastCount = _msg.lastCount+1;
			return lastCount%_msg.oneColNum == 0? true:false;
		}else if(flag === false){
			var count = _msg.oneColNum;
			return _msg.lastCount%count == 0? true:false;
		}else{
			return false;
		}
	}
	return {
		'init':init,
		'addClick':addClick
	}
})(jQuery);
