(function(global){

  var re = /\d+/;

  function runkeeperDuration(el){


    var config = Reveal.getConfig();
    var w = config.width,
        h = config.height,
        margin = Math.floor(Math.max(w,h) * 0.1);

    var svg = d3.select(el)
      .append('svg')
        .attr('width',  w)
        .attr('height', h)
        .attr('class', 'runkeeper-duration');

    var circles = svg.selectAll('circle');
    var paths = svg.selectAll('.line');


    d3.csv('/sw/distances.csv')
    .row(function(d) { return [
      parseInt(d[' distance'],10) / 1000,
      parseInt(d[' timestamp'],10) / 60 / 60 , // hours
      parseInt(d.uri.substr(19), 10)
    ]})
    .get(function(error, distances) {

      // dunno why this is
      distances = distances.filter(function(d){
        return d[0] && d[1]
      })

      // split into activities
      var activities = d3.values(distances.reduce(function(memo,item){
        if(!memo[item[2]])
          memo[item[2]] = []

        memo[item[2]].push(item.slice(0,2))

        return memo;
      },{}));

      // find the last item for each activity
      var maxes = activities.map(function(durations){
        return durations[durations.length-1]
      })

      distances = null;


      // x - time
      var x = d3.scale.linear()
        .range([margin, w-margin])
        .domain([0, d3.max(maxes.map(function(d){return d[1]}))])

      // y - distance
      var y = d3.scale.linear()
        .range([h-margin, margin])
        .domain([0, d3.max(maxes.map(function(d){return d[0]}))])


      var xaxis = d3.svg.axis().scale(x);
      var yaxis = d3.svg.axis().scale(y)
                    .orient("left");

      var line = d3.svg.line()
                    .x(function(d){ return x(d[1]) })
                    .y(function(d){ return y(d[0]) })


      svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0, '+(h-margin)+')')
        .call(xaxis)

      svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(' +margin+ ', 0)')
        .call(yaxis)

      svg.append('text')
        .text('Hours')
        .style('text-anchor', 'middle')
        .attr('transform', 'translate(' + d3.mean(x.range()) + ', ' + (h - (margin/2)) + ')')

      svg.append('text')
        .text('Kilometres')
        .style('text-anchor', 'middle')
        .attr('transform', 'translate(' + margin/2 + ', ' + d3.mean(y.range()) + ') rotate(-90)')


      var slide = new DynamicSlide(el);
      slide.fragments([
        function(){

          circles = circles
            .data(maxes)

          circles
            .enter()
            .append('circle')
            .style('fill', '#08f')
            .attr('cx', function(d){return x(d[1])})
            .attr('cy', function(d){return y(d[0])});

          circles
            .attr('r', 0)
            .transition()
            .attr('r', 4)
            .delay(function(d,i){return i*10})


        },
        function(){

          paths = paths.data(activities)

          paths
            .enter()
            .append('path')
            .attr('class', 'line')
            .attr('d', line);

          paths
            .style('opacity', 0)
            .transition()
            .style('opacity', 0.8)
            .duration(1000)
            .delay(function(d,i){return i*10});

          circles
            .transition()
            .attr('r', 0)
            .delay(function(d,i){return (i*10) + 500})

        }
      ])


      slide.addEventListener('hidden', function(){
        paths
        .transition()
        .style('opacity', 0.8)
        .remove();
        circles.remove();
      })

    })
  }

  global.runkeeperDuration = runkeeperDuration;

})(this)
