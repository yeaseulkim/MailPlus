
/*----------------------------------------------------------------
/ Eigen factor Visualization
/ Coded by : Sungsoo (Ray) Hong (rayhong@uw.edu), Univ. of Washington
/ Last modified at: 2013.05.17
----------------------------------------------------------------*/
//variable for inner and outer
var width = 900, height = 500, radius = Math.min(width, height)/2 - 70;
var path = ["js/data_outer.csv", "js/data_inner.csv"];
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
			.on("click",function(d){if (d.data.sentiment == "positive"){draw_Group("out");}});

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
				.on("click",function(d){if (d.data.sentiment == "positive"){draw_Group("in");}});

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
	var tagInsert = $('<div id="contents"><div id="legend" class="child"><img src="imgs/legend.png" alt="legend"/></div></div>');
	/*<div id="contents">
		<div id="legend">
			<img src="imgs/legend.png" alt="legend"/>
		</div>
	</div>*/
	tagInsert.appendTo("#main-right");
}

function draw_Individual(clicked)
{
	console.log("indiv: " + clicked);

	d3.select("#contents").selectAll(".child").remove();

	var table = d3.select("#contents").append("table")
				.attr("class", "child");

	var menu = table.append("tr").append("td")
				.attr("id", "menu");

	menu.append("img")
		.attr("src", "imgs/menu1_off.png")
		.on("click", function() { draw_Group(clicked); } );

	menu.append("img")
		.attr("src", "imgs/menu2_on.png");


	var row1 = table.append("tr").append("td");	
	var row2 = table.append("tr").append("td");	

	row1.append("img")
			.attr("src", "imgs/indi1.png")
			.attr("width", "80")
			.attr("height", "80");

	row1.append("img")
			.attr("src", "imgs/indi2.png")
			.attr("width", "80")
			.attr("height", "80");

	row1.append("img")
			.attr("src", "imgs/indi3.png")
			.attr("width", "80")
			.attr("height", "80");

	row2.append("img")
			.attr("src", "imgs/indi4.png")
			.attr("width", "80")
			.attr("height", "80");

	row2.append("img")
			.attr("src", "imgs/indi5.png")
			.attr("width", "80")
			.attr("height", "80");

	row2.append("img")
			.attr("src", "imgs/indi6.png")
			.attr("width", "80")
			.attr("height", "80");


}


function group1(group)
{
	console.log(group);

	group.append("img")
		.attr("src", "imgs/email1.png");
}

function draw_Group(clicked){

	d3.select("#contents").selectAll(".child").remove();

	var table = d3.select("#contents").append("table")
				.attr("class", "child");

	var menu = table.append("tr").append("td")
				.attr("id", "menu");

	menu.append("img")
		.attr("src", "imgs/menu1_on.png");

	menu.append("img")
		.attr("src", "imgs/menu2_off.png")
		.on("click", function() { draw_Individual(clicked); } );

	var info = table.append("tr").append("td");

	if(clicked === "in")
	{
		var g1 = info.append("div");
		g1.append("img")
			.attr("src", "imgs/g1_off.png")
			.on("click", function(d) { group1(g1); });

		info.append("div")
			.append("img")
			.attr("src", "imgs/g2_off.png");

		info.append("div")
			.append("img")
			.attr("src", "imgs/g3_off.png");

		info.append("div")
			.append("img")
			.attr("src", "imgs/g4_off.png");
	}
	else
	{
		info.append("div")
			.append("img")
			.attr("src", "imgs/g3_off.png");

		info.append("div")
			.append("img")
			.attr("src", "imgs/g4_off.png");

		var g1 = info.append("div");
		g1.append("img")
			.attr("src", "imgs/g1_off.png")
			.on("click", function(d) { group1(g1); });

		info.append("div")
			.append("img")
			.attr("src", "imgs/g2_off.png");
		
	}

}
