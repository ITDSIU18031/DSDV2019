

//Width and height

			var w = 400;
			var h = 800;
	
			//Create SVG element
			var svg = d3.select("#map")
						.append("svg")
						.attr("width", w)
						.attr("height", h);
					
//var color = d3.scaleSequential()
	//		.interpolator(d3.schemeBlues)					
			var color = d3.scaleQuantize()
								.range(["Khaki","SandyBrown","LightSalmon","Salmon","DarkSalmon","LightCoral","Crimson","Red","FireBrick","DarkRed"]);
var tooltip = d3.select("#map").append("div") 
        .attr("class", "tooltip")       
        .style("opacity", 0);

d3.csv("https://raw.githubusercontent.com/vvviet2908/DS-DV/master/covid19_province.csv", function(data) {
//console.log(data)
				//Set input domain for color scale
				color.domain([
					d3.min(data, function(d) { return d.Confirm; }), 121
					//d3.max(data, function(d) { return d.Confirm; })
					//1,121
				]);

			//Load in GeoJSON data
			d3.json("https://raw.githubusercontent.com/TungTh/tungth.github.io/master/data/vn-provinces.json", function(json) {
		//console.log(json)
		
		
		//Loop through once for each ag. data value
					for (var i = 0; i < data.length; i++) {
				
						//Grab state name
						var dataProvince = data[i].ma;
						
						//Grab data value, and convert from string to float
						var dataValue = parseInt(data[i].Confirm);
				
						//Find the corresponding state inside the GeoJSON
						for (var j = 0; j < json.features.length; j++) {
						
							var jsonProvince = json.features[j].properties.Ma;
				
							if (parseInt(dataProvince) == parseInt(jsonProvince)) {
						
								//Copy the data value into the JSON
								json.features[j].properties.Confirm = dataValue;
								
								//Stop looking through the JSON
								break;
								
							}
						}		
					}




//svg.append("g")
  //.attr("class", "legend")
  //.attr("transform", "translate(20,20)")
  //.attr("width", w)
  //.attr("height",h);


		
	/*	var center = d3.geoCentroid(json)
      var scale  = 150;
      var offset = [w/2, h/2];
      var projection = d3.geoAlbers().scale(scale).center(center)
          .translate(offset);

      // create the path
      var path = d3.geoPath().projection(projection);

      // using the path determine the bounds of the current map and use 
      // these to determine better values for the scale and translation
      var bounds  = path.bounds(json);
      var hscale  = scale*w  / (bounds[1][0] - bounds[0][0]);
      var vscale  = scale*h / (bounds[1][1] - bounds[0][1]);
      var scale   = (hscale < vscale) ? hscale : vscale;
      var offset  = [w - (bounds[0][0] + bounds[1][0])/2,
                        h - (bounds[0][1] + bounds[1][1])/2];

      // new projection
      projection = d3.geoAlbers().center(center)
        .scale(scale).translate(offset);
      path = path.projection(projection); */
/*
// Create a unit projection.
var projection = d3.geoAlbers()
    .scale(1)
    .translate([0, 0]);

// Create a path generator.
var path = d3.geoPath()
    .projection(projection);

// Compute the bounds of a feature of interest, then derive scale & translate.
var b = path.bounds(json),
    s = .95 / Math.max((b[1][0] - b[0][0]) / w, (b[1][1] - b[0][1]) / h),
    t = [(w - s * (b[1][0] + b[0][0])) / 2, (h - s * (b[1][1] + b[0][1])) / 2];

// Update the projection to use computed scale & translate.
projection
    .scale(s)
    .translate(t); */
	
	  
	  
	
	
	var center = d3.geoCentroid(json);
	
	var scale  = 50;
	var offset = [width/2, height/2];
	var projection = d3.geoMercator().scale(scale).center(center).translate(offset);
	
	var path = d3.geoPath().projection( projection); 
	
	var bounds  = d3.geoBounds(json);
    var hscale  = scale*width  / (bounds[1][0] - bounds[0][0]);
    var vscale  = scale*height / (bounds[1][1] - bounds[0][1]);
    var scale   = (hscale < vscale) ? hscale : vscale;
    
	//var offset  = [width - (bounds[0][0] + bounds[1][0])/2,
      //                  height - (bounds[0][1] + bounds[1][1])/2];

      // new projection
      
	  projection = d3.geoMercator().center(center).scale(scale).translate(offset);
      path = path.projection(projection);
						
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
					   .on("mouseover", function(d) {    
            tooltip.transition()    
            .duration(200)    
            .style("opacity", .9);    
            tooltip.html("Province: " + d.properties.Ten + " - Total case: " + d.properties.Confirm)  
            .style("left", (d3.event.pageX) + "px")   
            .style("top", (d3.event.pageY - 28) + "px");  
          })          
          .on("mouseout", function(d) {   
            tooltip.transition()    
            .duration(500)    
            .style("opacity", 0); 
          });
		
  
		
			});
		})
