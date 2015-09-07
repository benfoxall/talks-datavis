

(function (global) {

  function nines(el) {

    var slide = new DynamicSlide(el);

    slide.fragments([
      function(){
        el.classList.add('highlight')
      }
    ])

  }

  global.nines = nines;
})(this);
