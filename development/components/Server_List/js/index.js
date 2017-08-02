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


		if($.browser.msie&&parseInt($.browser.version,10)==6){
				var $this=$(__(".server-list")).find(__(".active"));
				$this.find(__(".detail")).height($this.find(__(".img")).height()+5)
		}
        $(__(".server-list")).on("mouseenter","li",function(){
			var $this=$(this)
           $this.addClass(__("active")).siblings().removeClass(__("active"));
			if($.browser.msie&&parseInt($.browser.version,10)==6){
				$this.find(__(".detail")).height($this.find(__(".img")).height()+5)
			}
        });
    }
});

