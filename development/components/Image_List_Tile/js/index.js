/**
 * Created by ljx on 2017/6/26.
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

        var strategyUrl="http://ss2.a.he2d.com/mm9y86";
        var planIds=[];
        $(__(".link")).each(function(){
            var $this=$(this);
            var planId=$this.data("planId");
            planId&&planIds.push(planId);
        });

        function renderPlan($el,planObj){
            if(!$el.length){
                return;
            }
            var click_url=planObj.click_url;
            if(param){
                click_url = click_url.indexOf( "?" ) > -1 ?(click_url + "&" + param ):(click_url + "?" + param);
            }
            $el.attr("href",click_url).attr("data-track",planObj.tracking);
            $el.find(__(".img")).attr("src",planObj.banner.img);
        }

        planIds.length&&$.ajax({
            url:strategyUrl,
            data:{
                cids:planIds.join(',')
            },
            type:"GET",
            dataType:"JSONP"
        }).done(function(oRep){
            if(oRep.code==1){
                var oData=oRep.data;
                for(var key in oData){
                    if(oData.hasOwnProperty(key)){
                        renderPlan($(__("#box-plan-"+key)),oData[key])
                    }
                }
            }
        }).fail(function(){

        })
    }
});

