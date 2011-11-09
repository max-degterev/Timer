Timer = {
    spinners: [],
    duration: 500,
    countdown: true,
    
    parseTimeStamp: function(ts) {
        var divisors = [
                24 * 60 * 60,
                60 * 60,
                60,
                1
            ],
        i = 0,
        j = divisors.length,
        x,
        res = [];
        
        for (; i < j; i++) {
            x = (ts / divisors[i]) | 0;
            ts -= (divisors[i] * x);
            x = ('0' + x).slice(-2);
            res.push([+x.charAt(0), +x.charAt(1)]);
        }
        
        return res;
    },
    
    setFragment: function(el, val) {
        var curr = el.data('curr'),
            leap, next;
            
        if (val === curr) { // LOLWTF!
            return;
        }
        
        if (Timer.countdown) {
            leap = (val > curr);
            next = -(step * (9 - val + (leap ? 10 : 0))) + comp;
            
            el.animate({
                top: next
            }, Timer.duration, leap ? function() {
                this.style.top = (-(step * (9 - val)) + comp) + 'px';
            } : undefined).data('curr', val);
        }
        else {
            leap = (val < curr);
            next = -(step * (val + (leap ? 10 : 0))) + comp;
            
            el.animate({
                top: next
            }, Timer.duration, leap ? function() {
                this.style.top = (-(step * val) + comp) + 'px';
            } : undefined).data('curr', val);
        }
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
        Timer.countdown ? (Timer.timestamp--) : (Timer.timestamp++);
        Timer.time = Timer.parseTimeStamp(Timer.timestamp);
        for (var i = 0, j = Timer.spinners.length; i < j; i++) {
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
        spinner_html = '<ul>';

    if (Timer.countdown) {
        spinner_html += '<li>0</li>'
        for (i = 0; i < 2; i++) {
            for (j = 9; j >= 0; j--) {
                spinner_html += '<li>' + j + '</li>';
            }
        }
    }
    else {
        spinner_html += '<li>9</li>'
        for (i = 0; i < 2; i++) {
            for (j = 0; j < 10; j++) {
                spinner_html += '<li>' + j + '</li>';
            }
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
        Timer.spinners[i].eq(1).addClass('col2');
        Timer.spinners[i].data('curr', Timer.countdown ? 9 : 0);
    }

    wrap.append(timer);
    
    // Calculate offsets
    comp = parseInt(Timer.spinners[0].eq(0).css('top'), 10);
    step = Timer.spinners[0].find('li').eq(0).height();
    
    Timer.startCountdown();
}();


