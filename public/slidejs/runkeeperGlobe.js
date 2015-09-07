(function(global){

  function runkeeperGlobe(el){

    var camera, scene, renderer, first, world, controls;

    var config = Reveal.getConfig();
    var w = config.width,
        h = config.height;

    var element = document.getElementById('vis');


    var line_material = new THREE.LineBasicMaterial({
      linewidth: 2,
      color: 0x0088ff,
      transparent: true,
      opacity: 0.4
    });

    var m = 'box=-1.2413730587142544,51.75636252816891,68.74290644654184'.match('box=(.*)$');
    if(!m) throw new Error("no box selected");

    box = m[1].split(',').map(parseFloat);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, w / h, 0.00000001, 1000 );

    renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    renderer.setSize( w, h );
    renderer.setClearColor( 0xffffff );
    el.appendChild( renderer.domElement );

    world = new THREE.Object3D();
    scene.add(world)

    var globe_geometry = new THREE.IcosahedronGeometry( 6371000, 5 );
    var globe_material = new THREE.MeshBasicMaterial( {
      color: 0xdddddd,
      transparent:true,
      opacity: 0.2,
      wireframe: true
    } );
    var globe = new THREE.Mesh( globe_geometry, globe_material );
    world.add( globe );


    // find target from bounding box (url hash)
    var p = geofn.cartesian(box);
    var target = new THREE.Vector3( p[0], p[1], p[2] )

    // rotate so that target is at 0,0 in the world view
    world.quaternion.setFromUnitVectors(target.clone().normalize(), new THREE.Vector3(0,1,0))
    world.position.y = - target.length()

    window.focusOn = function(coords){
      // todo animate
      var p = geofn.cartesian(coords);
      var target = new THREE.Vector3( p[0], p[1], p[2] )

      // rotate so that target is at 0,0 in the world view
      world.quaternion.setFromUnitVectors(target.clone().normalize(), new THREE.Vector3(0,1,0))
      world.position.y = - target.length()
    }


    camera.position.z = 200;
    camera.position.y = 100;

    controls = new THREE.OrbitControls( camera );
    controls.damping = 0.2;
    controls.noPan = true;

    fetch('/sw/binary.path.b')
      .then(function(res){return res.blob()})
      .then(function(b){return blobToFloat32Array(b)})
      .then(function(data){


        for (var i = 3, off = 0; i < data.length; i += 3) {
          // more than 500m, then create a new path
          if(
            Math.abs(data[i] - data[i-3]) > 500 ||
            Math.abs(data[i+1] - data[i+1-3]) > 500 ||
            Math.abs(data[i+2] - data[i+2-3]) > 500
          ) {
            var path = new Float32Array(data.buffer, off * 4, i - off);
            off = i;

            var geometry = new THREE.BufferGeometry();
            geometry.addAttribute( 'position', new THREE.BufferAttribute( path, 3 ) );
            geometry.computeBoundingSphere();
            var mesh = new THREE.Line( geometry, line_material);
            globe.add( mesh );

          }
        }

        console.log('render time: %s seconds', (window.performance.now()/1000).toFixed(2))
      })


    function blobToFloat32Array(blob){
      return new Promise(function(accept, reject){
        var reader = new FileReader();
        reader.addEventListener("loadend", function() {
          accept(new Float32Array(reader.result, blob.length/4))
        });
        // todo handle fail
        reader.readAsArrayBuffer(blob);
      });
    }


    var view = {

      // WORLD
      // lat: 0, lng: 0, alt: 0,

      // brighton
      lng: -0.161662, lat: 50.8399495, alt: 30,


      // CAMERA
      radius: 384400000, // moon

      theta: Math.PI*6, // rotation

      phi: 0 // upward

    }


    function renderView(){

      // rotate the world
      var p = geofn.cartesian([view.lng, view.lat, view.alt]);

      var target = new THREE.Vector3( p[0], p[1], p[2] )
      world.quaternion.setFromUnitVectors(target.clone().normalize(), new THREE.Vector3(0,1,0))
      world.position.y = - target.length()

      // update the camera
      controls.forceRadius(view.radius);
      controls.forceTheta(view.theta);
      controls.forcePhi(view.phi);
      controls.update()

    }

    renderView()

    // helpers
    window.setViewProp = function(prop, value){
      view[prop] = value;
      renderView();
    }

    window.relinquishControl = function(){
      controls.forceRadius(null);
      controls.forceTheta(null);
      controls.forcePhi(null);
      controls.update()
    }

    window.cameraProps = function(){
      console.log.apply(console, ['radius: %f, phi: %f, theta: %f'].concat(controls.actual))
    }


    var rendering;
    function render() {
      if(!rendering) return;
    	requestAnimationFrame( render );

      TWEEN.update();
    	renderer.render( scene, camera );

    }


    var slide = new DynamicSlide(el);
    slide.addEventListener('shown', function(){
      if(!rendering) {
        rendering = true;
        render();
      }

      // zoom in
      new TWEEN.Tween(view)
        .easing( TWEEN.Easing.Quintic.Out )
        .to({radius: 3000, theta: Math.PI, phi: 1 }, 10000)
        .onUpdate(renderView)
        .chain(
          // spin
          new TWEEN.Tween(view)
            .easing( TWEEN.Easing.Quadratic.InOut )
            .to({radius: 4000, theta: Math.PI*2}, 10000)
            .onUpdate(renderView)
        )
        .start()


    }, false);


    slide.fragments([
    // function(){
    //
    //   new TWEEN.Tween(view)
    //     .easing( TWEEN.Easing.Quadratic.InOut )
    //     .to({radius: 4000, theta: -Math.PI*2}, 15000)
    //     .onUpdate(renderView)
    //   .start()
    //
    // },
    // function(){
    //
    //   TWEEN.removeAll()
    //   new TWEEN.Tween(view)
    //     .easing( TWEEN.Easing.Quadratic.InOut )
    //     .to({radius: 6000, phi: 0.001}, 5000)
    //     .onUpdate(renderView)
    //   .start()
    //
    // },
    function(){

      // zoom out to see most of england

      TWEEN.removeAll()
      new TWEEN.Tween(view)
        .easing( TWEEN.Easing.Quadratic.InOut )
        .to({radius: 80000, phi:0.8, theta: 1.3}, 5000)
        .onUpdate(renderView)
      .start()


    },
    function(){

      // go to Oxford
      TWEEN.removeAll()
      new TWEEN.Tween(view)
        .easing( TWEEN.Easing.Quadratic.InOut )
        .to({
          lng: -1.2433045, lat: 51.742028000000005, alt: 144,
          radius: 6684, phi: 0.6, theta: 1.15
        }, 5000)
        .onUpdate(renderView)
        .chain(new TWEEN.Tween(view)
          .easing( TWEEN.Easing.Quadratic.InOut )
          .to({radius: 4000, theta: -Math.PI*2}, 15000)
          .onUpdate(renderView))
      .start()

    },
    function(){

      //zoom into oxford paths, showing how many there are
      TWEEN.removeAll()
      new TWEEN.Tween(view)
        .easing( TWEEN.Easing.Quadratic.InOut )
        .to({
          lng: -1.25, lat: 51.76, alt: 144,
          radius: 35, phi: 0.82, theta: -0.36
        }, 5000)
        .onUpdate(renderView)
      .start()

    },
    function() {

      // zoom out to see the whole UK, facing canada
      TWEEN.removeAll()
      new TWEEN.Tween(view)
        .easing( TWEEN.Easing.Quadratic.InOut )
        .to({
          // radius: 94225.7126843239, phi: 1.10429897311243, theta: 1.13162192531485
          radius: 276677.421679355, phi: 0.738014627850838, theta: 2.16110789002187
        }, 5000)
        .onUpdate(renderView)
      .start()

    },

    function() {

      // Go to canada
      TWEEN.removeAll()
      new TWEEN.Tween(view)
        .easing( TWEEN.Easing.Quadratic.InOut )
        .to({
          lng: -116.97, lat: 51.3, alt: 878,
          radius: 3358.95182203151, phi: 0.262974376085244, theta: -0.336225805009344
          // radius: 54225.7126843239, phi: 1.10429897311243, theta: 1.13162192531485
        }, 5000)
        .onUpdate(renderView)
        .chain(
          new TWEEN.Tween(view)
            .easing( TWEEN.Easing.Quadratic.InOut )
            .to({
              radius: 2345.68133310664, phi: 1.55905744393394, theta: -0.75466203582576
            }, 5000)
            .onUpdate(renderView)
        )

      .start()

    },


    function() {

      // Go to canada airport
      TWEEN.removeAll()
      new TWEEN.Tween(view)
        .easing( TWEEN.Easing.Quadratic.InOut )
        .to({
          lng: -114, lat: 51.132, alt: 1087,
          radius: 3358, phi: 0.01, theta: -1.336225805009344
        }, 5000)
        .onUpdate(renderView)


      .start()

    },



    function() {

      // Zoom way out
      TWEEN.removeAll()
      new TWEEN.Tween(view)
        .easing( TWEEN.Easing.Quadratic.InOut )
        .to({
          radius: 5418530.59889526, phi: 0.000001, theta: -0.891222194458569
        }, 5000)
        .onUpdate(renderView)


      .start()

    },


    function() {

      // dollar glen high up
      TWEEN.removeAll()
      new TWEEN.Tween(view)
        .easing( TWEEN.Easing.Quadratic.InOut )
        .to({
          lng: -3.67786, lat: 56.171183, alt: 198,
          radius: 3418530,
        }, 5000)
        .onUpdate(renderView)
        .start();


    },

    function() {

      // dollar glen
      TWEEN.removeAll()
      new TWEEN.Tween(view)
        .easing( TWEEN.Easing.Quadratic.InOut )
        .to({
          lng: -3.67786, lat: 56.171183, alt: 198,
          radius: 1167
        }, 5000)
        .onUpdate(renderView)
        .start();


    },
    function() {

      // turn to face Fife
      TWEEN.removeAll()
      new TWEEN.Tween(view)
        .easing( TWEEN.Easing.Quadratic.InOut )
        .to({
          radius: 1167, phi: 1.52448088323486, theta: -0.600622633375521 + (Math.PI*2)
        }, 10000)
        .onUpdate(renderView)
        .start();

    },
    function() {

      // go to the lomonds
      TWEEN.removeAll()
      new TWEEN.Tween(view)
        .easing( TWEEN.Easing.Quadratic.InOut )
        .to({
          lng: -3.2635385, lat: 56.2226065, alt: 288
        }, 5000)
        .onUpdate(renderView)
        .chain(new TWEEN.Tween(view)
          .easing( TWEEN.Easing.Quadratic.InOut )
          .to({
            radius: 5165, phi: 1.6, theta: -2.05  + (Math.PI*2)
          }, 5000)
          .onUpdate(renderView))
        .start();

    },
    function() {
      // zoom back out

      TWEEN.removeAll()
      new TWEEN.Tween(view)
        .easing( TWEEN.Easing.Quadratic.InOut )
        .to({
          radius: 36888127, phi: 0.000001, theta: 0.7
        }, 5000)
        .onUpdate(renderView)
        .start();

    }
  ])

    slide.addEventListener('hidden', function(){
      rendering = false;
    }, false);

  }

  global.runkeeperGlobe = runkeeperGlobe;

})(this)
