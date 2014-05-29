// JS for timeline view

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 1084 - margin.left - margin.right,
    height = 170 - margin.top - margin.bottom;
var columnwidth = 1.5;
var domain1 = "12/02/12", domain2 = "05/05/14", 
    brush1 = "04/01/14", brush2 = "05/05/14";

var parse = d3.time.format("%m/%d/%y").parse;
var x = d3.time.scale().nice()
    .range([0, width])
    .domain([parse(domain1), parse(domain2)]);

var y = d3.scale.linear().nice()
    .range([height, 0]);


var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(5)
    .tickFormat(function (d) { 
        var formater = d3.format("0");
        if (d < 0) d = -d; // No nagative labels
        return formater(d);
    });;

var zoom = d3.behavior.zoom()
      .x(x)
      .scaleExtent([0.8, 10])
      .on("zoom", zoomed);

function zoomed() {

  // scale x axis
  svg.select(".x.axis").call(xAxis);

  // scale the bars
  var width_scaled = columnwidth * d3.event.scale;
  svg.selectAll(".bargroup rect")
    .attr("x", function(d) {return x(d.date) - width_scaled/2;})
    .attr("width", width_scaled);

  // update the brush
  var extent = brush.extent();
  brush.extent(extent);
  d3.select(".brush .extent")
    .attr("x", x(extent[0]))
    .attr("width", x(extent[1])-x(extent[0]));
  // console.log(brush.extent());


}


var brush = d3.svg.brush()
    .x(x)
    .extent([parse(brush1), parse(brush2)])
    .on("brush", brushed);

function brushed() {
  console.log(brush.extent());

  // update inbox
  var inbox = d3.select("#emails");
  for (var i=0; i<5; i++) {
    inbox.append("tr").append("td").append("img")
      .attr("src", "./imgs/background/background_03_06.gif")
  }

}

var svg = d3.select("#timeline").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(zoom)
    .on("mousedown.zoom", null);
    // .on("touchstart.zoom", null)
    // .on("touchmove.zoom", null);
    // .on("touchend.zoom", null);


svg.append("g")
      .attr("class", "x brush")
      .call(brush)
    .selectAll("rect")
      .attr("y", -6)
      .attr("height", height + 7);

// brushed();
brush.event(d3.select('.x.brush'));


d3.tsv("js/timeline_data.tsv", type, function(error, data) {
  x.domain([data[data.length-1].date, data[0].date]);
  y.domain([ (-1) * d3.max(data, function(d) { return d.outgoing; }), d3.max(data, function(d) { return d.incoming; })]);

  var gAxis = svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

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

  svg.selectAll(".bargroup")
      .data(data)
    .enter()
    .call(function()
      {
        var bargroup = this.append("g")
          .attr("class", "bargroup");
          
        bargroup.append("rect")
        .attr("class", "inbar")
        .attr("x", function(d) { return x(d.date) - columnwidth/2; })
        .attr("width", columnwidth)
        .attr("y", function(d) { return y(d.incoming); })
        .attr("height", function(d) { return y(0) - y(d.incoming); });

        bargroup.append("rect")
        .attr("class", "outbar")
        .attr("x", function(d) { return x(d.date) - columnwidth/2; })
        .attr("width", columnwidth)
        .attr("y", function(d) { return y(0); })
        .attr("height", function(d) { return y( (-1)*d.outgoing) - y(0); });
      });

});


function type(d) {
  d.date = parse(d.date);
  d.incoming = +d.incoming;
  return d;
}

