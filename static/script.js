var Timer = function (el, options) {
    this.options = options || {
        duration: 200,
        countdown: true
    };
    
    // sane options
    (this.options.duration > 800) && (this.options.duration = 800);
    
    this.spinners = [];
    
    var timer = el.find('.timer'),
        i = 0,
        j = 0,
        segments = [
            timer.find('.days'),
            timer.find('.hours'),
            timer.find('.minutes'),
            timer.find('.seconds')
        ],
        spinner_html = '<ul>';

    if (this.options.countdown) {
        spinner_html += '<li>0</li>';
        for (i = 0; i < 2; i++) {
            for (j = 9; j >= 0; j--) {
                spinner_html += '<li>' + j + '</li>';
            }
        }
    }
    else {
        spinner_html += '<li>9</li>';
        for (i = 0; i < 2; i++) {
            for (j = 0; j < 10; j++) {
                spinner_html += '<li>' + j + '</li>';
            }
        }
    }

    spinner_html += '</ul>';

    // Set initial values
    this.timestamp = (+timer.data('est') / 1000) | 0;
    this.time = this.parseTimeStamp(this.timestamp);

    // Create spinners
    timer.detach();

    for (i = 0, j = segments.length; i < j; i++) {
        segments[i].html(spinner_html + spinner_html);
        this.spinners[i] = segments[i].find('ul');
        this.spinners[i].eq(1).addClass('col2');
        this.spinners[i].data('curr', this.options.countdown ? 9 : 0);
    }

    el.append(timer);

    // Calculate offsets
    comp = parseInt(this.spinners[0].eq(0).css('top'), 10);
    step = this.spinners[0].find('li').eq(0).height();

    this.startCountdown();
    
    return this;
};

// method example
Timer.prototype.set = function(options) {
    this.options = $.extend(this.options. options);
    return this;
};

Timer.prototype.parseTimeStamp = function(ts) {
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
};

Timer.prototype.setFragment = function(el, val) {
    var curr = el.data('curr'),
        leap, next;

    if (val === curr) { // LOLWTF!
        return;
    }

    if (this.options.countdown) {
        leap = (val > curr);
        next = -(step * (9 - val + (leap ? 10 : 0))) + comp;

        el.animate({
            top: next
        }, this.options.duration, leap ? function() {
            this.style.top = (-(step * (9 - val)) + comp) + 'px';
        } : undefined).data('curr', val);
    }
    else {
        leap = (val < curr);
        next = -(step * (val + (leap ? 10 : 0))) + comp;

        el.animate({
            top: next
        }, this.options.duration, leap ? function() {
            this.style.top = (-(step * val) + comp) + 'px';
        } : undefined).data('curr', val);
    }
};

Timer.prototype.setSpinner = function(seg, vals) {
    var i = 0,
        j = seg.length;

    for (; i < j; i++) {
        this.setFragment(seg.eq(i), vals[i]);
    }
};

Timer.prototype.startCountdown = function() {
    var that = this;
    setTimeout(function() {
        Timer.prototype.startCountdown.call(that);
    }, 1000);
    this.options.countdown ? (this.timestamp--) : (this.timestamp++);
    this.time = this.parseTimeStamp(this.timestamp);
    for (var i = 0, j = this.spinners.length; i < j; i++) {
        this.setSpinner(this.spinners[i], this.time[i]);
    }
};

$.fn.timer = function(options) {
    var els = $(this);
    
    els.each(function() {
        var el = $(this),
            timer = el.data('timer');
        
        if (!timer)
        {
            el.data('timer', new Timer(el, options));
        }
        else if(options)
        {
            timer.set(options);
        }
    });
    
    return els.eq(0).data('timer');
};

