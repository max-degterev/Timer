    var timer = $('#clock_timer'),
        spinners = {},
        comp, step,
        duration = 200,
        estimated = timer.data('est');

    var setSpinner = function(seg, val) {
        
    };
    
    var getEstTime = function(est) {
        var fracs = [
                (24 * 60 * 60 * 1000),
                (60 * 60 * 1000),
                (60 * 1000),
                (1000)
            ],
            res = [],
            i = 0,
            l = fracs.length;
        
        for (; i < l; i++) {
            if (i > 0) {
                est = est - fracs[i - 1];
            }
            
            res.push(est / fracs[i]);
        }
        
        $.map(res, function(val, i) {
            return (val | 0);
        });
        
        return res;
    };
                        
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
            el.html();
            spinners[key] = segments[key].find('ul');
            spinners[key].eq(1).addClass('second');
        });

        wrap.append(timer);
        
        comp = parseInt(spinners.days.eq(0).css('top'), 10);
        step = spinners.days.find('li').eq(0).height();
        
        //max = spinners.days.eq(0).height() - step;
        
        $.each(spinners, function(key, el) {
            setSpinner()
        });
    };


