/**
 * 2013.03.
 * easemask　light ver 0.0.1
 * Author : Heonwongeun
 * FaceBook : https://www.facebook.com/heo.wongeun
 */

// $(id,class).clipmask({width:,height:,left:,top:});

(function(){
    jQuery.fn.clipmask = function(rect){
        var $this   = this,
            config  = {
                left    : null, 
                right   : null,
                top     : null, 
                bottom  : null,
                width   : null, 
                height  : null
            },
            s       = { width : $this.width(), height: $this.height()},
            c       = {}

        $.extend(config,rect);

        function init(){
            // var config = $this.clipmaskRect;

            if(rect.left && config.right)config.right   = null;
            if(rect.right && config.left)config.left    = null;
            if(rect.top && config.bottom)config.bottom  = null;
            if(rect.bottom && config.top)config.top     = null;
            
            sizeUnitChange(config);

            if(config.right)config.right = s.width - (config.width + config.right);
            if(config.bottom)config.bottom = s.height - (config.height + config.bottom);
            if(config.left && config.right || config.top && config.bottom)return;
            c.width     = config.width;
            c.height    = config.height;
            c.x         = config.left?config.left:config.right;
            c.y         = config.top?config.top:config.bottom;
            maskApply(changeRect(c));
        }

        function sizeUnitChange(config){
            for(var o in config){
                var value = config[o];
                if(typeof value == "string"){
                    if(value.indexOf("px") > -1){
                        value = Number(value.replace("px",""));
                    }else if(value.indexOf("%") > -1){
                        value = Number(value.replace("%",""));
                        if(o == "left" || o == "right" || o == "width"){
                            value = (s.width * value)*0.01;
                        }else if( o == "top" || o == "bottom" || o == "height"){
                            value = (s.height * value)*0.01;
                        }
                    }
                    config[o] = Number(value);
                }
            }
        }

        function changeRect(info){
            return "rect("+
                    (info.y) +"px "+ 
                    (info.x+info.width)  +"px "+
                    (info.y+info.height) +"px "+
                    (info.x) +"px)";
        }

        function maskApply(rect){
            $this.css({"clip" : rect});
        }
        
        init();
        return this;
    }
}).call(jQuery)