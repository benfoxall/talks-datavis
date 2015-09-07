(function (global) {

  function runkeeperSummary(el) {
    d3.csv('/sw/summary.csv', function(error, summary) {

      var distance = summary.reduce(function(total, activity){
        return total + parseInt(activity.total_distance,10);
      }, 0);

      function value(str){
        el.querySelector('.value').innerText = str;
      }

      value(Math.round(distance/1000).toLocaleString() + ' km')
    })
  }

  global.runkeeperSummary = runkeeperSummary;
})(this);
//
//
// var html = '<table>\n';
// for (var i = 0; i < 12; i++) {
//   html += '<tr>';
//   for (var j = 0; j < 12; j++) {
//     var n = (Math.floor(Math.random()*9) + 1);
//     html += '<td class="nines-num-'+n+'">' + n + '</td>';
//   }
//   html += '</tr>\n'
// }
// html += '</table>'
