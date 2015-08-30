(function (global) {

  function runkeeperSummary(el) {
    d3.csv('/sw/summary.csv', function(error, summary) {

      var distance = summary.reduce(function(total, activity){
        return total + parseInt(activity.total_distance,10);
      }, 0);

      function value(str){
        el.querySelector('.value').innerText = str;
      }

      value(distance + ' m');

      var slide = new DynamicSlide(el);

      slide.fragments([
        function(){
          value(distance.toLocaleString() + ' m')
        },
        function(){
          value(Math.round(distance/1000).toLocaleString() + ' km')
        }
      ])

    })
  }

  global.runkeeperSummary = runkeeperSummary;
})(this);
