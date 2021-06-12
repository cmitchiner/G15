    
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
    .width(210)
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
    .width(210)
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
var maxEmails = 1500;

function getMinMax(minE, maxE)
{
    minEmails = minE;
    maxEmails = maxE;
    //console.log(minEmails,maxEmails);
    getSankeyData(inputyear1, inputmonth1);
}
// function getSankeyData(YEAR, MONTH) {

//     d3.json("/data/GraphInput.json", function (error, g) {
        
//         //Filter data by date from sliders
//         // var month = 12;
//         // var year = 2000;
//          graph = {"nodes" : [], "links" : []}; 

//         var filteredLink = g.links.filter(d => parseInt(d.date.substr(0, 4)) <= YEAR && parseInt(d.date.substr(5, 7)) <= MONTH);
//         filteredLink.forEach(function(d)
//         {
//             graph.links.push({ "source": d.source_group,
//                              "target": d.sentiment,
//                              "value": 1,
//                              "year1": d.date.substr(0,4),
//                              "month1": d.date.substr(5,2),
//                              "email": d.source,
//                             "first": 1});
//             graph.links.push({ "source": d.sentiment,
//                             "target": d.target_group,
//                             "value": 1,
//                             "year1": d.date.substr(0,4),
//                             "month1": d.date.substr(5,2),
//                             "email": d.target,
//                             "first": 0});
//         });
//         for (let i = 0; i < graph.links.length; i++)
//         {
//             //console.log("i", i);
//             for (let j = i+1; j < graph.links.length; j++)
//             {
//                 //console.log("j", i);
//                 if (graph.links[i].email == graph.links[j].email && graph.links[i].target == graph.links[j].target && graph.links[i].first == 1 && graph.links[j].first == 1)
//                 {
//                     //add a value to i and delete graph links j
//                     graph.links[i].value++;
//                     graph.links.splice(j,1);
//                 } else if (graph.links[i].email == graph.links[j].email && graph.links[i].source == graph.links[j].source && graph.links[i].first == 0 && graph.links[j].first == 0)
//                 {
//                     graph.links[i].value++;
//                     graph.links.splice(j,1);
//                 } 
//             }
//         }
//         for (let i = 0; i < graph.links.length; i++)
//         {
//                 graph.nodes.push({"name": graph.links[i].source});
//                 graph.nodes.push({"name": graph.links[i].target});
//         }


//         //graph.nodes = groupNodes(graph.nodes);
//         console.log(graph);
//        changeSankey(graph);
//     });
// }


function getSankeyData(YEAR, MONTH) {

    d3.json("/data/GraphInput.json", function (g) {
        
        //Filter data by date from sliders
        // var month = 12;
        // var year = 2000;
        graph = {"nodes" : [], "links" : []}; 

        var filteredLink = g.links.filter(d => parseInt(d.date.substr(0, 4)) <= YEAR && parseInt(d.date.substr(5, 2)) <= MONTH);
        //console.log(g);
        filteredLinks1 = filteredLink.map(u => ({ source: u.source_group, email: u.source, target: u.sentiment}));
        //console.log(filteredLinks1);
        filteredLinks2 = filteredLink.map(u => ({ source: u.sentiment, email: u.target, target: u.target_group}));
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
                        email: filteredLinks[i].email,
                        value: 1,
                    });
                } else {
                    map.get(s).value++;
                }
            }
            const res = Array.from(map.values())
            return res;
        };
        graph.links = groupArray(filteredLinks);
        graph.links = graph.links.filter(function (el) {
            return minEmails <= el.value && el.value <= maxEmails;
            });  
        for (let i = 0; i < graph.links.length; i++)
        {
                graph.nodes.push({"name": graph.links[i].source});
                graph.nodes.push({"name": graph.links[i].target});
        }

        
        //console.log("graph", graph);
        changeSankey(graph);
       // $("#slider-range").slider("values", 1);

       //optimise by filtering dates afterwords?????
    });
}


function changeSankey(graph) {
    

    
    var units = "Emails";

    graph.links = graph.links.filter(function (el) {
        return minEmails <= el.value && el.value <= maxEmails;
        });

    
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
        .on("mouseover", function (d,i){

            svg2.selectAll("circle").each(function (f,i){
                if (f.id == d.email)
                {
                    d3.select(this).attr("r",10);
                    $("#selectedEmail").html("Selected Node:<br>email: " + d.email + "<br>job: " + f.group);
                }
            }); 
        })
        .on("mouseout", function (d,i){

            svg2.selectAll("circle").each(function (f,i){
                if (f.id == d.email)
                {
                    d3.select(this).attr("r",5);
                    $("#selectedEmail").html("Selected Node:<br> none");
                }
            }); 
        })
        .attr("d", path)
        .style("stroke-width", function(d) { return Math.max(0.2, d.dy); })
        .sort(function(a, b) { return b.dy - a.dy; });

    // add the link titles
    link.append("title")
        .text(function(d) {
            return d.email  + "\n" + format(d.value); })
        


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
