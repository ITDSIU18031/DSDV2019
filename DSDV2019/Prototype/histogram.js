// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;
var formatCount = d3.format(",.0f");
// append the svg object to the body of the page



var formatCount = d3.format(",.0f");
// get the data
var lab2data = [];
d3.csv("https://raw.githubusercontent.com/vvviet2908/DS-DV/master/covid19_patient.csv",function(error, data) {
	if (error) {
		console.log(error);
	}
	else {
		lab2=data;
		//console.log=(lab2);
var svg = d3.select("#histogram")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
  // X axis: scale and draw:
  var x = d3.scaleLinear()
      .domain([0, 100])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
      .range([0, width]);
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Y axis: initialization
  var y = d3.scaleLinear()
      .range([height, 0]);
  var yAxis = svg.append("g")

  // A function that builds the graph for a specific value of bin
  function update(nBin) {

    // set the parameters for the histogram
    var histogram = d3.histogram()
        .value(function(d) { return d.Age; })   // I need to give the vector of value
        .domain(x.domain())  // then the domain of the graphic
        .thresholds(x.ticks(nBin)); // then the numbers of bins

    // And apply this function to data to get the bins
    var bins = histogram(data);

    // Y axis: update now that we know the domain
    y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
    yAxis
        .transition()
        .duration(100)
        .call(d3.axisLeft(y));

    // Join the rect with the bins data
    var u = svg.selectAll("rect")
        .data(bins)

    // Manage the existing bars and eventually the new ones:
    u
        .enter()
        .append("rect") // Add a new rect for each new elements
        .merge(u) // get the already existing elements as well
        .transition() // and apply changes to all of them
        .duration(100)
          .attr("x", 1)
          .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
          .attr("width", function(d) { return x(d.x1) - x(d.x0) - 1 ; })
          .attr("height", function(d) { return height - y(d.length); })
			.attr("fill", "#CC2027");
u.append("text")
    .attr("dy", ".75em")
    .attr("y", -12)
    .attr("x", (x(data[0].dx) - x(0)) /2)
    .attr("text-anchor", "middle")
    .attr("fill", "black")
	.text(function(d) { return formatCount(d.length); });
	
    
    // If less bar in the new histogram, I delete the ones not in use anymore
	
    }


  // Initialize with 10 bins
  update(10)


  // Listen to the button -> update if user change it
  d3.select("#nBin").on("input", function() {
    update(+this.value);});	
	
		svg.append("text")
					.attr("text-anchor", "end")
					.attr("font-family", "sans-serif")
					.attr("font-size", "15px")
					.attr("font-weight",700)
					.attr("x", 300 )
					.attr("y", 10)
					.text("Age Histogram");
}});