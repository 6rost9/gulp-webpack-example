import Swiper from 'swiper';

export default class {
  constructor(el, params) {
    this.$el = $(el);
    if (this.$el.length === 0) return false;
    this.addParams = {
      init: false,
      navigation: {
        nextEl: '.swiper-contol_next',
        prevEl: '.swiper-contol_prev',
        disabledClass: 'swiper-contol_disabled',
      }
    }

    this.$current = this.$el.find('.swiper-page-counter_current');
    this.$total = this.$el.find('.swiper-page-counter_total');

    this.params = Object.assign(params,this.addParams)
    this.swiper = new Swiper(el, this.params);

    this.bind();
    this.swiper.init();
    this.setTotal();
  }

  bind() {
    this.swiper.on('resize',(e)=>{
      this.setTotal();
    })
    this.swiper.on('slideChangeTransitionStart',(e)=>{
      this.$current.html(this.swiper.activeIndex + 1);
    })
  }

  setTotal() {
    var slidesPerView = this.swiper.params.slidesPerView;

    for (let bp in this.swiper.params.breakpoints) {
      if (window.innerWidth <= bp){
        slidesPerView = this.swiper.params.breakpoints[bp].slidesPerView;
        break;
      }
    }
    this.$current.html(this.swiper.activeIndex + 1);
    this.$total.html((this.swiper.slides.length - slidesPerView) + 1);
  }
}
