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
    
    var setFragment = function(el, val) {
        var curr = el.data('curr'),
            leap = (val < curr),
            next = -(step * (val + (leap ? 10 : 0))) + comp;
            
        if (val === curr) {
            return;
        }

        el.animate({
            top: next
        }, duration, leap ? function() {
            this.style.top = (-(step * val) + comp) + 'px';
        } : undefined);

        el.data('curr', val)
    };
    
    var setSpinner = function(seg, vals) {
        var l = seg.length,
            i = 0;

        for (; i < l; i++) {
            setFragment(seg.eq(i), vals[i]);
        }
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
            el.html(spinner_html+spinner_html);
            spinners[key] = segments[key].find('ul');
            spinners[key].eq(1).addClass('second');
            spinners[key].data('curr', 0);
        });

        wrap.append(timer);
        
        comp = parseInt(spinners.days.eq(0).css('top'), 10);
        step = spinners.days.find('li').eq(0).height();
        
        //max = spinners.days.eq(0).height() - step;
        
        $.each(spinners, function(key, el) {
            //setSpinner()
        });
    }();


