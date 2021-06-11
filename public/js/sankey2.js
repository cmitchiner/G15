    
inputyear1=2002;
inputmonth1=12;

localStorage.setItem("LocalStorageYEAR", inputyear1);
localStorage.setItem("LocalStorageMONTH", inputmonth1);


// set the dimensions and margins of the graph
var margin = {top: 10, right: 50, bottom: 10, left: 50},
width = 1900 - margin.left - margin.right,
height = 750 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#sankey").append("svg")
    // .attr("width", 1400)
    // .attr("height", 600)
    .attr("viewBox", `0 0 1900 750`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    
    .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");

getSankeyData(inputyear1, inputmonth1);

// Years
var dataTime = d3.range(0, 5).map(function(d) {         ///////// TO DO: automate dates input from csv
    return new Date(1998 + d, 11, 1);
});

var sliderTime = d3
    .sliderBottom()
    .min(d3.min(dataTime))
    .max(d3.max(dataTime))
    .step(1000 * 60 * 60 * 24 * 365)
    .width(300)
    .tickFormat(d3.timeFormat('%Y'))
    .tickValues(dataTime)
    .default(new Date(2002, 12, 1)) //default is 1998
    .on('onchange', val => {
        d3.select('p#value-time').text(d3.timeFormat('%Y')(val));
        inputyear1 = parseInt(d3.timeFormat('%Y')(val));
        getSankeyData(inputyear1, inputmonth1);
        localStorage.setItem("LocalStorageYEAR", inputyear1);
        createGraph();
    });

var gTime = d3
    .select('div#slider-time')
    .append('svg')
    .attr('width', 500)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)');

gTime.call(sliderTime);

d3.select('p#value-time').text(d3.timeFormat('%Y')(sliderTime.value()));

// Months
var data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

var sliderSimple = d3
    .sliderBottom()
    .min(d3.min(data))
    .max(d3.max(data))
    .width(300)
    .tickFormat(d3.format(''))
    .step(1)
    .ticks(12)
    .default(12)
    .on('onchange', val => {
        d3.select('p#value-simple').text(d3.format('')(val));
        inputmonth1 = parseInt(d3.format('')(val));
        getSankeyData(inputyear1, inputmonth1);
        localStorage.setItem("LocalStorageMONTH", inputmonth1);
        createGraph();
    });

var gSimple = d3
    .select('div#slider-simple')
    .append('svg')
    .attr('width', 500)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)');

gSimple.call(sliderSimple);

d3.select('p#value-simple').text(d3.format('')(sliderSimple.value()));

var minEmails = 0;
var maxEmails = 500;

function getMinMax(minE, maxE)
{
    minEmails = minE;
    maxEmails = maxE;
    //console.log(minEmails,maxEmails);
    getSankeyData(inputyear1, inputmonth1);
}


function getSankeyData(YEAR, MONTH) {

    d3.json("/data/GraphInput.json", function (g) {
        
        //Filter data by date from sliders
        // var month = 12;
        // var year = 2000;
        g1 = {"nodes" : [], "links" : []}; 

        var filteredLink = g.links.filter(d => parseInt(d.date.substr(0, 4)) <= YEAR && parseInt(d.date.substr(5, 7)) <= MONTH);
        //console.log(g);
        filteredLinks1 = filteredLink.map(u => ({ source: u.source_group, target: u.sentiment}));
        //console.log(filteredLinks1);
        filteredLinks2 = filteredLink.map(u => ({ source: u.sentiment, target: u.target_group}));
        //console.log(filteredLinks2);
        filteredLinks = filteredLinks1.concat(filteredLinks2);
        
        //console.log("filteredLinks", filteredLinks);
        const groupArray = (filteredLinks = []) => {
            // create map
            let map = new Map()
            for (let i = 0; i < filteredLinks.length; i++) {
                const s = JSON.stringify(filteredLinks[i]);
                if (!map.has(s)) {
                    map.set(s, {
                        source: filteredLinks[i].source,
                        target: filteredLinks[i].target,
                        value: 1,
                    });
                } else {
                    map.get(s).value++;
                }
            }
            const res = Array.from(map.values())
            return res;
        };

        filteredNodes = g.nodes.map(u => ({name: u.group}));
        //console.log(filteredNodes);
        const groupNodes = (filteredNodes = []) => {
            // create map
            let map = new Map()
            for (let i = 0; i < filteredNodes.length; i++) {
                const s = JSON.stringify(filteredNodes[i]);
                if (!map.has(s)) {
                    map.set(s, {
                        name: filteredNodes[i].name
                    });
                }
            }

            const res = Array.from(map.values())
            //console.log(res);
            return res;
        };

        
        
        //console.log("filteredLinks", groupArray(filteredLinks));

        
        g1.links = groupArray(filteredLinks);  
        g1.nodes = groupNodes(filteredNodes);
        g1.nodes.forEach( function (w) {

            g1.nodes.push({ "name": w.name + "."});
        });
        g1.nodes.push({"name": "POSITIVE"});
        g1.nodes.push({"name": "NEUTRAL"});
        g1.nodes.push({"name": "NEGATIVE"});
        console.log("g1", g1);
        changeSankey(g1);
       // $("#slider-range").slider("values", 1);
    });
}


