Timer = {
    spinners: {},
    duration: 200,
    
    parseTimeStamp: function(ts) {

        return {
            days: [0, 1],
            hours: [1, 4],
            minutes: [2, 2],
            seconds: [1, 6]
        };
    },
    
    setFragment: function(el, val) {
        var curr = el.data('curr'),
            leap = (val < curr),
            next = -(step * (val + (leap ? 10 : 0))) + comp;
            
        if (val === curr) {
            return;
        }

        el.animate({
            top: next
        }, Timer.duration, leap ? function() {
            this.style.top = (-(step * val) + comp) + 'px';
        } : undefined);

        el.data('curr', val)
    },
    
    setSpinner: function(seg, vals) {
        var l = seg.length,
            i = 0;

        for (; i < l; i++) {
            Timer.setFragment(seg.eq(i), vals[i]);
        }
    },
    
    startCountdown: function() {
        Timer.timestamp--;
        Timer.time = Timer.parseTimeStamp(Timer.timestamp);
        $.each(Timer.spinners, function(key, el) {
            Timer.setSpinner(el, Timer.time[key])
        });
        setTimeout(Timer.startCountdown, 1000);
    }
};
    
Timer.init = function() {
    var timer = $('#clock_timer'),
        wrap = timer.parent(),
        frag = timer.detach(),
        segments = {
            days: timer.find('.days'),
            hours: timer.find('.hours'),
            minutes: timer.find('.minutes'),
            seconds: timer.find('.seconds')
        },
        spinner_html = '<ul><li>9</li>';

    for (var x = 0; x < 2; x++) {
        for (var y = 0; y < 10; y++) {
            spinner_html += '<li>' + y + '</li>'
        }
    }
    spinner_html += '</ul>';
    
    Timer.timestamp = timer.data('est');
    Timer.time = Timer.parseTimeStamp(Timer.timestamp);

    $.each(segments, function(key, el) {
        el.html(spinner_html + spinner_html);
        Timer.spinners[key] = segments[key].find('ul');
        Timer.spinners[key].eq(1).addClass('second');
        Timer.spinners[key].data('curr', 0);
    });

    wrap.append(timer);
    
    comp = parseInt(Timer.spinners.days.eq(0).css('top'), 10);
    step = Timer.spinners.days.find('li').eq(0).height();
    
    $.each(Timer.spinners, function(key, el) {
        Timer.setSpinner(el, Timer.time[key])
    });
    
    Timer.startCountdown();
}();


