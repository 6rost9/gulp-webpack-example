import $ from 'jquery';
// import 'dragscroll';
import Inputmask from "inputmask";
// import Swiper from 'swiper';

import Form from './components/form';
import BenefitSlider from './components/benefitSlider';
import Coollapse from './components/coollapse';
import SectionNavbar from './components/sectionNavbar';
import ReasonsSlider from './components/reasonsSlider';
import StickyHeader from './components/stickyHeader';
import Timeline from './components/timeline';
import Proportions from './components/proportions';
import VideoPreload from './components/videoPreload';
import SwiperCounterNav from './components/swiperCounterNav';

window.$ = $;
window.raf = function(fn) {
  window.requestAnimationFrame(function() {
    window.requestAnimationFrame(function() {
      fn();
    });
  });
};

(function($) {
  $(function() {

    var phoneInputs = document.querySelectorAll('input[name="phone"]');
    var im = new Inputmask("+7 (999) 999-99-99", {
      showMaskOnHover: false
    });
    im.mask(phoneInputs);

    // var swiper = new Swiper('.swiper-container');
    // need to remove
    $('a').on('click', function(e) {
      e.preventDefault();
      console.log('prevent');
    })
    // need to remove

    $('.gamb').on('click', 'div', function() {
      var $this = $(this);
      var header = $this.parents('header');

      if ($this.attr('class') == '') {
        $this.addClass('not-active');
      }

      if (header.hasClass('open')) {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
        window.scrollTo(0, window.lastScrollY);

        header.removeClass('open');
      } else {
        window.lastScrollY = window.scrollY;

        function fix() {
          header.off('transitionend', fix);
          document.body.style.overflow = 'hidden';
          document.body.style.position = 'fixed';
          document.body.style.width = '100%';
          document.body.style.height = '100%';
        }

        raf(function() {
          header.addClass('open');
        })
        header.on('transitionend', fix);

      }

      $this.toggleClass('active');
      $this.toggleClass('not-active');
    });

    $('header').on('click', '.mainPhone', function() {
      if ($(window).width() < 768) return false;
      var $this = $(this);
      var $dropDown = $this.siblings('.dropDown');
      var $dropDownArrow = $this.find('.dropDownArrow');

      if ($dropDown.hasClass('collapsed')) {
        var heightStart = $dropDown.height();
        $dropDown.removeClass('collapsed');
        var heightEnd = $dropDown.height();
        $dropDown.css('height', heightStart);
        $dropDownArrow.addClass('active');
        raf(function() {
          $dropDown.css('height', heightEnd);
        })
      } else {
        $dropDown.addClass('collapsed');
        $dropDownArrow.removeClass('active');
        raf(function() {
          $dropDown.removeAttr('style');
        })
      }
    });

    new Timeline;
    new Proportions;
    new StickyHeader;
    new ReasonsSlider;
    new SectionNavbar;
    new Coollapse;
    new BenefitSlider;

    $('.video_background').each(function () {
      new VideoPreload(this);
    })

    new SwiperCounterNav('.seo_achievements .swiper-container', {
      slidesPerView: 4,
      spaceBetween: 53,
      breakpoints: {
        375: {
          slidesPerView: 1,
          spaceBetween: 15
        },
        600: {
          slidesPerView: 2,
          spaceBetween: 20
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 23
        }
      }
    });

    new SwiperCounterNav('.favorite_customers .swiper-container', {
      slidesPerView: 3,
      spaceBetween: 53,
      breakpoints: {
        475: {
          slidesPerView: 1,
          spaceBetween: 15
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 23
        }
      }
    });

    $('.form').each(function() {
      new Form(this);
    })

  });
})($);
