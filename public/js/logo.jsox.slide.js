(function(global){

  function LogoJSOx(selector){

    var element = document.querySelector(selector);



    function each(selector, on){
      [].forEach.call(element.querySelectorAll(selector), function(el){
        el.classList[on ? 'add' : 'remove']('on');
      });
    }

    function clearAll(){
      each('.on', false);
    }

    function horse(){
      each('.jo-standard-horse', true);
    }
    function stuff(){
      each('.jo-bars', true);
    }


    var slide = new DynamicSlide(element);


    slide.fragments([horse, stuff])

    slide.addEventListener('shown', function(){
      clearAll();
    }, false)

  }

  console.log(global)

  global.LogoJSOx = LogoJSOx;

})(this);

