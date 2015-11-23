(function(global){

  function LogoWO(selector){

    this.element = document.querySelector(selector);

    var colours = [
      ["#ED1E79","#9E005D","#ED1E79","#ED1E79","#ED1E79","#9E005D","#ED1E79","#ED1E79","#9E005D",
       "#9E005D","#ED1E79","#9E005D","#9E005D","#ED1E79","#9E005D","#9E005D","#ED1E79","#ED1E79",
       "#9E005D","#ED1E79","#ED1E79","#ED1E79","#ED1E79","#9E005D","#ED1E79","#ED1E79","#9E005D","#ED1E79"],
      ["#00D1E2","#00E4EB","#00E4EB","#00DAE6","#00FFF8","#00F6F4","#00EDEF","#00F6F4","#00DAE6",
       "#00FFF8","#00C8DD","#00EDEF","#00EDEF","#00C8DD","#00FFF8","#00DAE6","#00D1E2","#00EDEF",
       "#00E4EB","#00DAE6","#00F6F4","#00FFF8","#00E4EB","#00F6F4","#00F6F4","#00FFF8","#00FFF8","#00EDEF"],
      ["#7373E5","#8383E5","#7373E5","#6B6BDD","#8B8BEA","#8383E5","#8B8BEA","#9595EF","#7C7CE5",
       "#9C9CF2","#6B6BDD","#7C7CE5","#7C7CE5","#6B6BDD","#8B8BEA","#6B6BDD","#7373E5","#8B8BEA",
       "#7373E5","#7C7CE5","#9595EF","#9C9CF2","#8383E5","#8383E5","#7373E5","#7C7CE5","#7C7CE5","#6B6BDD"],
      ["#F18600","#E95A00","#F18600","#F18600","#E22D00","#E95A00","#E22D00","#E22D00","#E95A00",
       "#DB0000","#F18600","#E95A00","#F8B300","#FFE000","#F8B300","#F8B300","#FFE000","#FFE000",
       "#F8B300","#FFE000","#FFE000","#FFE000","#FFE000","#F8B300","#F18600","#F18600","#E95A00","#F18600"],
      ["#10A2AD","#10ADAD","#10A2AD","#10A2AD","#0DB2A2","#10ADAD","#0DB2A2","#0DB2A2","#10ADAD",
       "#16BCA6","#10A2AD","#10ADAD","#1195AA","#1385A8","#1195AA","#1195AA","#1385A8","#1385A8",
       "#1195AA","#1385A8","#1385A8","#1385A8","#1385A8","#1195AA","#10A2AD","#10A2AD","#10ADAD","#10A2AD"],
      ["#DB0000","#E22D00","#E22D00","#E22D00","#F18600","#E95A00","#E95A00","#E95A00","#E22D00",
       "#F18600","#DB0000","#E95A00","#E95A00","#DB0000","#F18600","#E22D00","#DB0000","#E95A00",
       "#E22D00","#E22D00","#E95A00","#F18600","#E22D00","#E95A00","#E95A00","#F18600","#F18600","#E95A00"],
      ["#00AAC6","#00CCDA","#26ACDC","#19A5D1","#26DEF9","#39CEFA","#00DDE4","#00EEEE","#00BBD0",
       "#00FFF8","#0099BC","#30BDEB","#7384EE","#0099BC","#997DFE","#19A5D1","#208FC7","#7F70E9",
       "#26ACDC","#4085D2","#AC6CFE","#BF5CFF","#5F7BDE","#868DFD","#5FAEFC","#739DFC","#4CBEFB","#33B2E6"],
      ["#FF00FF","#CCCCCC","#FF00FF","#FF00FF","#FF00FF","#CCCCCC","#FF00FF","#FF00FF","#CCCCCC",
       "#CCCCCC","#FF00FF","#CCCCCC","#CCCCCC","#FF00FF","#CCCCCC","#CCCCCC","#FF00FF","#FF00FF",
       "#CCCCCC","#FF00FF","#FF00FF","#FF00FF","#FF00FF","#CCCCCC","#FF00FF","#FF00FF","#CCCCCC","#FF00FF"],
      ["#000C52","#3A65EF","#8CDEF4","#8CDEF4","#8CDEF4","#8CDEF4","#000C52","#000C52","#3A65EF",
       "#3A65EF","#000C52","#8CDEF4","#8CDEF4","#000C52","#3A65EF","#3A65EF","#000C52","#000C52",
       "#3A65EF","#8CDEF4","#000C52","#8CDEF4","#8CDEF4","#8CDEF4","#000C52","#8CDEF4","#3A65EF","#000C52"]];



    var polys = [].slice.call(this.element.querySelectorAll('polygon'),0);


    // just in case
    var timeout;


    function exit(){
      clearTimeout(timeout);

      polys.forEach(function(p, i){
        p.style.transitionDelay = (i/90) + 's';
        p.style.transform = 'translate(0, -15px) scale(0) rotate(' +(Math.random() - 0.5) * 190 + 'deg)';
      });

      setTimeout(function(){
        Reveal.next();
      }, 1500)

      el.classList.add('exit');

    }


    function start(){
      polys.forEach(function(p, i){
        p.style.transitionDelay = (i/30) + 's';
        p.style.transform = '';
        p.style.fill = '#fff';
      });

      clearTimeout(timeout);

      setTimeout(next, 500, true)
    }

    var idx = -1;

    function next(loop){
      idx = (idx+1) % colours.length;

      polys.forEach(function(p, i){
        p.style.fill = colours[idx][i];
      });

      if(loop){
        timeout = setTimeout(next, 7500, true)
      }
    }



    var slide = new DynamicSlide(this.element);

    var el = this.element;

    slide.fragments([
    function(){
        el.classList.add('step-a');
    },
    function(){
        el.classList.add('step-b');
    },
    function(){
        el.classList.add('step-c');
    },
    exit
    ])


    slide.addEventListener('shown', function(){
      start()
    }, false)

  }



  console.log(global)

  global.LogoWO = LogoWO;

})(this);
