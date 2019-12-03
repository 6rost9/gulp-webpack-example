import $ from 'jquery';

import Inputmask from "inputmask";


import Form from './components/form';

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

    $('.form').each(function() {
      new Form(this);
    })

  });
})($);
