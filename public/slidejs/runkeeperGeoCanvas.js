(function(global){

  var config = Reveal.getConfig(),
      w = config.width,
      h = config.height;

  // make into easier coord system
  h = w/2;

  if(h > config.height) console.error("Height is too high")


  var x = d3.scale.linear()
            .domain([-180, 180])
            .range([0, w]);

  var y = d3.scale.linear()
            .domain([-90, 90])
            .range([h, 0]);

  function runkeeperGeoCanvas(el){
    var canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;

    el.appendChild(canvas);

    var ctx = canvas.getContext('2d');



    fetch('sw/geo.simple.json')
      .then(function(res){
        return res.json()
      })
      .then(function(geo){

        function render(){
          // clear
          ctx.fillStyle = '#fff'
          ctx.fillRect(0,0,w,h)
          ctx.fillStyle = 'rgba(0,136,255,0.2)';

          geo.features.forEach(function(f){
            f.geometry.coordinates.forEach(function(c){
              ctx.fillRect(x(c[0]),y(c[1]),2,2)
            })
          })
        }

        render();

        function setPoint(){
          var _poi = this.dataset.canvasPoi;
          if(_poi) poi = JSON.parse(_poi);
          console.log(poi)
          x.domain([poi.lng - (2*poi.margin), poi.lng + (2*poi.margin)])
          y.domain([poi.lat - poi.margin, poi.lat + poi.margin])
          render();
        }

        function resetPoint(){
          x.domain([-180, 180]);
          y.domain([-90, 90]);
          render();
        }

        [].forEach.call(el.querySelectorAll('.fragment'), function(frag){
          frag.addEventListener('shown', setPoint, false)
        })

        el.addEventListener('shown', resetPoint, false)
      })
  }

  global.runkeeperGeoCanvas = runkeeperGeoCanvas;

})(this)
