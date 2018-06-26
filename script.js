// ready
(function($) {
    $(function() {

        var Speed = 300;

        var TemplateOnePage,
            alltime = 0, readytime = 0;

        //var parse = JSON.stringify(Info);

        // считалка процентов
        function Procent(num1, num2){
            //return parseInt(num1/num2*100);
            return Math.ceil(num1/num2*100);
            //return Math.round(num1/num2*100);
        }

        // главный шаблон
        var Template = function(){/*
			<div class="main">
				<div class="header"></div>
				<div class="list"></div>
			</div>
		*/}.toString().slice(14,-3);

        $("body").prepend(Template);

        var lineWidth;
        if(Info.list.length > 7){
            lineWidth = Math.ceil(Info.list.length/7);
        } else {
            lineWidth = 1;
        }


        function Alltime(){
            if(!Info.list) return false;
            $.each(Info.list,function(k,v){
                alltime = alltime + v.time;
                if(v.ok){
                    readytime = readytime + v.time;
                } else {
                    readytime = readytime + v.ready;
                }
            })
        }Alltime();


        // список страниц
        function onePage(name, link, time, ready, ok){
            if(!name || !time) return false;
            if(!ready) ready = 0;

            if(ok){class_page = "true";} else {class_page = "";}
            if(Procent(ready,alltime) > Procent(time, alltime)){class_page = class_page+ " danger";}

            if(!link){
                name = name;
            } else {
                name = '<a href="'+link+'" target="_blank">'+name+'</a>';
            }


            if(link){

                screen = link.split('.html');

                if(window.location.hostname){

                    screenLink = '';

                    $.ajax(screen[0] + ".jpg",{
                        success: function(){

                            console.log(screen[0] + ".jpg" + " ###success" + link);
                            //return true;
                            screenLink = '<a href="'+screen[0]+'.jpg">&#128247;</a>';
                        },
                        error: function(){

                            console.log(screen[0] + ".jpg" +" ###error" + link);
                            //return false;
                            screenLink = '';
                        },
                        method: "POST"
                    });


                } else {
                    // на локалочке не проверяем наличии скринов
                    screenLink = '<a href="'+screen[0]+'.jpg">&#128247;</a>';
                }

            } else {
                screenLink = '';
            }


            TemplateOnePage =
                '<div class="one-page '+class_page+'">' +
                '<span class="name">'+name+'</span> ' +
                '<span class="ready-text">'+ready+' / '+time+' ('+Procent(ready, time)+'%)</span>' +
                '<span class="screen">'+screenLink+'</span>'+
                '<div class="time w' + Procent(time, alltime)*lineWidth + '"></div>' +
                '<div class="ready w' + Procent(ready,alltime)*lineWidth + '"></div>' +
                '</div>';

            $(".list").append(TemplateOnePage);

        }


        // перебираем список страниц
        function list(listInfo){

            if(!listInfo) return false;

            $.each(listInfo,function(k,v){
                onePage(v.name, v.link, v.time, v.ready, v.ok);
            })

        }

        // часы в дни
        function allTimeInfo(time){

            var decCache = [],
                decCases = [2, 0, 1, 1, 1, 2];
            function decOfNum(number, titles){
                if(!decCache[number]) decCache[number] = number % 100 > 4 && number % 100 < 20 ? 2 : decCases[Math.min(number % 10, 5)];
                return titles[decCache[number]];
            }

            var dn = 0,
                ch = 0;
            for (var i = 8; i <= time; i = i+8){
                dn ++;
            }

            if(time > dn*8){
                ch = time-(dn*8);
            }

            if(dn > 0){
                dn = dn + " " + decOfNum(dn, ['день', 'дня', 'дней']);
            } else {
                dn = "";
            }

            if(ch > 0){
                ch = ch + " " + decOfNum(ch, ['час', 'часа', 'часов']);
            } else {
                ch = "";
            }

            if(dn != 0 || ch != 0) {
                return "Осталось &asymp; " +dn+" " + ch;
            } else {
                return "☯ Разработка: Сергей Пашнин, sspashnin@mail.ru ☯";
            }

        }


        // вывод

        list(Info.list);
        /*
        $(".info")
            .html(readytime + " / " + alltime)
            .append('<div class="time w'+ Procent(readytime,alltime) +'" />');
        */
        $(".header")
            .html("<span>" + Info.name + " - " + readytime + " / " + alltime + " (" + Procent(readytime,alltime) + "%)</span><font> " + allTimeInfo(alltime-readytime) + "</font>")
            .append('<div class="ready w'+ Procent(readytime,alltime) +'" />');

        // title
        $("title").text(Info.name + " - готово " + Procent(readytime,alltime) + "%");

        setTimeout(function(){
            $("body").addClass("page-ok");
        }, 50);

    });
})(jQuery);