function changeSankey(graph) {
    

    
    var units = "Emails";

    
    // format variables
    var formatNumber = d3.format(",.0f"),    // zero decimal places
        format = function(d) { return formatNumber(d) + " " + units; },
        color = d3.scaleOrdinal(d3.schemeCategory10);



    // Set the sankey diagram properties
    var sankey = d3.sankey()
        .nodeWidth(36)
        .nodePadding(40)
        .size([width, height]);

    var path = sankey.link();

    // return only the distinct / unique nodes
    graph.nodes = d3.keys(d3.nest()
    .key(function (d) { return d.name; })
    .object(graph.nodes));

    // loop through each link replacing the text with its index from node
    graph.links.forEach(function (d, i) {
            graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
            graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
    });

    // now loop through each nodes to make nodes an array of objects
    // rather than an array of strings
    graph.nodes.forEach(function (d, i) {
    graph.nodes[i] = { "name": d };
    });

    graph.links = graph.links.filter(function (el) {
        return minEmails <= el.value && el.value <= maxEmails;
        });

    sankey
        .nodes(graph.nodes)
        .links(graph.links)
        .layout(32);

    
    svg.selectAll("*").remove(); 
    // add in the links
    var link = svg.append("g").selectAll(".link")
        .data(graph.links)
    .enter().append("path")
        .attr("class", "link")
        .attr("d", path)
        .style("stroke-width", function(d) { return Math.max(0.2, d.dy); })
        .sort(function(a, b) { return b.dy - a.dy; });

    // add the link titles
    link.append("title")
        .text(function(d) {
            return d.source.name + " → " + 
                d.target.name + "\n" + format(d.value); });

    // add in the nodes
    var node = svg.append("g").selectAll(".node")
        .data(graph.nodes)
    .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { 
            return "translate(" + d.x + "," + d.y + ")"; })
        .call(d3.drag()
        .subject(function(d) {
            return d;
        })
        .on("start", function() {
            this.parentNode.appendChild(this);
        })
        .on("drag", dragmove));

    // add the rectangles for the nodes
    node.append("rect")
        .attr("height", function(d) { return d.dy; })
        .attr("width", sankey.nodeWidth())
        .style("fill", function(d) { 
            return d.color = color(d.name.replace(/ .*/, "")); })
        .style("stroke", function(d) { 
            return d3.rgb(d.color).darker(2); })
    .append("title")
        .text(function(d) { 
            return d.name + "\n" + format(d.value); });

    // add in the title for the nodes
    node.append("text")
        .attr("x", -6)
        .attr("y", function(d) { return d.dy / 2; })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .style("fill", "white")
        .attr("transform", null)
        .text(function(d) { return d.name; })
    .filter(function(d) { return d.x < width / 2; })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");


            // the function for moving the nodes
    function dragmove(d) {
        d3.select(this)
            .attr("transform", 
                "translate(" 
                    + d.x + "," 
                    + (d.y = Math.max(
                        0, Math.min(height - d.dy, d3.event.y))
                        ) + ")");
        sankey.relayout();
        link.attr("d", path);
    }

    
}            
