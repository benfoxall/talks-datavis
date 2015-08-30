console.log("LOG WO");


window.slides = {
  logoLine: function(selector){
    console.log("LOGO LINE", selector);

    // Reveal.on

    Reveal.addEventListener( 'ready', function( event ) {
    // event.currentSlide, event.indexh, event.indexv
      console.log("READY");

      // [].forEach.call(
      //   document.querySelectorAll(selector),
      //   function(elem){
      //     console.log(">>", elem.className)
      //     //has-light-background

      //     elem.innerHTML = svg_src;
      //   }
      // );


    } );



    // [].forEach.call(
    //   document.querySelectorAll(selector),
    //   function(elem){
    //     console.log(">>", elem.className)
    //     //has-light-background

    //     elem.innerHTML = svg_src;
    //   }
    // );




  }
};


var svg_src = 
'<svg ' +
  'version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" ' +
             'viewBox="-1 -1 174.8 101.8" enable-background="new 0 0 172.8 99.8" xml:space="preserve">' +
  '<polygon points="57.6,49.9 43.2,74.8 72,74.8 57.6,49.9   "/>' +
  '<polygon points="57.6,49.9 43.2,24.9 43.2,24.9 28.8,49.9 57.6,49.9   "/>' +
  '<polygon points="72,24.9 57.6,49.9 57.6,49.9 86.4,49.9 72,24.9   "/>' +
  '<polygon points="72,74.8 86.4,49.9 57.6,49.9   "/>' +
  '<polygon points="57.6,0 28.8,0 43.2,24.9   "/>' +
  '<polygon points="43.2,24.9 72,24.9 72,24.9 57.6,0 43.2,24.9  "/>' +
  '<polygon points="14.4,24.9 28.8,49.9 43.2,24.9   "/>' +
  '<polygon points="43.2,24.9 28.8,0 14.4,24.9 43.2,24.9  "/>' +
  '<polygon points="28.8,49.9 43.2,74.8 57.6,49.9   "/>' +
  '<polygon points="0,0 14.4,24.9 28.8,0  "/>' +
  '<polygon points="57.6,99.8 72,74.8 43.2,74.8   "/>' +
  '<polygon points="57.6,49.9 72,24.9 43.2,24.9   "/>' +
  '<polygon points="100.8,24.9 115.2,49.9 129.6,24.9 129.6,24.9   "/>' +
  '<polygon points="115.2,99.8 129.6,74.8 100.8,74.8  "/>' +
  '<polygon points="129.6,24.9 144,0 115.2,0 115.2,0 129.6,24.9   "/>' +
  '<polygon points="86.4,49.9 100.8,74.8 115.2,49.9   "/>' +
  '<polygon points="115.2,49.9 100.8,74.8 129.6,74.8 115.2,49.9   "/>' +
  '<polygon points="129.6,24.9 144,49.9 158.4,24.9 129.6,24.9   "/>' +
  '<polygon points="115.2,49.9 100.8,24.9 100.8,24.9 86.4,49.9 115.2,49.9   "/>' +
  '<polygon points="129.6,74.8 144,49.9 115.2,49.9  "/>' +
  '<polygon points="129.6,24.9 158.4,24.9 144,0   "/>' +
  '<polygon points="144,0 158.4,24.9 172.8,0  "/>' +
  '<polygon points="115.2,49.9 115.2,49.9 144,49.9 129.6,24.9   "/>' +
  '<polygon points="100.8,24.9 129.6,24.9 115.2,0 100.8,24.9  "/>' +
  '<polygon points="72,24.9 100.8,24.9 100.8,24.9 86.4,0 72,24.9  "/>' +
  '<polygon points="115.2,0 86.4,0 100.8,24.9   "/>' +
  '<polygon points="86.4,0 57.6,0 57.6,0 72,24.9  "/>' +
  '<polygon points="72,24.9 86.4,49.9 100.8,24.9  "/>' +
'</svg>';
