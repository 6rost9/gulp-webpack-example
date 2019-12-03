import Animation from './animation';
import ImagePreload from './imagePreload';
import Hummer from 'hammerjs';

var animation = new Animation;
var loader = new ImagePreload;

export default class ReasonsSlider {
  constructor() {
    this.$wrap = $('.eightReasons');

    if (this.$wrap.length == 0) return false;

    this.$slides = this.$wrap.find('.slides span');

    if (this.$slides.length == 0) return false;

    this.$targetScroll = this.$wrap.position().top - $(window).height();
    this.$elementsWrap = this.$wrap.find('.wrap');
    this.$title = this.$wrap.find('.title');
    this.$text = this.$wrap.find('.text');
    this.$img = this.$wrap.find('.wrap > img');
    this.$next = this.$wrap.find('.nextReason');
    this.$paginationWrap = this.$wrap.find('.pagination');
    this.mc = new Hummer(this.$wrap[0]);
    this.index = 0;
    this.title = '';
    this.text = '';
    this.image = '';
    this.disabled = false;

    this.imagePreload();
  }

  bind() {
    let self = this;
    this.scrollInit = this.scrollInit.bind(this);

    if ($(window).scrollTop() >= this.$targetScroll)
      this.init();
    else
      $(window).on('scroll', this.scrollInit);

    this.$next.on('click',function () {
			self.increase();
		})

    this.mc.on(' panend',function (e) {
      if (e.additionalEvent == 'panleft') {
        self.increase();
      } else if (e.additionalEvent == 'panright') {
        self.decrease();
      }
    })
  }

  increase() {
    var curIndex = this.$slides.siblings('.active').index();
    var newIndex = 0;
    if ((curIndex + 1) == this.$slides.length) {
      newIndex = 0
    } else {
      newIndex = curIndex + 1;
    }
    this.index = newIndex;
    this.setSlide();
  }

  decrease() {
    var curIndex = this.$slides.siblings('.active').index();
    var newIndex = 0;
    if ((curIndex - 1) < 0) {
      newIndex = this.$slides.length - 1
    } else {
      newIndex = curIndex - 1;
    }
    this.index = newIndex;
    this.setSlide();
  }

  scrollInit() {
    if ($(window).scrollTop() >= this.$targetScroll)
      $(window).off('scroll', this.scrollInit);
    else
      return false;

    this.init();
  }

  init() {
    this.pginationInit();
		this.setSlide(true);
  }

  imagePreload() {
    let self = this;
    var images = [];

    this.$slides.each(function () {
      images.push($(this).data('image'));
    })

    loader.load(images).done(function () {
      self.bind();
    })

  }

  pginationInit() {
    let self = this;
    var pagination = '<ul>';
    this.$slides.each(function () {
      pagination += '<li></li>';
    })
    pagination += '</ul>';
    this.$paginationWrap.html(pagination);
    this.$paginationList = this.$paginationWrap.find('li');
    this.$paginationList.on('click',function () {
      self.index = $(this).index();
      self.setSlide();
    })
  }

  setSlide(skip = false) {
		if (this.disabled) return false;
    this.disabled = true;
    this.setData();
    this.$slides.removeClass('active');
		this.$slides.eq(this.index).addClass('active');
		this.$paginationList.removeClass('active');
		this.$paginationList.eq(this.index).addClass('active');

		this.animateText({
      type: 'title',
      skip: skip
    })

		setTimeout(() => {
      this.animateText({
        type: 'text',
        skip: skip,
        enable: true
      })
		}, 100);

		this.animateImage(skip);

	}

  /**
   * Animate slider text elemnt.
   * @param {Object} options - Options object.
   * @type {string} options.type: 'title' - Text elemnet type title or text.
   * @type {boolean} options.skip: false - Skip animation first part fot init.
   * @type {boolean} options.enable: false - Set global disabled param true.
   */

  animateText(options = {type,skip,enable}) {
    let self = this;
    let params = {
      type: 'title',
      skip: false,
      enable: false,
    }

    Object.assign(params, options);

    var $elem,text;

    if (params.type === 'title') {
      $elem = this.$title;
      text = this.title;
    } else if (params.type === 'text') {
      $elem = this.$text;
      text = this.text;
    }
    var callback = params.enable ? function () {self.disabled = false} : function () {};

    if (params.skip) {
      $elem.addClass('hidden');
      $elem.html(text);
      $elem.removeClass('hidden');
      animation.play($elem,'slide-in',callback);
    } else {
      animation.play($elem,'slide-out',function () {
        $elem.html(text);
        animation.play($elem,'slide-in',callback);
      });

    }
  }

  animateImage(skipOut = false) {
    let self = this;
    if (skipOut) {
      this.$img.addClass('hidden');
      this.$img.attr({
        'src': this.image,
        'data-index': this.index
      });
      this.$img.removeClass('hidden');
      animation.play(this.$img,'slide-up');
    } else {
      animation.play(this.$img,'slide-down',function () {
        self.$img.attr({
          'src': self.image,
          'data-index': self.index
        });
        animation.play(self.$img,'slide-up');
      });
    }
  }

  setData(){
    var $target = this.$slides.eq(this.index);
    this.title = $target.data('title');
    this.text = $target.data('text');
    this.image = $target.data('image');
  }
}
