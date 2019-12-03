export default class Timeline {
  constructor() {
    this.$wrap = $('.adCompanyTimeline .wrapper');

    if (this.$wrap.length == 0) return false;

    this.$plane = this.$wrap.find('.plane');
		this.$timelineWrap = this.$wrap.find('.timeline .wrap');
		this.$timelineBgWrap = this.$wrap.find('.timelineBg .wrap');
		this.$timelineList = this.$timelineWrap.find('ul');
    this.drag = false;

    this.initScroll();
		this.initDrag();
  }

  initScroll() {
    let self = this;
    var fullWidth = this.$timelineList[0].scrollWidth;
    var fullHeight = this.$timelineList.outerHeight();
    this.$timelineWrap.append('<div class="fakeScroll" style="width:' + fullWidth +'px; height:' + fullHeight + 'px"></div>')
    this.$timelineWrap.addClass('init');

    this.$timelineWrap.on('scroll',function () {
      self.$timelineList.css('transform','translateX(-' + $(this).scrollLeft() + 'px)');
      self.$timelineBgWrap.css('transform','translateX(-' + $(this).scrollLeft() + 'px)');
      var progress = $(this).scrollLeft() / (fullWidth - self.$timelineWrap.outerWidth());
      var planeWidth = self.$plane.outerWidth(true);
      var position = (self.$wrap.innerWidth() * progress) - (planeWidth * progress);

      if (self.drag) return false;

      self.$plane[0].style.left = position + 'px';

    })
  }

  initDrag(e) {
    let self = this;
		var plane = this.$plane[0];

		plane.onmousedown = function(e) {
			self.drag = true;
		  var coords = self.getCoords();
		  var shiftX = e.pageX - coords.left;
			var rangeLeft = self.$wrap.offset().left;
			var scrollWidth = self.$timelineWrap[0].scrollWidth;
			var maxScroll = scrollWidth - self.$wrap.outerWidth() + 40;

		  function moveAt(e) {
				var rangeWidth = self.$wrap.width() - 40;
				var position = (e.pageX - shiftX) - rangeLeft;
				var progress = position/rangeWidth;
				if (e.pageX >= rangeLeft && (e.pageX - shiftX) <= (rangeLeft + rangeWidth) && position>= 0) {
					plane.style.left = position + 'px';
          if (window.innerWidth > 600)
				    self.$timelineWrap.scrollLeft(maxScroll * progress);
				}
		  }

			moveAt(e);

		  document.onmousemove = function(e) {
				if (self.drag) {
					document.onmouseup = function () {
						self.drag = false;
						document.onmousemove = null;
					}
				}

		    moveAt(e);
		  };

		  self.$plane[0].onmouseup = function() {
				self.drag = false;
		    document.onmousemove = null;
		    self.$plane[0].onmouseup = null;
		  };

		}

    plane.ontouchstart = function (e) {
      // console.log('ontouchstart');
      // console.log(e.changedTouches[0].pageX);
      self.drag = true;
      var coords = self.getCoords();
      // console.log('cords');
      // console.log(coords);
      var shiftX = (e.changedTouches[0].pageX - coords.left);
      var rangeLeft = self.$wrap.offset().left;
      var scrollWidth = self.$timelineWrap[0].scrollWidth;
      var maxScroll = scrollWidth - self.$wrap.outerWidth() + 84;

      function moveAt(e) {
        var rangeWidth = self.$wrap.width();
        var position = (e.changedTouches[0].pageX - shiftX) - rangeLeft;
        var progress = position/rangeWidth;
        if (e.changedTouches[0].pageX >= rangeLeft && (e.changedTouches[0].pageX - shiftX) <= (rangeLeft + rangeWidth) && position>= 0) {
          plane.style.left = position + 'px';
          self.$timelineWrap.scrollLeft(maxScroll * progress);
        }
      }

      moveAt(e);

      plane.ontouchmove = function(e) {
        if (self.drag) {
          plane.ontouchend = function (e) {
            // console.log('ontouchend');
            // console.log(e.changedTouches[0].pageX);
            self.drag = false;
            plane.ontouchmove = null;
          }
        }

        moveAt(e);
      };
    }

		plane.ondragstart = function() {
		  return false;
		};

	}

	getCoords() {
		var coord = this.$plane[0].getBoundingClientRect();
	  return {
	    top: coord.top + pageYOffset,
	    left: coord.left + pageXOffset
	  };
	}
}
