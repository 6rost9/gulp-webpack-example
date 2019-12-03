export default class SectionNavbar {
  constructor() {
    this.$section = $('section.navbar');
    if (this.$section.length == 0) return false;

    this.$items = this.$section.find('ul li span');
    this.$navWrap = this.$section.find('nav .wrap');
    this.$overlapLeft = this.$navWrap.siblings('.overlap.left');
    this.$overlapRight = this.$navWrap.siblings('.overlap.right');

    if (this.$navWrap[0].scrollWidth != this.$navWrap.width())
			this.$overlapRight.removeClass('hidden');

    this.$scrollItems = this.$items.map(function () {
      var item = $("." + $(this).data("target"));
      if (item.length) return item;
    })

    this.setParams();
    this.toggleOverlap();
    this.bind();
  }

  bind() {
    let self = this;

    this.$items.on('click',(e) => {
      if (!$(e.target).hasClass('active')){
        this.scrollToSection($(e.target));
      }
    });

    $(window).on('resize',() => {
      this.setParams();
      this.toggleOverlap();
    });

    this.$navWrap.on('scroll',() => {
      this.scrollSetOverlap();
    })

    $(window).on('scroll', function () {
      var headerOffset = ($('header').hasClass('fixed') || window.innerWidth <= 767) ? $('header').height() : 0;

      self.setActive();

      headerOffset = window.innerWidth >= 1760 ? 0 : headerOffset;

      if ($(window).scrollTop() >= (self.sectionStaticPosition - headerOffset + self.sectionNavbarOffset)) {
        self.$section.addClass('fixed');
      } else {
        self.$section.removeClass('fixed');
      }

    });

  }

  setParams() {
    if (!this.$section.hasClass('fixed')) {
      this.sectionStaticPosition = this.$section.position().top;
      var navHeight = this.$section.height();
      this.$section.addClass('fixed');
      var navFixedHeight = this.$section.height();
      this.$section.removeClass('fixed');
      this.sectionNavbarOffset = (navHeight - navFixedHeight) / 2;
    }
  }

  setActive() {
    var headerOffset = ($('header').hasClass('fixed') || window.innerWidth < 768) ? $('header').height() : 0;
        headerOffset += $('section.navbar').hasClass('fixed') ? $('section.navbar').height() : 0;
    var lastTarget;

    var current = this.$scrollItems.map(function () {
      var offsetTop = $(this).offset().top;
      if (offsetTop < ($(window).scrollTop() + headerOffset) && offsetTop !== 0) {
        return this;
      }
    })
    current = current[current.length - 1];
    var currentTarget = (typeof current != 'undefined') ? current.data('nav') : '';

    if (current != undefined && this.lastTarget != currentTarget) {
      this.lastTarget = currentTarget;
      this.$items.removeClass('active');
      var $target = this.$items.closest('[data-target="' + current.data('nav') + '"]');
      $target.addClass('active');

      this.$navWrap.animate({
          scrollLeft: $target.parents('li').position().left - 20
        }, 200);
    }
  }

  scrollToSection($elem) {
    var target = $('[data-nav="' + $elem.data('target') + '"]');
    if (target.length == 0) return false;
    var top = target.offset().top + 1;
    var headerOffset = $('header').hasClass('fixed') ? $('header').height() : 0;
        headerOffset += ($('section.navbar').hasClass('fixed') && $elem.parent('li').index() != 0) ? $('section.navbar').height() : 0;
    var scrollOffset = 300;
    var dif = $(window).scrollTop() - top;

    if (dif > 0) {
      if (dif > scrollOffset) {
        $('html, body').scrollTop((top + scrollOffset));
      }
    } else {
      if ((dif * -1) > scrollOffset) {
        $('html, body').scrollTop((top - scrollOffset));
      }
    }

    $('html, body').animate({
        scrollTop: top - headerOffset
      }, 300);
  }

  toggleOverlap() {
    if (this.$navWrap[0].scrollWidth != this.$navWrap.width()) {
      this.$overlapRight.removeClass('hidden');
    } else {
      this.$overlapLeft.addClass('hidden');
      this.$overlapRight.addClass('hidden');
    }
  }

  scrollSetOverlap() {
    var maxScroll = this.$navWrap[0].scrollWidth - this.$navWrap.width();
    if (this.$navWrap.scrollLeft() == 0) {
      this.$overlapLeft.addClass('hidden');
    } else if (this.$navWrap.scrollLeft() < maxScroll) {
      this.$overlapLeft.removeClass('hidden');
      this.$overlapRight.removeClass('hidden');
    } else if (this.$navWrap.scrollLeft() == maxScroll) {
      this.$overlapRight.addClass('hidden');
    }
  }
}
