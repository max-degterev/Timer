Timer = {
    spinners: [],
    duration: 200,
    
    parseTimeStamp: function(ts) {
        var divisors = [
            24 * 60 * 60,
            60 * 60,
            60,
            1
        ],
        i = 0,
        j = divisors.length,
        res = [];
        
        for (; i < j; i++) {
            res[i] = (ts / divisors[i]) | 0;
        }

        return [
            [0, 1],
            [1, 4],
            [2, 2],
            [1, 6]
        ];
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
            j = seg.length;

        for (; i < j; i++) {
            Timer.setFragment(seg.eq(i), vals[i]);
        }
    },
    
    startCountdown: function() {
        setTimeout(Timer.startCountdown, 1000);
        Timer.timestamp--;
        Timer.time = Timer.parseTimeStamp(Timer.timestamp);
        for(var i = 0, j = Timer.spinners.length; i < j; i++) {
            Timer.setSpinner(Timer.spinners[i], Timer.time[i]);
        }
    }
};
    
Timer.init = function() {
    var timer = $('#clock_timer'),
        wrap = timer.parent(),
        i = 0,
        j = 0,
        segments = [
            timer.find('.days'),
            timer.find('.hours'),
            timer.find('.minutes'),
            timer.find('.seconds')
        ],
        spinner_html = '<ul><li>9</li>';

    for (; i < 2; i++) {
        for (; j < 10; j++) {
            spinner_html += '<li>' + j + '</li>'
        }
    }
    spinner_html += '</ul>';

    // Set initial values
    Timer.timestamp = (+timer.data('est') / 1000) | 0;
    Timer.time = Timer.parseTimeStamp(Timer.timestamp);

    // Create spinners
    timer.detach();
    
    for (i = 0, j = segments.length; i < j; i++) {
        segments[i].html(spinner_html + spinner_html);
        Timer.spinners[i] = segments[i].find('ul');
        Timer.spinners[i].eq(1).addClass('second');
        Timer.spinners[i].data('curr', 0);
    }

    wrap.append(timer);
    
    // Calculate offsets
    comp = parseInt(Timer.spinners[0].eq(0).css('top'), 10);
    step = Timer.spinners[0].find('li').eq(0).height();
    
    Timer.startCountdown();
}();


