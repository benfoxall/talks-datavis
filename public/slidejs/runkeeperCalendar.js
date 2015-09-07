(function (global) {

  function runkeeperCalendar(el) {

    var config = Reveal.getConfig();
    var width = config.width,
        height = config.height/5,
        cellSize = 17;


    var percent = d3.format(".1%"),
        format = d3.time.format("%Y-%m-%d");

    var color = d3.scale.quantize()
        .domain([-.05, .05])
        .range(d3.range(11).map(function(d) { return "q" + d + "-11"; }));

    var svg = d3.select(el).selectAll("svg")
        .data(d3.range(2011, 2015))
      .enter().append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "calendar fragment")
        .on('shown', function(){

          d3.select(this)
            .selectAll('.day')
            .style('opacity', 0)
            .transition()
            .style('opacity',1)
            .delay(function(d,i){return i * 6})
        })
      .append("g")
        .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

    svg.append("text")
        .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
        .style("text-anchor", "middle")
        .text(function(d) { return d; });

    var rect = svg.selectAll(".day")
        .data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
      .enter().append("rect")
        .attr("class", "day")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", function(d) { return d3.time.weekOfYear(d) * cellSize; })
        .attr("y", function(d) { return d.getDay() * cellSize; })
        .datum(format);

    rect.append("title")
        .text(function(d) { return d; });

    svg.selectAll(".month")
        .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
      .enter().append("path")
        .attr("class", "month")
        .attr("d", monthPath);


    var colour = d3.interpolateRgb('#08f', '#f08');

    ///sw/summary.csv
    d3.csv("sw/summary.csv", function(error, csv) {
      if (error) throw error;

      var data = d3.nest()
        .key(function(d){
          return format(new Date(d.start_time))
        })
        .rollup(function(activities){
            return  d3.sum(activities, function(d) {return parseFloat(d.total_distance);})
        })
        .map(csv.filter(function(d){
          return parseFloat(d.total_distance) < 40000
        }))

      var extent = d3.extent(d3.values(data));
      var col = d3.scale.linear()
        .domain(extent)
        .range(['#08f', '#f08']);

      rect.filter(function(d) { return d in data; })
          .transition()
          .delay(function(){
            return Math.random()*1000
          })
          .duration(function(){
            return 1500 + (Math.random()*1000)
          })
          .style('fill', function(d){return col(data[d])})
          .style('stroke', function(d){return col(data[d])})
        .select("title")
          .text(function(d) { return d + ": " + data[d]/1000; });
    });


    function monthPath(t0) {
      var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
          d0 = t0.getDay(), w0 = d3.time.weekOfYear(t0),
          d1 = t1.getDay(), w1 = d3.time.weekOfYear(t1);
      return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
          + "H" + w0 * cellSize + "V" + 7 * cellSize
          + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
          + "H" + (w1 + 1) * cellSize + "V" + 0
          + "H" + (w0 + 1) * cellSize + "Z";
    }





    //
    //
    // d3.csv('/sw/summary.csv', function(error, summary) {
    //
    //   var distance = summary.reduce(function(total, activity){
    //     return total + parseInt(activity.total_distance,10);
    //   }, 0);
    //
    //   function value(str){
    //     el.querySelector('.value').innerText = str;
    //   }
    //
    //   value(Math.round(distance/1000).toLocaleString() + ' km')
    // })
  }

  global.runkeeperCalendar = runkeeperCalendar;
})(this);
