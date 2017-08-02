/**
 * Created by lijiaxin on 2017/6/26.
 */
define(["SQ"], function($) {
    // 这个模块仅仅返回一个待执行函数
    return function(rootId) {
        // 预先定义好的函数，用来给 class 或 id 加上前缀
        function __(selector) {
            if (!rootId) {
                return selector;
            }
            if (selector.indexOf(".") < 0 && selector.indexOf("#") < 0) {
                return $.map(selector.split(" "), function(clsOrId) {
                    return rootId + clsOrId;
                }).join(" ");
            }
            return selector.replace(/(\.|#)/g, function(matched, p1) {
                return p1 + rootId;
            });
        }
        // 从这里开始写你的代码
        var n = 700,
            t = null;
        var $itemContainer=$(__(".item-container"));
        var $boxVideo=$(__(".item-box-video"));
        var $img=$(__(".item-box-img"));
        var iImgWidth=$img.width();
        var iContainerWidth=$(__(".wrapper-video-banner")).width();
        $itemContainer.find("video").attr("width",$boxVideo.width()).attr("height",$boxVideo.height());
        $itemContainer.hover(function () {
                var r = $(this),
                    u = r.attr("data-index") * iImgWidth,
                    e = parseInt(r.css("margin-left"));
                r.stop().animate({
                        width : iContainerWidth
                    }, n, t);
                r.parent().stop().animate({
                        "margin-left" : -u
                    },
                    n, t)
            },
            function () {
                var r = $(this);
                r.parent().stop().animate({
                        "margin-left" : 0
                    },n, t);
                r.stop().animate({
                        width : iImgWidth
                    },
                    n, t);
            });
        $itemContainer.find("video").on("canplay",function(){
            $(this).show().trigger("play").siblings().hide();
        });
        $itemContainer.on("mouseover",function(){
            var $this=$(this);
            var $video=$this.find("video");
            if($this.data("req")){
                return
            }
            $video.data("req",true);
            $video.attr("src",$video.attr("data-src"));
        });

		
    }
});

