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

		var $videoWrapper=$(__(".wrapper-img-video"));
		var $video=$videoWrapper.find("video");
		var $img=$videoWrapper.find("img");
		 
        $videoWrapper.mouseenter(function(){
            if(!$video.data("loaded")){
                $video.attr("src",$video.data("src"));
                $video.data("loaded",true);
                $video.on("canplay",function(){
					$video.show();
					$img.hide();
                   $video.on("play",function(){
					   $video.show();
						$img.hide();
				   }).on("pause",function(){
					    $video.hide();
					 $img.show();
				   })
                })
            }
            $video.trigger("play");
        }).mouseleave(function(){
            $video.trigger("pause");
        });
    }
});

