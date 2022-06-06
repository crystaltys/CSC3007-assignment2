var data = {
    resource_id: '83c21090-bd19-4b54-ab6b-d999c251edcf', 
  };
$.ajax({
url: 'https://data.gov.sg/api/action/datastore_search?',
jsonp: false,
data: data,
success: function(data) {
    var pos_data = data;
    var reference_id = "#viz_tool";
    draw_histogram(reference_id, pos_data);
}
});

function update(svg,nestedYear,i,xScale,yScale,height){
    var rects = svg.selectAll("rect")
                   .data(nestedYear.get(i))
    console.log(nestedYear.get(i))
    rects.enter()
            .append("rect")
            .merge(rects)
            .transition()
            .duration(1000)
            .attr("x", function(d) {return xScale(d.level_2); })
            .attr("y", function(d) { return yScale(d.value); })
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) { return height - yScale(d.value); })
            .attr("fill", "#69b3a2")
    rects.exit().remove()

}


function draw_histogram(ref, pos_data){

    /* Parse data */
    var data_arr =  pos_data.result.records

    
    // Set the dimensions of the canvas / graph
    //The drawing code needs to reference a responsive elements dimneions
    var margin = {top: 10, right: 30, bottom: 40, left: 50},
    width = 1300 - margin.left - margin.right,
    height = 680 - margin.top - margin.bottom;


    /* Adds the svg canvas */
    var svg = d3.select(ref)
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");

    svg.append("text")
    .attr("y", 0 - margin.top)
    .attr("x",(width / 2))
    .attr("dy", "1em")
    .attr("font-weight", "bold")
    .attr("font-size", "18px")
    .style("text-anchor", "middle")
    .text("Cases Recorded for Selected Major Offences");  


    // text label for the y axis
    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em") //The dy attribute indicates a shift along the y-axis on the position of an element or its content.
    .attr("font-size", "14px")
    .style("text-anchor", "middle")
    .text("Total Number of Cases"); 

    /* Setup scales */
    // xscale = year 
    //let xScale = d3.scaleLinear()
    //               .domain(d3.extent(data_arr, function(d) { return d.year; }))
    //               .range([0, width]);
    let nestedData = d3.group(data_arr, d => d.level_2)
    let xScale = d3.scaleBand()
                   .domain(Array.from(nestedData.keys()))
                   .range([0, width])
    
    
    let yScale = d3.scaleLinear()
                   .domain([0,20000])
                   .range([height, 0]);

    // Setup axis
    let xAxis = svg.append("g")
                   .attr("transform","translate(0,"+height+")")
                   .call(d3.axisBottom(xScale));
                   //.tickFormat(d3.format('.0f')));

    let yAxis = svg.append("g")
                   .call(d3.axisLeft(yScale));


    // Set the button texts
    let nestedYear = d3.group(data_arr, d => d.year)
    var dropdown_btn = d3.select("#dropdownMenuButton")
                        .text(Array.from(nestedYear.keys()).at(-1))
    var dropdown_content = d3.select(".dropdown-menu")
                            .selectAll("a")
                            .data(Array.from(nestedYear.keys())) 
                            .enter()
                            .append("a")
                            .attr("class","dropdown-item")
                            .attr("href","#")
                            .on('click', function(d, i) {
                                dropdown_btn.text(i)
                                update(svg,nestedYear,i,xScale,yScale,height)
                            })  
                            .text(function (d) {return d;});
    update(svg,nestedYear,"2020",xScale,yScale,height)
    
    /*  Draw dataline - multi line graph */   
    // let lineGenerator = d3.line()
    //                     .x(function(d) { return xScale(d.year);})
    //                     .y(function(d) { return yScale(d.value);})
            
    // let nestedData = d3.group(data_arr, d => d.level_2)

    // let colors = ['orange','deepskyblue','green','red','blue','purple',
    //               'pink', 'lime', 'magenta','cyan'];
    // let lines = svg.append("g");
    // lines.selectAll(".line")
    //     .data(nestedData)
    //     .enter()
    //     .append("g")
    //     .append("path")
    //     .attr("class", "line")
    //     .attr("d", function(d,i) {
    //         return lineGenerator(d[1]);
    //     })
    //     .style("fill","none")
    //     .style("stroke", function(d,i) {
    //       return colors[i];
    //     })
    //     .style("opacity", .9)
    //     .style("stroke-width",2)
    //     .on("mouseover", function(d, i) {
    //     d3.select(this).style("stroke-width", 6)
    //     })
    //     .on("mouseout", function(d, i) {
    //     d3.select(this).style("stroke-width", 4)
    //});


    

    //lines.selectAll(".mylabels")
    //    .data(nestedData)
    //    .enter()
    //    .append("text")
    //      .attr("x", 920)
    //      .attr("y", function(d,i){ return 200 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
    //      .style("fill", function(d,i){ return colors[i]})
    //      .text(function(d){ return d[0]})
    //      .attr("text-anchor", "left")
    //      .style("alignment-baseline", "middle")
}