export default class StickyHeader {
  constructor() {
    this.headerFullHeight = 0;
    this.$header = $('header');

    if (this.$header.length == 0) return false;

    this.getHeaderHeight();
    this.bind();
  }

  bind() {
    $(window).on('resize',() => {
			this.getHeaderHeight();
		});

		$(window).on('scroll', () => {
			if (window.innerWidth >= 1510 || window.innerWidth <= 767) return false;

      let scrollTop = window.pageYOffset;

      if (scrollTop < this.headerFullHeight) {
				this.$header.removeClass('fixed');
				this.$header.removeAttr('style');
			} else if (scrollTop <= this.headerFullHeight + 50) {
				this.$header.addClass('fixed');
				this.$header.css('top', '-' + ((this.headerFullHeight + 50) - scrollTop) + 'px');
			} else {
				this.$header.addClass('fixed');
				this.$header.removeAttr('style');
			}
		});
  }

  getHeaderHeight() {
		if (this.$header.hasClass('fixed')) {
			this.$header.removeClass('fixed');
			this.headerFullHeight = this.$header.height();
			this.$header.addClass('fixed');
		} else {
			this.headerFullHeight = this.$header.height();
		}
	}
}
