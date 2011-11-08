    var timer = $('#clock_timer'),
        spinners = {},
        comp, step,// max,
        duration = 200,
        date_parts = timer.attr('datetime').split(':'),
        spinner_html = '<ul>' +
                            '<li>9</li>' +
                            '<li>0</li>' +
                            '<li>1</li>' +
                            '<li>2</li>' +
                            '<li>3</li>' +
                            '<li>4</li>' +
                            '<li>5</li>' +
                            '<li>6</li>' +
                            '<li>7</li>' +
                            '<li>8</li>' +
                            '<li>9</li>' +
                        '</ul>';

    var updateStructure = function() {
        var wrap = timer.parent(),
            frag = timer.detach(),
            segments = {
                days: timer.find('.days'),
                hours: timer.find('.hours'),
                minutes: timer.find('.minutes'),
                seconds: timer.find('.seconds')
            };
        
        $.each(segments, function(key, el) {
            el.html(spinner_html+spinner_html);
            spinners[key] = segments[key].find('ul');
            spinners[key].eq(1).addClass('second');
        });

        wrap.append(timer);
        
        comp = parseInt(spinners.days.eq(0).css('top'), 10);
        step = spinners.days.find('li').eq(0).height();
        
        //max = spinners.days.eq(0).height() - step;
        
        $.each(spinners, function(key, el) {
            //setSpinner()
        });
    }();

    var setSpinner = function(seg, vals) {
        var l = seg.length,
            i = 0,
            next;

        for (; i < l; i++) {
            next =  -(step * vals[i]) + comp;
            
            seg.eq(i).animate({
                top: next
            }, duration);
        }
    };
