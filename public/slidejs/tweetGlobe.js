(function(global){

  function tweetGlobe(el){


    var config = Reveal.getConfig();
    var w = config.width,
        h = config.height;

    var canvas = document.createElement('canvas');
    el.appendChild(canvas)

    canvas.width = w;
    canvas.height = h;

    fetch('data/tweet-globe-data.json')
    .then(function(res){
      return res.json()
    })
    .then(function(data){

      // The transform matrix for rotating the ball
      var M = Matrix.I(3),
        drawn = false;

      // map the lat/lngs into cartesian coords and the
      // extend of the hist bar
      var vectors = data.map(function(point){
        var rho = 200;
        var phi = (point.lat + 90) * (Math.PI/180);
        var theta = (point.lng + 90) * (Math.PI/180);

        var x = rho * Math.sin(phi) * Math.cos(theta);
        var y = rho * Math.sin(phi) * Math.sin(theta);
        var z = rho * Math.cos(phi);

        return {
          v: $V([x,y,z]),
          v2: $V([x,y,z]).x(1.02 + (point.count/6000)),
          count: point.count
        };
      });

      // set up the drawing/animation
      var context = canvas.getContext('2d');

      var rendering;

      function render(){
        if(!rendering) return;

        requestAnimationFrame(render);

        TWEEN.update();

        // only draw if the transform matrix has changed
        if(drawn) return;
        drawn = true;


        // clear / setup the canvas
        canvas.width = canvas.width;
        context.translate(300,300);
        context.strokeStyle = 'rgba(0,0,0,0.3)';
        context.beginPath();

        vectors.forEach(function(vector, i){

          // transform to the current view
          var v = M.x(vector.v);

          // skip backface points
          if(v.elements[2] < 0) return;

          var v2 = M.x(vector.v2);

          context.moveTo(v.elements[0],v.elements[1]);
          context.lineTo(v2.elements[0],v2.elements[1]);

        });

        context.closePath();
        context.stroke();

      };

      // uk in view
      var state = {x: -0.88, y: 3.8, zoom: 1};

      var update = function(){

        var a = Matrix.RotationY(this.y);
        var b = Matrix.RotationX(this.x);

        M = a.x(b).x(this.zoom || 1);
        drawn = false;
      }

      update.bind(state)();

      var t = new TWEEN.Tween(state)
        .to( {x:2, y: -3}, 30000 )
        // .delay(1000)
  			.easing(TWEEN.Easing.Quadratic.InOut)
        .repeat(Infinity)
        .yoyo(true)
  			.onUpdate(update)

      var slide = new DynamicSlide(el);
      slide.addEventListener('shown', function(){
        t.start()
        rendering = true
        requestAnimationFrame(render);
      })

      slide.fragments([function(){
        t.stop();
        new TWEEN.Tween(state)
          .to( {zoom:0.00001, y:5}, 1000 )
          .easing(TWEEN.Easing.Quadratic.In)
          .onUpdate(update)
          .start()
          .onComplete(Reveal.next)
      }])

      slide.addEventListener('hidden', function(){
        t.stop();
        rendering = false
        cancelAnimationFrame(render);
      })

    })

  }

  global.tweetGlobe = tweetGlobe;

})(this);
