(function (global) {

  function runkeeperActivityCount(el) {
    d3.csv('/sw/summary.csv', function(error, summary) {

      el.querySelector('.value').innerText = summary.length + ' activities'

    })
  }

  global.runkeeperActivityCount = runkeeperActivityCount;
})(this);
