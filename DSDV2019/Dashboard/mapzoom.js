var width = 500;
var height = 400;

// Create SVG
var svg = d3.select( "#map" )
    .append( "svg" )
    .attr( "width", width )
    .attr( "height", height )
	.style("border", "1px solid #000000");


var color = d3.scaleQuantize()
	//.range(["#FF00FF", "#FF00FF","	#8B008B", "#9932CC", "	#800080"]);
	.range(["Khaki","LightSalmon","LightCoral","Crimson","Red","DarkRed"]);


 
var tooltip1 = d3.select("#map").append("div") 
        .attr("class", "tooltip1")       
        .style("opacity", 0);
			




d3.csv("https://raw.githubusercontent.com/vvviet2908/DS-DV/master/covid19_province.csv", function(data) {
	//Set input domain for color scale
				color.domain([
					d3.min(data, function(d) { return d.Confirm; }), 121
					
				]);


d3.json("https://raw.githubusercontent.com/TungTh/tungth.github.io/master/data/vn-provinces.json", function(json) {
 
          for (var i = 0; i < data.length; i++) {
 //Grab state name
			var dataState = data[i].ma;
 //Grab data value, and convert from string to float
			var dataValue = parseFloat(data[i].Confirm);
			
 //Find the corresponding state inside the GeoJSON
			for (var j = 0; j < json.features.length; j++) {
			var jsonState = json.features[j].properties.Ma;
					if (parseFloat(dataState) == parseFloat(jsonState) ) {
 //Copy the data value into the JSON
					json.features[j].properties.Confirm = dataValue;
					
 //Stop looking through the JSON
			break;
		}
	}
 }
 
 
 //Bind data and create one path per GeoJSON feature
	
	var center = d3.geoCentroid(json);
	
	var scale  = 50;
	var offset = [width/2, height/2];
	//var projection = d3.geoMercator().scale(scale).center(center).translate(offset);
	//Define map projection
		//var projection = d3.geoAlbers()
			//.fitSize([width,height], json);
	var path = d3.geoPath().projection( projection); 
	
	var bounds  = d3.geoBounds(json);
    var hscale  = scale*width  / (bounds[1][0] - bounds[0][0]);
    var vscale  = scale*height / (bounds[1][1] - bounds[0][1]);
    var scale   = (hscale < vscale) ? hscale : vscale;
    
//	var offset  = [width - (bounds[0][0] + bounds[1][0])/2,
  //                      height - (bounds[0][1] + bounds[1][1])/2];

      // new projection
      
	 var projection = d3.geoMercator().center(center).scale(scale).translate(offset);
      path = path.projection(projection);
	  
	   
	   
//create legend	   
	   
svg.append("g")
  .attr("class", "legend")
  .attr("transform", "translate(20,20)")
  .attr("width", width)
  .attr("height",height);

var legend = d3.legendColor()
  .shapeWidth(30)
  .cells(5)
  .orient('vertical')
  .scale(color);

svg.select(".legend")
  .call(legend);	   
	   
	   
	   
 //Define what to do when zooming

var zooming	 = function(d) {
 //Log out d3.event, so you can see all the goodies inside
 console.log(d3.event.transform);
 //Get the current (pre-dragging) translation offset

var offset = [d3.event.transform.x, d3.event.transform.y];
 
 //Calculate new scale
 var newScale = d3.event.transform.k * 2000;

 //Update projection with new offset and scale
 projection.translate(offset)
 .scale(newScale);

 //Augment the offset, following the mouse movement
//offset[0] += d3.event.dx;
// offset[1] += d3.event.dy;
 //Update projection with new offset
// projection.translate(offset);
 //Update all paths and circles

 svg.selectAll("path")
	.attr("d", path);
 svg.selectAll("circle")
	.attr("cx", function(d) {
		return projection([d.lon, d.lat])[0];
	})
		.attr("cy", function(d) {
		return projection([d.lon, d.lat])[1];
	});
}

 
var zoom = d3.zoom()
 .on("zoom", zooming);

//The center of the country, roughly


 var map = svg.append("g")
 .attr("id", "map")
 .call(zoom) //Bind the zooming behavior 
 .call(zoom.transform, d3.zoomIdentity //Then apply the initial transform
 .translate(width/2, height/2)
 .translate(-center[0], -center[1]));
 

map.append("rect")
 .attr("x", 0)
 .attr("y", 0)
 .attr("width", width)
 .attr("height", height)
 .attr("opacity", 0);	 

var mouseover = function(d) {
d3.select(this).transition()
                .duration('200')
				.style("opacity", 1)
				.style("stroke","white")
				.style("stroke-width",3)
          	
 tooltip1.transition()
          	.duration(100)
			.style("opacity", 1)
 
 tooltip1.html("Province: " + d.properties.Ten + "<br>" + "Confirmed cases: " + d.properties.Confirm)
	.style("left", (d3.event.pageX + 10) + "px")
    .style("top", (d3.event.pageY - 15) + "px") 
	
   };
 
var mouseout = function(d) {
 d3.select(this).transition() 
	.duration('200')   
	.style("opacity", 0.9)
    .style("stroke","white")
    .style("stroke-width",0.3);

	
	
	tooltip1.transition() 
	.duration('100')   
	.style("opacity", 0)
    .style("stroke","white")
    .style("stroke-width",0.3);

   };	 
	 
 //Bind data and create one path per GeoJSON feature
 svg.selectAll("path")
	.data(json.features)
	.enter()
	.append("path")
	.attr("d", path)
	.style("fill", function(d) {
 //Get data value
			var value = d.properties.Confirm;
					if (value) {
 //If value exists…
						return color(value);
					} else {
 //If value is undefined…
						return "#ccc";
					}
		})
	.style('stroke', 'white')
    .style('stroke-width', 1.5)
    .style("opacity",0.8)
	.on('mouseover', mouseover)
	 .on("mouseout", mouseout);
})
})