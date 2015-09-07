(function(global){

  function d3Projections(el){

    var config = Reveal.getConfig();
    var w = config.width,
        h = config.height;

    var svg = d3.select(el)
      .append('svg')
        .attr('width',  w)
        .attr('height', h)
        .attr('class', 'd3-projections');

    var projection = d3.geo.albers()
      .center([0, 55.4])
      .rotate([4.4, 0])
      .parallels([50, 60])
      .scale(1200 * 2)
      .translate([w / 2, h / 2]);

    var projection2 = d3.geo.equirectangular()
      .center([0, 55.4])
      .rotate([4.4, 0])
      // .parallels([50, 60])
      .scale(1200 * 2)
      .translate([w / 2, h / 2]);

    var path = d3.geo.path()
      .projection(projection);


    d3.json("../data/uk.points.json", function(error, points) {
      var circle = svg
        .selectAll('circle')
        .data(points.map(projection2));

      d3.json("../data/uk.json", function(error, uk) {

        var slide = new DynamicSlide(el);
        slide.addEventListener('shown', function(){
          circle
            .enter()
            .append('circle')
            .style('fill', '#000')
            .attr('r',0)
            .attr('cx', function(d){return d[0]})
            .attr('cy', function(d){return d[1]})
            .transition()
            .delay(function(){return Math.random()*1000})
            .attr('r', 2)
        })
        slide.addEventListener('hidden', function(){
          setTimeout(function(){
            svg.selectAll('*').remove()
          }, 1000)
        })

        var map;

        slide.fragments([
          function() {
            circle
              .data(points.map(projection))
              .transition()
              .duration(function(){return 200 + Math.random()*800})
              .delay(function(){return Math.random()*250})
              .attr('cx', function(d,i){return d[0]})
              .attr('cy', function(d,i){return d[1]})
          },
          function() {
            map = svg.append("path")
                .datum(topojson.feature(uk, uk.objects.subunits))
                .attr("d", path)
                .style('fill', 'none')
                .style('stroke', '#000')

            circle
              .transition()
              .delay(function(){return Math.random()*1000})
              .attr('r', 0)
              .remove()
          },
          // function(){
          //   map
          //     .style('fill', '#fff')
          //     // .attr('transform', 'rotate(0, ' + w/2 + ', '+ h/2 +')')
          //     .transition()
          //     .duration(2000)
          //     .attr('transform', 'rotate(-90, ' + w/2 + ', '+ h/2 +')')
          //     .transition()
          //     .style('fill', '#000')
          // }
        ])
      });
    });
  }

  global.d3Projections = d3Projections;

})(this)
