(function(global){

  function runkeeperPaths(el){

    var config = Reveal.getConfig();
    var w = config.width,
        h = config.height,
        margin = w * 0.2;


    var svg = d3.select(el)
      .append('svg')
      .attr('class', 'runkeeper-paths')
      .attr('width', w)
      .attr('height', h);

    var geo;

    var projection = d3.geo.equirectangular()
                        .translate([0, 0])
                        .scale(300000);

    var path = d3.geo.path().projection(projection)

    var colours = d3.scale.category20();


    d3.json('/sw/geo.simple.json', function(error, _geo) {
      if (error) return console.error('Unable to get json', error);

      geo = _geo;

      var groups = geofn
                    .group_bounds(geo.features.map(function(f) {
                      return f.bbox
                    }))

      // group together by intersecting bounding box
      var groupLayout = {
        children:
          groups
          .map(function(bound, i) {
            return {
              id:i,
              bbox: bound,
              centroids: []
            }
          })
      }

      // assign groups to features
      geo.features.forEach(function(feature, i) {
        for (var i = 0; i < groups.length; i++) {
          if (geofn.intersects(feature.bbox, groups[i])) {
            feature.properties.group = groupLayout.children[i];
            groupLayout.children[i].centroids.push(feature.properties.centroid);
            break;
          }
        }
      })

      // WARNING layout can re-order groupLayout.children
      d3.layout.pack()
        .value(function() {return 1})
        .size([w, h])
        (groupLayout)

      groupLayout.children.forEach(function(group) {
        group.centroid = d3.transpose(group.centroids)
                           .map(function(d) {return d3.mean(d)})
      })

      var layout = {
        children: d3.range(geo.features.length).map(function() {return {}})
      }

      d3.layout.pack()
        .value(function(d, i) {return geo.features[i].properties.total_distance})
        .value(function() {return 1})
        .size([w, h])
        (layout)

      geo.features.forEach(function(feature, i) {
        feature.properties.layout = layout.children[i]
      })

      var x = d3.scale.linear()
        .domain([0,geo.features.length])
        .range([margin,w-margin])

      var xg = d3.scale.linear()
        .domain([0,groupLayout.children.length])
        .range([margin,w-margin])

      var activities = svg.selectAll('path.activity')
          .data(geo.features);



      var dur = 1000,//3000
          tt = 10;//20

      var slide = new DynamicSlide(el);
      slide.addEventListener('shown', function(){

        activities
            .enter()
              .append('path')
              .attr('class', 'activity')
              .attr('d', function(d) {
                path.projection()
                  .rotate(
                    d.properties.centroid
                     .slice(0, 2)
                     .map(function(d) {return d * -1})
                  )
                return path(d);
              })
              .style('stroke', '#08f')
              // .style('stroke', function(d, i) {
              //   return colours(d.properties.group.id)
              // })
              .attr('transform', function(d, i) {
                var l = d.properties.layout;
                return 'translate(' + w/2 + ',' + h/2 + ') scale(1.9)'
              })
              .style('opacity', 0)

              // hardcode
              .filter(function(d,i){return i == 190})

              .transition()
              .duration(dur)
              .style('opacity', .7)
              .attr('transform', function(d, i) {
                var l = d.properties.layout;
                return 'translate(' + w/2 + ',' + h/2 + ') scale(2)'
              })

      })

      slide.addEventListener('hidden', function(){
        setTimeout(function(){
          svg.selectAll('*').remove()
        }, 1000)
      })


      slide.fragments([

        // draw in centre
        function(){
          activities
            .transition()
            .delay(function(d,i){return i*tt})
            .duration(dur)
            .style('opacity', .7)
            .attr('transform', function(d, i) {
              var l = d.properties.layout;
              // console.log(l)
              return 'translate(' + w/2 + ',' + h/2 + ') scale(2)'
            })
        },

        // spread out
        function(){
          activities
            .transition()
            .delay(function(d,i){return i*tt})
            .duration(dur)
            .style('opacity', 1)
            .attr('transform', function(d, i) {
              var l = d.properties.layout;
              return 'translate(' + l.x + ',' + l.y + ') scale(1.5)'
              // return 'translate(' + x(i) + ',' + h/2 + ') scale(1.4) rotate(10)'
            })
        },

        // make smaller
        function(){
          activities
            .transition()
            .delay(function(d,i){return i*tt})
            .duration(dur)
            .style('opacity', 1)
            .attr('transform', function(d, i) {
              var l = d.properties.layout;
              return 'translate(' + l.x + ',' + l.y + ') scale(.5) rotate(10)'
              // return 'translate(' + x(i) + ',' + h/2 + ') scale(1.4) rotate(10)'
            })
        },

        // colour by group
        function(){
          activities
            .transition()
            .delay(function(d,i){return i*tt})
            .duration(dur)
            .style('opacity', 1)
            .style('stroke', function(d, i) {
              return colours(d.properties.group.id)
            })
        },



        // move into groups
        function(){
          activities
            .transition()
            .delay(function(d,i){return i*tt})
            .duration(dur)
            .style('opacity', 1)
            .attr('transform', function(d, i) {
              var l = d.properties.group;
              return 'translate(' + l.x + ',' + l.y + ') scale(.8)'
              // return 'translate(' + x(i) + ',' + h/2 + ') scale(1.4) rotate(10)'
            })
        },

        // function(){
        //   activities
        //     .transition()
        //     .delay(function(d,i){return i*tt})
        //     .duration(dur)
        //     .style('opacity', 1)
        //     .attr('transform', function(d, i) {
        //       var y = i % 2 ? h/3 : 2*h/3;
        //       var r = i % 2 ? 20 : 0;
        //       return 'translate(' + x(i) + ',' + y + ') scale(1) rotate(' + r + ')'
        //     })
        // },
        // function(){
        //   activities
        //     .transition()
        //     .delay(function(d,i){return i*tt})
        //     .duration(dur)
        //     .style('opacity', 1)
        //     .attr('transform', function(d, i) {
        //       return 'translate(' + xg(d.properties.group.id) + ',' + h/2 + ') scale(.5) rotate(0)'
        //     })
        // },
        function(){
          activities
            .transition()
            .delay(function(d,i){return i*tt})
            .duration(dur)
            .style('opacity', 0.7)
            .attr('d', function(d, i) {
              var g = d.properties.group;
              path.projection()
                .rotate(
                  g.centroid
                   .slice(0, 2)
                   .map(function(d) {return d * -1})
                )
              return path(d);
            })
        }
      ]
      .concat(groups.map(function(g, i){
        return function(){
          console.log("GROUP ", g, i)

          activities
            .transition()
            .delay(function(d,i){return Math.random() * 2000})
            .duration(700)
            .style('opacity', function(d){return d.properties.group.id == i ? (i == 0 ? 0.5 : 1) : 0})
            .attr('transform', function(d) {

              var _x = d.properties.group.id < i ? -100 :
                      d.properties.group.id > i ? w+100 :
                      w/2;

              _x = w/2;

              var s = d.properties.group.id == i ? 1.5 : 0.2;

              return 'translate(' + _x + ',' + h/2 + ') scale('+s+') rotate(0)'
            })
        }
      }).filter(function(d, i){
        if(i === 0) return true;// || i === 9) return true
      })
      // .concat([
      //   function(){
      //     activities
      //       .transition()
      //       .delay(function(d,i){return i*tt})
      //       .duration(dur)
      //       .attr('transform', function(d, i) {
      //         var g = d.properties.group;
      //         return 'translate(' + g.x + ',' + g.y + ') scale(.5)'
      //       })
      //
      //   }
      // ])
    )


    )









/*
            // group together
            .transition()
            .delay(function(d, i) {
              return (i * 5) + 200
            })
            .duration(3500)
            .attr('transform', function(d, i) {
              var g = d.properties.group;
              return 'translate(' + g.x + ',' + g.y + ') scale(.5)'
            })

            // re-plot based on centroid
            .transition()
            .delay(function(d, i) {
              return (i * 5) + 4500
            })
            .duration(3500)

            .attr('d', function(d, i) {
              var g = d.properties.group;
              path.projection()
                .rotate(
                  g.centroid
                   .slice(0, 2)
                   .map(function(d) {return d * -1})
                )
              return path(d);
            })

*/
      //
      // svg.selectAll('circle.choice')
      //   .data(groupLayout.children)
      //   .enter()
      //   .append('circle')
      //   .attr('class', 'choice')
      //   .attr('r', 0)
      //   .on('click', function(d) {
      //     console.log(d)
      //     window.location.hash = 'box=' + d.centroid.join(',');
      //     if (window.focusOn) {
      //       window.focusOn(d.centroid)
      //     }
      //   })
      //   .transition()
      //   .delay(function(d, i) {return 7000 + i * 100})
      //   .duration(2000)
      //   .attr('r',  function(d) {return d.r})
      //   .attr('cx', function(d) {return d.x})
      //   .attr('cy', function(d) {return d.y})

    })



  }

  global.runkeeperPaths = runkeeperPaths;

})(this)
