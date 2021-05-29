var w = 800;
	var h = 400;
	var padding = 50;
			
			
	var dataset, xScale, yScale, colorScale, xAxis, yAxis;

	//For converting Dates to strings
	var formatTime = d3.timeFormat("%d/%m");
			
	var rowConverter = function(d) {
		return {
			type: d.Type,
			date: new Date(d.Date),
			//Convert from string to float
			cases: parseFloat(d.Case)
		};
	}

//import data
 d3.csv("https://raw.githubusercontent.com/vvviet2908/DS-DV/master/covid19_vietnam.csv",rowConverter, function(error, data) {
    if (error) {
	  console.log(error);
    }
    else {

	//console.log(data);
	
	var dataset = d3.nest()
					.key(function(d) { return d.type; })
					.entries(data);
	//console.log(dataset);

   
//Create scale functions
				xScale = d3.scaleTime()
							   .domain([
									d3.min(data, function(d) { return d.date; }),
									d3.max(data, function(d) { return d.date; })
								])
							   .range([padding, w]);

				yScale = d3.scaleLinear()
								.domain([
									d3.min(data, function(d) { if (d.cases >= 0) return d.cases; }) - 10,
									d3.max(data, function(d) { return d.cases; })
								])
								.range([h - padding, 0]);
								
				colorScale = d3.scaleOrdinal()
								.domain(["Confirmed", "Recovered", "New Cases"])
								.range(["#CC2027", "#128C7E", "#4267b2"]);

				//Define X axis
				xAxis = d3.axisBottom()
						   .scale(xScale)
						   .ticks(30)
						   .tickFormat(formatTime);

				//Define Y axis
				yAxis = d3.axisLeft()
						   .scale(yScale)
						   .ticks(10);

				//Define line generators
				line = d3.line()
							.x(function(d) { return xScale(d.date); })
							.y(function(d) { return yScale(+d.cases); });


  
				//Create SVG element
				var linechart = d3.select("#lineChart")
							.append("svg")
							.attr("width", w)
							.attr("height", h);

				var mouseover = function(d) {

							var xPosition = parseFloat(d3.select(this).attr("cx")) + padding;
							var yPosition = parseFloat(d3.select(this).attr("cy")) / 2 + h/ 2;

								//Update the tooltip position and value
								d3.select("#tooltip")
								.style("left", xPosition + "px")
								.style("top", yPosition + "px")						
								.select("#type")
								.text("Date: " + formatTime(d.date) + " - type: " + d.type + " - Case: " + d.cases);
						
								//Show the tooltip
								d3.select("#tooltip").classed("hidden", false);
				}


				var mouseout = function(d) {
						d3.select("#tooltip").classed("hidden", true);
				}

				//Create axis
				linechart.append("g")
					.attr("class", "axis")
					.attr("transform", "translate(0," + (h - padding) + ")")
					.call(xAxis);

				linechart.append("g")
					.attr("class", "axis")
					.attr("transform", "translate(" + padding + ",0)")
					.call(yAxis);

	
				linechart.append("text")
					.attr("text-anchor", "end")
					.attr("transform", "rotate(-90)")
					.attr("font-family", "sans-serif")
					.attr("font-size", "15px")
					.attr("y", w-1200)
					.attr("x", -20)
					.text("Total Cases");
	
				linechart.append("text")
					.attr("text-anchor", "end")
					.attr("font-family", "sans-serif")
					.attr("font-size", "15px")
					.attr("font-weight",700)
					.attr("x", 150 )
					.attr("y", h-20)
					.text("Type: ");
					
					

		 
				let lines = linechart.append('g')
								.attr('class', 'lines');
	

			legendSpace = w/dataset.length; // spacing for legend 

				// Loop through each symbol / key
		dataset.forEach(function(d,i) {                          

				linechart.append("path")
					.attr("class", "line")
					.style("stroke", function() { 
						return d.colorScale = colorScale(d.key); })
					.attr("id", 'tag'+d.key.replace(/\s+/g, '')) // assign ID
					.attr("d", line(d.values));
					
				//Create the dots on the lines
				lines.selectAll("circle-group")
					.data(dataset).enter()
					.append("g")
					.style("fill", (d, i) => colorScale(d.key))
					.selectAll("circle")
					.data(d => d.values)
					.enter()
					.append("g")
					.attr("class", "circle")  
					.append("circle")
					.attr("cx", d => xScale(d.date))
					.attr("cy", d => yScale(d.cases))
					.attr("r", 3)
					.on("mouseover", mouseover )
					.on("mouseout", mouseout );
				
				//Add the legend
				linechart.append("circle")
				.attr("cx", (legendSpace)+i*legendSpace/2-60)
				.attr("cy", h - 25) // 100 is where the first dot appears. 25 is the distance between dots
				.attr("r", 7)
				.style("fill",function() { // dynamic colours
						return d.colorScale = colorScale(d.key);});
 

				// Add the Legend
				linechart.append("text")                                   
					.attr("x", (legendSpace)+i*legendSpace/2) // spacing
					.attr("y", h - 20)         // *******
					.attr("class", "legend") 
					.attr("font-family", "sans-serif")
					.attr("font-size", "15px")			// style the legend
					.style("fill", function() { // dynamic colours
						return d.colorScale = colorScale(d.key); })       		
					.text(d.key);                                   

			});

 }});
			
