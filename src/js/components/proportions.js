export default class Timeline {
  constructor() {
    this.$wrap = $('.adBudgetAllocation .typesList');

    if (this.$wrap.length == 0) return false;

    this.targetScroll = this.$wrap.position().top - $(window).height();
    this.$service = this.$wrap.find('.service');
		this.$shop = this.$wrap.find('.shop');
		this.$names = this.$wrap.find('.name span');

    this.bind();
  }

  bind() {
    let self = this;
    this.scrollInit = this.scrollInit.bind(this);

    if ($(window).scrollTop() >= this.targetScroll)
      this.init();
    else
      $(window).on('scroll', this.scrollInit);
  }

  init() {
		this.setTitles();
		this.setProportions(this.$service);
		this.setProportions(this.$shop);
  }

  scrollInit() {
    if ($(window).scrollTop() >= this.targetScroll)
      $(window).off('scroll', this.scrollInit);
    else
      return false;

    this.init();
  }

  setProportions($elem) {
    let self = this;
		var $list = $elem.find('[data-proportion]');
		if ($list.length == 0) return false;
		var max = this.getMaxValue($list);
		$list.each(function () {
			var $this = $(this);
			var proportion = $(this).data('proportion');
			if (proportion == 0 || proportion == '') {
				$this.addClass('empty');
				return true;
			}
			self.increaseValue($this);
			raf(function () {
				$this.css('width', ((proportion/max)*100) + '%');
			})
		})
	}

  getMaxValue($list) {
		var max = 0;
		$list.each(function () {
			var proportion = $(this).data('proportion');
			if (proportion == 0 || proportion == '') return true;
			max = proportion > max ? proportion : max;
		})
		return max;
	}

	increaseValue($elem) {
		var duration = parseFloat($elem.css('transition-duration'))*1000;
		var end = $elem.data('proportion');
		var current = 0;
		var stepTime = Math.abs(Math.floor(duration / end));
		var timer = setInterval(function() {
        current++;
        $elem.attr('data-progress',current);
        if (current == end) clearInterval(timer);
    }, stepTime);
	}

	setTitles() {
    let self = this;
		this.$names.each(function (i) {
			self.$service.find('span').eq(i+1).attr('data-title',$(this).html());
			self.$shop.find('span').eq(i+1).attr('data-title',$(this).html());

		})
	}
}
