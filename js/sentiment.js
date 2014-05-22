
/*----------------------------------------------------------------
/ Eigen factor Visualization
/ Coded by : Sungsoo (Ray) Hong (rayhong@uw.edu), Univ. of Washington
/ Last modified at: 2013.05.17
----------------------------------------------------------------*/
//variable for inner and outer
var width = 900, height = 500, radius = Math.min(width, height)/2 - 70;
var path = ["./data_outer.csv", "./data_inner.csv"];
var pie = d3.layout.pie().sort(null).value(function(d) { return d.count; });

//variable for outer
var color_outer = d3.scale.ordinal().range(["#198a1b", "#959595"]);
var arc_outer = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 80);

//variable for inner
var color_inner = d3.scale.ordinal().range(["#27d827", "#6c6c6c"]);
var arc_inner = d3.svg.arc()
    .outerRadius(radius - 80)
    .innerRadius(radius - 120);

$(document).ready( function(){
	visualize();
	draw_Legend();
});

function visualize(){
	//Create svg and html
	var svg = d3.select("#main-right")
	  .append("svg").attr("width", width).attr("height", height)
	  .append("g").attr("id", "outerCircle").attr("transform", "translate(" + (width / 2 - 150) + "," + height / 2 + ")");
	d3.select("svg")
	  .append("g").attr("id", "innerCircle").attr("transform", "translate(" + (width / 2 - 150) + "," + height / 2 + ")");

	//Draw outer
	d3.csv(path[0], function(error, data) {
		data.forEach(function(d) {d.count = +d.count;});

		var g_out = svg.selectAll(".arc").select("#outerCircle")
			.data(pie(data)).enter().append("g").attr("class", "arc")
			.on("mouseover",function(d){if (d.data.sentiment == "positive"){$(this).css('cursor', 'pointer'); }})
			.on("click",function(d){if (d.data.sentiment == "positive"){draw_Group();}});

		g_out.append("path")
			.attr("d", arc_outer)
			.style("fill", function(d) { return color_outer(d.data.sentiment); })
			.style("stroke-opacity",0);
		
		g_out.append("text")
			.attr("transform", function(d) { return "translate(" + arc_outer.centroid(d) + ")"; })
			.attr("dy", ".35em")
			.style("text-anchor", "middle")
			.text(function(d) { if (d.data.sentiment == "positive") {return "66%";} });

		//Draw inner
		d3.csv(path[1], function(error, data) {
			data.forEach(function(d) {d.count = +d.count;});

			var g_in = svg.selectAll(".arc").select("#innerCircle")
				.data(pie(data)).enter().append("g").attr("class", "arc")
				.on("mouseover",function(d){if (d.data.sentiment == "positive"){$(this).css('cursor', 'pointer'); }})
				.on("click",function(d){if (d.data.sentiment == "positive"){draw_Group();}});

			g_in.append("path")
				.attr("d", arc_inner)
				.style("fill", function(d) { return color_inner(d.data.sentiment); })
				.style("stroke-opacity",0);
			g_in.append("text")
				.attr("transform", function(d) { return "translate(" + arc_inner.centroid(d) + ")"; })
				.attr("dy", ".35em")
				.style("text-anchor", "middle")
				.text(function(d) { if (d.data.sentiment == "positive") {return "68%";} });
		});

	});
}

function draw_Legend(){
	$("#contents").remove();
	var tagInsert = $('<div id="contents"><div id="legend"><img src="/imgs/legend.png" alt="legend"/></div></div>');
	/*<div id="contents">
		<div id="legend">
			<img src="/imgs/legend.png" alt="legend"/>
		</div>
	</div>*/
	tagInsert.appendTo("#main-right");
}

function draw_Group(){
	$("#contents").remove();
	var tagInsert = $('<div id="contents"> <div class="menu"><img src="/imgs/menu1_off.png"/></div> <div class="menu"><img src="/imgs/menu2_off.png"/> </div>');
	tagInsert.appendTo("#main-right");
	var tagInsert = $('<div class="group_clear"> Most positive groups </div><div class="group"> <img src="/imgs/g1_off.png"/> </div><div class="group"> <img src="/imgs/g2_off.png"/> </div><div class="group"> <img src="/imgs/g3_off.png"/> </div><div class="group"> <img src="/imgs/g4_off.png"/> </div>');
	tagInsert.appendTo("#contents");	
	/*<div id="contents">
		<div class="menu"> <img src="/imgs/menu1_off.png"/> </div> 
		<div class="menu"> <img src="/imgs/menu2_off.png"/> </div>
		<div class="group_clear"> Most positive groups </div>
		<div class="group"> <img src="/imgs/g1_off.png"/> </div>
		<div class="group"> <img src="/imgs/g2_off.png"/> </div>
		<div class="group"> <img src="/imgs/g3_off.png"/> </div>
		<div class="group"> <img src="/imgs/g4_off.png"/> </div>
	</div>*/

}
