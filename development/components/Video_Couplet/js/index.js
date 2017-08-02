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
        var $video= $(__(".video"));
        var $img= $(__(".img"));
        var bLazyLoad=$video.data("lazyload");
		var $videoContainer=$(__(".wrapper-video"));
        function loadVideo(){
            $video.attr("src",$video.data("src"));
        }
        if($video.length){
            $video.on("canplay",function(){
                $img.hide();
                $video.show();
                $video.trigger("play");
            });
            if(bLazyLoad){
                $video.parent().on("mouseover",function(){
                    loadVideo();
                    $video.parent().off("mouseover")
                });
            }else{
                loadVideo();
            }
        }

		if($.browser.msie&&parseInt($.browser.version,10)==6){
			if($videoContainer.hasClass(__("fixed-left"))){
				$videoContainer.css("left",-$videoContainer.width())
			}else if($videoContainer.hasClass(__("fixed-right"))){
				$videoContainer.css("right",-$videoContainer.width())
			}else if($videoContainer.hasClass(__("fixed-br"))){
				$videoContainer.css("right",-$videoContainer.width());
			}
		}
    }
});

