export default class Animation {
  checkTarget(target) {
    if (target == undefined) return false;
    if ( !(target instanceof Element) && !(target instanceof $) && typeof target !== 'string') return false;
    var $target = $(target);
    if ($target.length == 0) return false;
    return $target;
  }

  fadeIn(target, options = {from,to,duration},callback) {
    options.direction = 'in';
    this.fade(target, options,callback);
  }

  fadeOut(target, options = {from,to,duration},callback) {
    options.direction = 'out';
    this.fade(target,options,callback);
  }

  fade(target, options, callback ) {
    var $target = this.checkTarget(target);
    if (!$target) return false;

    let params = {
      from: 1,
      to: 0,
      duration: 200,
    }

    if (typeof options == 'function')
      callback = options;

    callback = typeof callback === 'function' ? callback : function () {};

    Object.assign(params, options);

    params.duration = String(params.duration / 1000) + 's';

    if (params.direction === 'in')
      params.from = [params.to, params.to = params.from][0];

    $target.css({
      'opacity': params.from,
      'transition-duration' : params.duration,
      'transition-property': 'opacity',
      'transition-timing-function': 'ease'
    });

    function end() {
      $target.off('transitionend',end);
      $target.removeAttr('style');
      callback();
    }

    raf(function() {
      $target.css({
        'opacity': params.to
      });
    });

    $target.on('transitionend',end);
  }

  slideUp(target, options = {duration,addHidden},callback) {
    options.direction = 'up';
    this.slide(target, options,callback);
  }

  slideDown(target, options = {duration,removeStyle},callback) {
    options.direction = 'down';
    this.slide(target,options,callback);
  }

  slide(target, options, callback ) {
    var $target = this.checkTarget(target);
    if (!$target) return false;

    let params = {
      start:0,
      end:0,
      duration: 200,
      removeStyle: false,
      addHidden: false
    }

    if (typeof options == 'function')
      callback = options;

    callback = typeof callback === 'function' ? callback : function () {};

    Object.assign(params, options);

    params.duration = String(params.duration / 1000) + 's';

    if (options.direction == 'down') {
      if ($target.hasClass('hidden')) {

      } else {
        $target.css('height','auto');
        params.end = $target.outerHeight();
        $target.removeAttr('style');
      }
    } else if (options.direction == 'up') {
      params.start = $target.outerHeight();
    }

    $target.css({
      'heigt': params.start,
      'transition-duration': params.duration,
      'transition-property': 'height',
      'transition-timing-function': 'ease'
    });

    function end() {
      $target.off('transitionend',end);

      if (params.removeStyle || options.direction == 'up')
        $target.removeAttr('style');

      if (params.addHidden)
        $target.addClass('hidden');

      callback();
    }

    raf(function() {
      $target.css({
        'height': params.end
      });
    });

    $target.on('transitionend',end);

  }

  play(target, style, callback){
    callback = callback || function() {};
    var add = function() {
      target.addClass(style + '-play');
    }
    target.addClass(style + '-start');
    var rem = function() {
      target.off('animationend', rem);
      target.removeClass(style + '-start');
      target.removeClass(style + '-play');
      callback();
    }
    raf(add);
    target.on('animationend', rem);
  }
}
