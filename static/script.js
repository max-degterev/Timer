(function($){
    var tab_state = true;
    
    var focusHandler = function(e) {
        tab_state = true;
    };
    
    var blurHandler = function(e) {
        tab_state = false;
    };
    
    // Set active tab event handlers
    if (/*@cc_on!@*/false) { // check for Internet Explorer
        document.onfocusin = focusHandler;
        document.onfocusout = blurHandler;
    } else {
        window.onfocus = focusHandler;
        window.onblur = blurHandler;
    }

    var Spinner = function (el, options) {
        var self = this;

        this.options = options;

        this.spinners = [];

        var spinner = el.find('.spinner'),
            i, j, n, str,
            segments = spinner.find('> div'),
            spinner_html = '<ul>';

        if (this.options.backward) {
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

        // Create spinners
        spinner.detach();
        for (i = 0, j = segments.length; i < j; i++) {
            str = '';
            for (n = 0; n < this.options.blocks[i]; n++) {
                str += spinner_html;
            }
            
            segments.eq(i).html(str);

            this.spinners[i] = segments.eq(i).find('ul');

            for (n = 0; n < this.options.blocks[i]; n++) {
                this.spinners[i].eq(n).addClass('col' + (n + 1)); // Only for styling
            }

            this.spinners[i].data('curr', this.options.backward ? 9 : 0);
        }
        el.append(spinner);

        // Calculate offsets
        comp = parseInt(this.spinners[0].eq(0).css('top'), 10);
        step = this.spinners[0].find('li').eq(0).height();

        if (this.options.timer) {
            // Set initial values
            this.timestamp = (+spinner.data('est') / 1000) | 0;
            this.time = this.parseTimeStamp(this.timestamp);
            this.startCountdown();
        }

        return this;
    };

    Spinner.prototype.set = function(options) {
        $.extend(this.options, options);
        return this;
    };

    Spinner.prototype.parseTimeStamp = function(ts) {
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

    Spinner.prototype.setFragment = function(el, val) {
        var curr = el.data('curr'),
            leap, next;

        if (val === curr) {// No need to update
            return this;
        }

        if (this.options.backward) {
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
        return this;
    };

    Spinner.prototype.setSpinnerBySegment = function(seg, vals) {
        var i = 0,
            j = seg.length;

        for (; i < j; i++) {
            this.setFragment(seg.eq(i), vals[i]);
        }
        return this;
    };

    Spinner.prototype.setSpinner = function(arr) {
        for (var i = 0, j = this.spinners.length; i < j; i++) {
            this.setSpinnerBySegment(this.spinners[i], arr[i]);
        }
        return this;
    };

    Spinner.prototype.startCountdown = function() {
        var self = this;
        setTimeout(function() {
            Spinner.prototype.startCountdown.call(self);
        }, 1000);
        this.options.backward ? (this.timestamp--) : (this.timestamp++);

        if (tab_state) {
            this.time = this.parseTimeStamp(this.timestamp);
            for (var i = 0, j = this.spinners.length; i < j; i++) {
                this.setSpinnerBySegment(this.spinners[i], this.time[i]);
            }
        }

        return this;
    };

    $.fn.spinner = function(options) {
        var settings = {
            duration: 200,
            backward: true,
            timer: true,
            blocks: [2, 2, 2, 2]
        };

        this.each(function() {
            var el = $(this),
                spinner = el.data('spinner');

            if (!spinner) {
                options && $.extend(settings, options);

                // sane options
                (settings.duration > 800) && (settings.duration = 800);

                el.data('spinner', new Spinner(el, settings));
            }
            else if(options) {
                spinner.set(options);
            }
        });

        return this.eq(0).data('spinner');
    };
})(jQuery);
