import Animation from './animation.js';
import Hummer from 'hammerjs';

var animation = new Animation;

export default class BenefitSlider {
  constructor() {
    this.$wrap = $('.advertisingBenefit');

    if(this.$wrap.length == 0) return false;

    this.$slidesWrap = this.$wrap.find('.blocks');
    this.$slides = this.$slidesWrap.find('.block');

    this.paginationInit();

    this.$paginationWrap = this.$pagination.find('.wrap');
    this.$paginationElements = this.$paginationWrap.find('img');
    this.$scrollbar = this.$pagination.find('.scrollbar span');
    this.mc = new Hummer(this.$slidesWrap[0]);
    this.index = 0;
    this.initialized = false;
    this.disabled = false;

    this.bind();
  }

  bind() {
    let self = this;

    this.$pagination.on('click','img',function () {
      self.index = $(this).index();
      self.setSlide();
    })

    $(window).on('resize',function () {
      if (window.innerWidth <= 600){
        self.setScrollbar(self.$slides.closest('.active').index());
      }
    })

    this.mc.on('panend',function (e) {
      if (window.innerWidth > 600) return false;
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

  paginationInit() {
		if (this.initialized) return true;

		var pagination = $('<div/>',{
			class: 'pagination'
		});
		var wrap = $('<div/>',{
			class: 'wrap'
		});
		var scrollbar = $('<div/>',{
			class: 'scrollbar',
			append: $('<span/>')
		});

		this.$slides.each(function () {
			if ($(this).index() == 0) {
				$(this).addClass('active');
				wrap.append($('<img />',{src: $(this).find('img').attr('src'), class: 'active'}));
			} else {
				wrap.append($('<img />',{src: $(this).find('img').attr('src')}));
			}
		})

		pagination.append(wrap).append(scrollbar);
		this.$wrap.find('.wrapper').append(pagination);
		this.$pagination = pagination;
		this.initialized = true;
	}

  setSlide() {
		var $new = this.$slides.eq(this.index);

    if ($new.hasClass('active') || this.disabled) return false;

    this.disabled = true;
		var self = this;
		var $current = this.$slides.closest('.active');
		var currentHeight = $current.height();
		$new.addClass('.active');
		var newHeight = $new.height();
		$new.removeClass('.active');

		this.$slidesWrap.css('height', currentHeight);

		function end() {
			$new.addClass('active');
      animation.fadeIn($new,function () {
        self.$slidesWrap.removeAttr('style');
				self.disabled = false;
      })
			self.$slidesWrap.off('transitionend',end);
		}

		self.setScrollbar();

		animation.fadeOut($current,function () {
			$current.removeClass('active');
			if (currentHeight == newHeight) {
				self.$slidesWrap.css('height',newHeight);
				end();
			} else {
				self.$slidesWrap.css('transition','height .15s ease');

				raf(function () {
					self.$slidesWrap.css('height',newHeight);
				})

				self.$slidesWrap.on('transitionend',end);
			}
		});
	}

  setScrollbar() {
    var leftOffset = (window.innerWidth - this.$paginationWrap.width()) / 2;
    this.$paginationElements.removeClass('active');
    var left = this.$paginationElements.eq(this.index).addClass('active').position().left;
    this.$scrollbar.css('left',left - leftOffset);
  }
}
