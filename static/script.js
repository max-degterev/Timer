Timer = {
    spinners: {},
    duration: 200,
    
    parseTimeStamp: function(ts) {
        var est = (est / 1000) << 0, res = {};

        var units = {
            second  : 1,
            minute  : 60,
            hour    : 60 * 60,
            day     : 60 * 60 * 24
        };

        var storage = {
            seconds : 0,
            minutes : 0,
            hours   : 0,
            days    : 0
        };

        var conv = function (n) {
            if (n < 10) {
                return [0, n];
            } else {
                return $.map(n.toString().split(''), function (e) {return +e});
            }
        };

        var computed = $.map(['day', 'hour', 'minute', 'second'], function (x) {
            var xs = x + 's', h = {};

            while ((est - units[x]) > 0) {
                storage[xs]++;
                est -= units[x];
            }

            h[xs] = storage[xs];
            return h;
        });

        $.each(computed, function (i, obj) {
            $.extend(res, obj) ;
        });

        return res;
    },
    
    setFragment: function(el, val) {
        var curr = el.data('curr'),
            leap = (val < curr),
            next = -(step * (val + (leap ? 10 : 0))) + comp;
            
        if (val === curr) { // LOLWTF!
            return;
        }

        el.animate({
            top: next
        }, Timer.duration, leap ? function() {
            this.style.top = (-(step * val) + comp) + 'px';
        } : undefined).data('curr', val);
    },
    
    setSpinner: function(seg, vals) {
        var i = 0,
            l = seg.length;

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
        x = 0,
        y = 0,
        segments = {
            days: timer.find('.days'),
            hours: timer.find('.hours'),
            minutes: timer.find('.minutes'),
            seconds: timer.find('.seconds')
        },
        spinner_html = '<ul><li>9</li>';

    for (; x < 2; x++) {
        for (; y < 10; y++) {
            spinner_html += '<li>' + y + '</li>'
        }
    }
    spinner_html += '</ul>';

    // Set initial values
    Timer.timestamp = timer.data('est');
    Timer.time = Timer.parseTimeStamp(Timer.timestamp);

    // Create spinners
    timer.detach();
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


