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

    var rendering;
    function render() {
      if(!rendering) return;
    	requestAnimationFrame( render );

      TWEEN.update();
    	renderer.render( scene, camera );
      // controls.rotateLeft()
      // controls.update()

    }

    var slide = new DynamicSlide(el);
    slide.addEventListener('shown', function(){
      if(!rendering) {
        rendering = true;
        render();
      }
      new TWEEN.Tween({radius:100000000, theta: 0, phi: 0})
        .to( { radius: 3000, theta: Math.PI*6, phi: 1 }, 10000 )
  			.easing( TWEEN.Easing.Quintic.Out )
  			.onUpdate( function () {
          controls.forceRadius(this.radius);
          controls.forceTheta(this.theta);
          controls.forcePhi(this.phi);
          controls.update()
  			} ).
        chain(

          new TWEEN.Tween({theta: Math.PI*6, radius: 3000})
            .to( {theta: Math.PI*8, radius: 5000}, 15000 )
      			.easing( TWEEN.Easing.Quadratic.InOut )
      			.onUpdate( function () {
              controls.forceRadius(this.radius);
              controls.forceTheta(this.theta);
              // controls.forcePhi(this.phi);
              controls.update()
      			} )

        )
  			.start();


    }, false);
    slide.addEventListener('hidden', function(){
      rendering = false;
    }, false);



  }

  global.runkeeperGlobe = runkeeperGlobe;

})(this)
