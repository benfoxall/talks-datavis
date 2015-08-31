(function (global) {

  function runkeeperSummaryEarth(el) {

    var config = Reveal.getConfig();
    var w = config.width,
        h = config.height,
        r = Math.min(w,h) / 2.3,
        circ = 6371000 * Math.PI * 2;


    var svg = d3.select(el)
      .append('svg')
        .attr('width',  w)
        .attr('height', h);

    var world = svg.append('circle')
      .attr('cx', w/2)
      .attr('cy', h/2)
      .attr('r', r)
      .style('fill','none')
      .attr('stroke', '#000')

    var arc = d3.svg.arc()
      .innerRadius(r)
      .outerRadius(r*1.1)
      .startAngle(0)
      .endAngle(function(d){return (d/circ) * (Math.PI * 2)})

    var path = svg.append('path')
      .attr('transform', 'translate('+ w/2 + ' ' + h/2 +')')
      .style('fill', '#08f');


    d3.csv('/sw/summary.csv', function(error, summary) {

      var distance = summary.reduce(function(total, activity){
        return total + parseInt(activity.total_distance,10);
      }, 0);

      path = path.datum(distance);


      var slide = new DynamicSlide(el);
      slide.addEventListener('shown', function(){
        path
          .transition()
          .delay(1000)
          .duration(1000)
          .attrTween('d', function(d){
            return function(t) {
              return arc(t*d)
            }
          })
      })

      slide.addEventListener('hidden', function(){
        path
          .transition()
          .attrTween('d', function(){
            return arc
          })
      })
    })
  }

  global.runkeeperSummaryEarth = runkeeperSummaryEarth;
})(this);
