// JS for timeline view

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 1084 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
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

var svg = d3.select("#timeline").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("js/timeline_data.tsv", type, function(error, data) {
  x.domain(data.map(function(d) { return d.date; }));
  y.domain([ (-1) * d3.max(data, function(d) { return d.outgoing; }), d3.max(data, function(d) { return d.incoming; })]);

  svg.append("g")
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

  svg.selectAll(".bar")
      .data(data)
    .enter()
    .call(function()
      {
        var bargroup = this.append("g")
          .attr("class", "bargroup");
          
        bargroup.append("rect")
        .attr("class", "inbar")
        .attr("x", function(d) { return x(d.date); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.incoming); })
        .attr("height", function(d) { return y(0) - y(d.incoming); });

        bargroup.append("rect")
        .attr("class", "outbar")
        .attr("x", function(d) { return x(d.date); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(0); })
        .attr("height", function(d) { return y( (-1)*d.outgoing) - y(0); });
      });


    
    

});

function drawbars(selection)
{
  selection.append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.date); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.incoming); })
      .attr("height", function(d) { return y(0) - y(d.incoming); });
}

function type(d) {
  d.incoming = +d.incoming;
  return d;
}
