// JS for timeline view

var margin = {top: 20, right: 20, bottom: 30, left: 40};
var Days = {pan1: 0, zoom: 0, pan2: 0};
var Scale = {pan1: 0, zoom: 0, pan2: 0};
 
var columnwidth_thin = 1, 
  columnwidth_thick = 15,
  step_thin = 2,
  step_thick = 16;

var parse = d3.time.format("%m/%d/%y").parse;

var date1 = parse("04/21/14")
var date2 = parse("05/04/14")


d3.tsv("js/timeline_data.tsv", type, function(error, data) {

  var date_min = data[data.length-1].date,
    date_max = data[0].date;

  Days = countDays(date_min, date1, date2, date_max);
  Scale = getScale(Days, step_thin, step_thick);
  console.log(Scale);

  var width = Scale.sum - margin.left - margin.right,
    height = 170 - margin.top - margin.bottom;

  var svg = d3.select("#timeline").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    

  var x_pan1 = d3.time.scale()
      .range([0, Scale.pan1])
      .domain([date_min,date1]);

  var x_zoom = d3.time.scale()
      .range([Scale.pan1, Scale.pan1+Scale.zoom])
      .domain([date1,date2]);

  var x_pan2 = d3.time.scale()
      .range([Scale.pan1+Scale.zoom, Scale.sum])
      .domain([date2,date_max]);

  var Ax_pan1 = d3.svg.axis()
      .scale(x_pan1)
      .orient("bottom")
      .ticks(2);

  var Ax_zoom = d3.svg.axis()
      .scale(x_zoom)
      .orient("bottom")
      .ticks(2);

  var Ax_pan2 = d3.svg.axis()
      .scale(x_pan2)
      .orient("bottom")
      .ticks(2);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(Ax_pan1);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(Ax_zoom);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(Ax_pan2);


  var y = d3.scale.linear()
      .range([height, 0])
      .domain([ (-1) * d3.max(data, function(d) { return d.outgoing; }), d3.max(data, function(d) { return d.incoming; })]);

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(5)
      .tickFormat(function (d) { 
          var formater = d3.format("0");
          if (d < 0) d = -d; // No negative labels
          return formater(d);
      });;


  var y_render = svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  y_render.append("text")
      //.attr("transform", "rotate(-90)")
      .attr("id", "in_label")
      .attr("x", 6)
      .attr("y", 0)
      .attr("dy", ".71em")
      .style("text-anchor", "start")
      .text("incoming");

  y_render.append("text")
      //.attr("transform", "rotate(-90)")
      .attr("id", "out_label")
      .attr("x", 6)
      .attr("y", height)
      .attr("dy", ".71em")
      .style("text-anchor", "start")
      .text("outgoing");

  svg.selectAll(".bar")
      .data(data)
    .enter()
    .call(function(data)
      { 
        var bargroup = this.append("g")
          .attr("class", "bargroup");

        bargroup.append("rect")
        .attr("class", "inbar")
        .attr("x", function(d) { return x_pan2(d.date); })
        .attr("width", columnwidth_thin)
        .attr("y", function(d) { return y(d.incoming); })
        .attr("height", function(d) { return y(0) - y(d.incoming); });

        bargroup.append("rect")
        .attr("class", "outbar")
        .attr("x", function(d) { return x_pan2(d.date); })
        .attr("width", columnwidth_thin)
        .attr("y", function(d) { return y(0); })
        .attr("height", function(d) { return y( (-1)*d.outgoing) - y(0); });
        
      });

    

});

function getBarPos (date) {
  // console.log(date);
}

function getScale(days, thin, thick)
{
  var pan1 = days.pan1*thin,
  zoom = days.zoom*thick,
  pan2 = days.pan2*thin;
  var sum = pan1+zoom+pan2;

  return {pan1: pan1,
    zoom: zoom,
    pan2: pan2,
    sum: sum };
    
}

function countDays(min, d1, d2, max) {
  return { pan1: getDiffDays(min, d1),
  zoom: getDiffDays(d1,d2)+1,
  pan2: getDiffDays(d2,max)};
}

function getDiffDays (dx, dy) {
  var timeDiff = Math.abs(dx.getTime() - dy.getTime());
  var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
  return diffDays;
}


function type(d) {
  d.date = parse(d.date);
  d.incoming = +d.incoming;
  d.outgoing = +d.outgoing;
  return d;
}
