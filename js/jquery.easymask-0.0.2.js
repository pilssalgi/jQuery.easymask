/**
 * 2013.03.
 * easemask ver 0.0.2
 * Author : Heonwongeun
 * FaceBook : https://www.facebook.com/heo.wongeun
 */

(function(){
	jQuery.fn.easymask = function(options,duration,complete){
		var config = {
			align 		: "L",
			x 			: undefined,
			y 			: undefined,
			width 		: 0,
			height 		: 0,
			delay		: 0,
			ease 		: "easeInOutQuint"
		},
		target   	= this,
		duration 	= typeof duration == "number"?duration:1000,
		complete 	= typeof complete == "function"?complete:null,
		c			= { x : 0, y : 0, w : 0, h : 0},
		s 			= { w : this.width(), h : this.height()};

		$.extend(config,options);
		function init(){
			config.width 	= sizeChange(config.width, s.w);
			config.height 	= sizeChange(config.height, s.h);

			if(typeof config.x != undefined)config.x = sizeChange(config.x, s.w);
			if(typeof config.y != undefined)config.y = sizeChange(config.y, s.h);

			// clipApply(c);

			if(typeof target.css("clip") != "undefined" &&  target.css("clip") != "auto"){
				c = getPosition(target.css("clip"));
			}else{
				switch(config.align){
					case "L"	: c.w = 0; c.h = s.h; 				break;
					case "R"	: c.x = s.w, c.w = s.w; c.h = s.h; 	break;
					case "T"	: c.w = s.w; c.h = 0; 				break;
					case "B"	: c.y = s.h; c.w = s.w; c.h = s.h; 	break;
					case "LT"	: break;
					case "RT"	: c.x = s.w; c.w = s.w; c.w = s.w; 	break;
					case "LB"	: c.y = s.h; c.h = s.h; 			break;
					case "RB"	: c.x = s.w; c.y = s.h; c.w = s.w; c.h = s.h; break;
					case "C"	: c.x = s.w * 0.5; c.y = s.h * 0.5; break;
					case "V"	: c.y = s.h * 0.5; c.w = s.w; 		break;
					case "H"	: c.x = s.w * 0.5; c.w = 0; c.h = s.h; break;
				}
			}
			clipApply(getRect(c));
			start();
		}

		function start(){
			var o 	= {};
			$.extend(o,c);

			switch(config.align){
				case "L"	: o.x = 0; o.w = config.width; o.y = (s.h - config.height)*0.5, o.h = config.height; break;
				case "R"	: o.x = s.w - config.width;  o.w = s.w; o.y = (s.h - config.height)*0.5, o.h = config.height;  break;
				case "T"	: o.x = (s.w - config.width)*0.5; o.w = config.width; o.y =config.y; o.h = config.height;break;
				case "B"	: o.x = (s.w - config.width)*0.5; o.w = config.width; o.y = s.h - config.height; o.h = s.h;break;
				case "LT"	: o.x = 0; o.y = 0; o.w = config.width; o.h = config.height; break;
				case "RT"	: o.x = s.w - config.width; o.w = s.w; 	o.h = config.height; o.y = 0; break;
				case "LB"	: o.x = 0; o.w = config.width; o.y = s.h - config.height; o.h = s.h; break;
				case "RB"	: o.x = s.w - config.width;  o.w = s.w; o.y = s.h - config.height; o.h = s.h; break;
				case "C"	: o.x = (s.w - config.width)*0.5; o.w = config.width; o.y = (s.h - config.height)*0.5, o.h = config.height; break;
				case "V"	: o.y = (s.h - config.height)*0.5, o.h = config.height; o.x = 0; o.w = s.w; break;
				case "H"	: o.x = (s.w - config.width)*0.5; o.w = config.width; o.y = 0; o.h = s.h; break;
			}

			if(config.x != undefined && config.y != undefined){
				switch(config.align){
					case "LT"	: o.x = config.x; o.w = config.width; o.y = config.y; o.h = config.height; break;
					case "RT"	: o.x = s.w - config.width - config.x; o.w = config.width; o.h = config.height; o.y = config.y; break;
					case "LB"	: o.x = config.x; o.w = config.width; o.y = o.y = s.h - config.height - config.y; o.h = config.height; break;
					case "RB"	: o.x = s.w - config.width - config.x; o.w = config.width; o.y = s.h - config.height - config.y; o.h = config.height; break;
					case "C"	: o.x = config.x - config.width * 0.5;  o.w = config.width;
								  o.y = config.y - config.height * 0.5; o.h = config.height;
								  break;
				}
			}

			// o.x = parseInt(o.x);
			// o.y = parseInt(o.y);
			// if(o.x == 0)o.x -= 1;
			// if(o.y == 0)o.x -= 1;
			// if(o.w == s.w)o.w += 1;
			// if(o.h == s.h)o.h += 1;
			// o.h = parseInt(o.h);

			
			// target.stop().clearQueue().delay(config.delay).animate( { "clip" : getRect(o) },duration, config.ease, function(){ });
			if(config.delay==0 && duration==0){
				$.extend(c,o);
				animation();
			}else{
				$(c).stop().clearQueue().delay(config.delay).animate( o, { step : animation, duration : duration, easing : config.ease, complete : function(){ animation(); if(complete)complete() } });
			}
		}

		function animation(){
			clipApply(getRect(c));
		}

		function clipApply(rect){
			target.css({"clip" : rect});
		}


		function sizeChange(value,originalsize){
			var num;
			if(typeof value == "string"){
				if(value.indexOf("px") > -1)num = Number(value.replace("px",""));
				if(value.indexOf("%") > -1){
					num = Number(value.replace("%",""));
					if(num > 100)num = 100;
					num *= originalsize/100
				}
			}
			if(typeof value == "number") num = value;
			return num;
		}

		function getRect(p){
			if(p.w > s.w)p.w = s.w;
			if(p.h > s.h)p.h = s.h;
			if(p.x < 0)p.x = 0;
			if(p.y < 0)p.y = 0;
			var rect = "rect("+
						(p.y) +"px "+ 
						(p.x+p.w)  +"px "+
						(p.y+p.h) +"px "+
						(p.x) +"px)";
			return rect;
		}

		function getPosition(rect){
			var newRect = rect.substring(5,rect.length-1),
				infos 	= newRect.split(" ");
			if(infos.length < 4)infos = newRect.split(",")
			for(var i=0; i<4; i++){
				infos[i] = infos[i].replace(",","");

			}

			var p = {
				w : Number(infos[1].replace("px","")),
				h : Number(infos[2].replace("px","")),
				x : Number(infos[3].replace("px","")),
				y : Number(infos[0].replace("px",""))
			}
			p.w -= p.x; p.h -= p.y;

			return p;
		}	
		init();
		return this;
	}
}).call(jQuery)

