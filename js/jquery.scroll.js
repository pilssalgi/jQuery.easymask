/**
 */
(function () {
    var _bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
    var getPagePos = function(e){
        var pos, touch;
        pos = {x:0, y:0};
        if("ontouchstart" in window) {
            if (e.touches != null) {
                touch = e.touches[0];
            } else {
                touch = e.originalEvent.touches[0];
            }
            pos.x = touch.clientX;
            pos.y = touch.clientY;
        } else {
            pos.x = e.clientX;
            pos.y = e.clientY;
        }
        return pos;
    }
    /* *********************************************************
    *  Constructor 
    ********************************************************** */

    function Scroll(option){
        this.config     = {
            acc     : 0.1,
            speed   : 0.94,
            touchAcc : 5,
            type    : "wheel",
            step    : function(){}
        }

        $.extend(this.config,option);

        this.offset     = 0;
        this.timer      = null;

        
        this.onRender       = _bind(this.onRender,this);
        

        //wheelEvent
        this.onWheel = _bind(this.onWheel,this);
        $(document).bind("mousewheel", this.onWheel);

        //touchEvent
        this.onTouchStart   = _bind(this.onTouchStart,this);
        this.onTouchMove    = _bind(this.onTouchMove,this);
        this.onTouchEnd     = _bind(this.onTouchEnd,this);

        $(document).bind("touchstart", this.onTouchStart);
        $(document).bind("touchmove", this.onTouchMove);
        $(document).bind("touchend", this.onTouchEnd);
    };

    Scroll.prototype.constructor = Scroll;
    Scroll.prototype.init = function(){

    }


    /* *********************************************************
    *  SCROLL EVENT 
    ********************************************************** */
    Scroll.prototype.EVENT_TOUCHSTART       = "touch_start";
    Scroll.prototype.EVENT_TOUCHEND         = "touch_end";

    Scroll.prototype.EVENT_SCROLLSTART      = "scroll_start";
    Scroll.prototype.EVENT_SCROLLAFTER      = "scroll_after";
    /* *********************************************************
    *  Event Handler
    ********************************************************** */
    
    Scroll.prototype.onTouchStart = function(e){
        $(this).trigger(this.EVENT_TOUCHSTART);
        e.preventDefault();
        this.touchMoveOffset    = 0;
        this.isTouch            = true;
        this.t_startP           = this.getTouchInfo(e);
        this.startRender();
    }

    Scroll.prototype.onTouchMove = function(e){
        e.preventDefault();
        this.offset     = 0;
        this.t_moveP    = this.getTouchInfo(e);
        this.touchMoveOffset = this.t_startP.y - this.t_moveP.y
    }

    Scroll.prototype.onTouchEnd = function(e){
        this.isTouch = false;
        this.t_moveP.time = new Date().getTime();

        var speed = (this.touchMoveOffset)/(this.t_startP.time - this.t_moveP.time);
        this.offset = -this.config.touchAcc*speed;

        this.scrollTimerStart();
    }


    Scroll.prototype.getTouchInfo = function(e){
        if(!this.time)this.time = new Date();
        var info = { x : 0 , y : 0 , time: new Date().getTime()};
        $.extend(info,getPagePos(e));
        return info;
    }


    Scroll.prototype.onWheel = function(event, delta, deltaX, deltaY){
        if(delta > 0){
            this.offset += this.config.acc;
        }else if(delta < 0){
            this.offset -= this.config.acc;
        }

        this.scrollTimerStart();
        this.startRender();
    }

    Scroll.prototype.scrollTimerStart = function(){
        var scope = this;
        if(this.scrollTimer){
            this.event_dispatch(this.EVENT_SCROLLSTART);
            clearInterval(this.scrollTimer);
        }

        this.scrollTimer = setInterval(function(){
            scope.event_dispatch(scope.EVENT_SCROLLAFTER);
            scope.stopRender();
            clearInterval(scope.scrollTimer);
        },5000)
    }

    Scroll.prototype.event_dispatch = function(event){
        $(this).trigger(event);
    }
    /* *********************************************************
    *  Rendering
    ********************************************************** */
    

    Scroll.prototype.startRender = function(){
        if(!this.timer){
            this.timer = setInterval(this.onRender,1000/30);
        }
    }

    Scroll.prototype.stopRender = function(){
        if(this.timer){
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    Scroll.prototype.onRender = function(){
        this.offset *= this.config.speed;
        this.config.step();
        console.log("rendering")
    }

    this.Scroll = Scroll;
}).apply(window);