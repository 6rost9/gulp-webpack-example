export default class VideoPreload {
  constructor(el) {
    this.$el = $(el);
    if (this.$el.length === 0) return false;
    this.targetScroll = this.$el.parent('section').position().top -  window.innerHeight;
    this.$video = this.$el.find('video');
    this.$source = this.$video.find('source');
    this.source = this.$source.data('src');
    if (this.source === undefined || this.source === '') return false;

    this.canplay = this.canplay.bind(this);
    this.scrollInit = this.scrollInit.bind(this);

    this.bind();
  }

  bind() {
    if (window.pageYOffset >= this.targetScroll)
      this.preload();
    else
      $(window).on('scroll', this.scrollInit);
  }

  scrollInit() {
    if (window.pageYOffset >= this.targetScroll)
      $(window).off('scroll', this.scrollInit);
    else
      return false;

    this.preload();
  }

  preload() {
    this.$video.on('canplay',this.canplay)
    this.$source.attr('src',this.source);
    this.$video[0].load();
  }

  canplay() {
    this.$video.off('canplay',this.canplay);
    this.$el.removeClass('hidden');
    this.$video[0].play();
  }
}
