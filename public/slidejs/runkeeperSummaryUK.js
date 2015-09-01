(function (global) {

  function runkeeperSummaryUK(el) {

    var config = Reveal.getConfig();
    var w = config.width,
        h = config.height,
        r = Math.min(w,h) / 2.3;


    var svg = d3.select(el)
      .append('svg')
        .attr('width',  w)
        .attr('height', h);

    var s = 1, cx = w/2, cy = h/2;

    // 930km -> 360px
    var scale = d3.scale.linear()
      .domain([0,930000])
      .range([0,360])

    var scaleOffset = d3.scale.linear()
      .domain([0,930000])
      .range([0,-180])

    var rect = svg.append('rect')
      .attr('width', 0)
      .attr('height', 40)
      .attr('x', -20)
      .attr('transform', 'translate('+cx+','+cy+')')

      .style('fill', '#08f')
      .style('opacity', 0.9)


    // console.log(scale(1517))
    svg.append('use')
      .attr('xlink:href', 'images/uk-path.svg#map')
      .attr('transform', 'rotate(-75, '+w/2+', '+h/2+') matrix('+s+', 0, 0, '+s+', '+(cx-s*cx)+', '+(cy-s*cy)+')')



    d3.csv('/sw/summary.csv', function(error, summary) {

      var distance = summary.reduce(function(total, activity){
        return total + parseInt(activity.total_distance,10);
      }, 0);

      rect = rect.datum(distance);


      var slide = new DynamicSlide(el);
      slide.addEventListener('shown', function(){
        rect
          .transition()
          .delay(1000)
          .duration(1000)
          .attr('width', scale)
          .attr('x', scaleOffset)
      })

      slide.addEventListener('hidden', function(){
        rect
          .transition()
          .attr('width', 0)
          .attr('x', 0)
      })
    })

  }

  global.runkeeperSummaryUK = runkeeperSummaryUK;
})(this);
