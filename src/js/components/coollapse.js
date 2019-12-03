import Animation from './animation.js';

var animation = new Animation;

export default class Coollapse {
  constructor() {
    this.$items = $('[data-collapse-toggle]');
		if (this.$items.lengts == 0) return false;
    this.disabled = false;

    this.bind();
  }

  bind() {
    let self = this;

		this.$items.on('click',function () {
			self.toggle($(this));
		});
  }

  toggle($elem) {
		var self = this;
		var $target = $elem.siblings('[data-collapse-target]');

		if ($target.length == 0) return true;

		var type = $elem.data('collapse-toggle');

		if (type == 'mobile' && window.innerWidth > 600) return true;
		if (this.disabled) return true;

		this.disabled = true;

		if ($elem.hasClass('deploed') === true) {
      animation.slideUp($target,function () {
        $elem.removeClass('deploed');
        self.disabled = false;
      })

		} else {
      animation.slideDown($target,function () {
        $elem.addClass('deploed');
        self.disabled = false;
      })
		}
	}
}
