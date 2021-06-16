
var simulation;
var minTest;
var maxTest;

var previousSelection3 = null;
var previousSelection4 = null;

function getPreviousSelection3()
    {
        return previousSelection3;
    }
function getPreviousSelection4()
{
    return previousSelection4;
}

var svg2 = d3.select("#networkViz")
    .append("svg")
    // .attr("width", '1900')
    // .attr("height", '750')
    .attr("viewBox", `0 0 1900 750`)
    .attr("preserveAspectRatio", "xMidYMid meet");
function changeSlider(g1, min, max) {

  $("#selectedEmail").html("Selected Node:<br> none");

  let graph = JSON.parse(JSON.stringify(g1));
  graph.links = graph.links.filter(function (el) {
    return min <= el.value && el.value <= max;
  });

  graph.nodes = graph.nodes.filter(function (el) {
    return graph.links.some(e => e.source === el.id || e.target === el.id);
  });

  svg2.selectAll("*").remove();

  var color = d3.scaleOrdinal(d3.schemeCategory20);

  simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function (d) { return d.id; }))
    .force("charge", d3.forceManyBody().strength(-69.42))
    .force("center", d3.forceCenter(width / 2, height / 2));


  var link = svg2.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
    .attr("stroke-width", function (d) { return Math.sqrt(d.value); });

  link.append("title")
    .text(function (d) { return (d.value); });

  var node = svg2.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
    .on("click", function (d){
      var previousSelection = getPreviousSelection1();
      var previousSelection2 = getPreviousSelection2();
      //console.log(d.id);
      if (previousSelection != null && previousSelection2 != null)
      {
        previousSelection.style("stroke", "#000");
        previousSelection2.attr("r", 5);
      }
      if (previousSelection3 != null && previousSelection4 != null)
      {
        svg.selectAll(".link").each(function (f,i){
          if (f.email == previousSelection3)
          {
              d3.select(this).style("stroke", "#000");
          }
      }); 
        previousSelection4.attr("r", 5);
      }
      d3.select(this).attr("r",12);
      svg.selectAll(".link").each(function (f,i){
          if (f.email == d.id)
          {
              d3.select(this).style("stroke", "#fff");
              $("#selectedEmail").html("Selected Node:<br>email: " + d.id + "<br>job: " + d.group);
              previousSelection3 = f.email;
          }
      }); 
      previousSelection4 = d3.select(this);
  })
//   .on("mouseout", function (d){

//     //console.log(d.id);
//     d3.select(this).attr("r",5);
//     svg.selectAll(".link").each(function (f,i){
//         if (f.email == d.id)
//         {
//             d3.select(this).style("stroke", "#000");
//             $("#selectedEmail").html("Selected Node:<br> none");
//         }
//     }); 
// })
    .attr("r", 5)
    .attr("fill", function (d) { return color(d.group); })
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

  node.append("title")
    .text(function (d) { return (d.id + "\n" +  d.group); });


  simulation
    .nodes(graph.nodes)
    .on("tick", ticked);

  simulation.force("link")
    .links(graph.links);


  function ticked() {
    link
      .attr("x1", function (d) { return d.source.x; })
      .attr("y1", function (d) { return d.source.y; })
      .attr("x2", function (d) { return d.target.x; })
      .attr("y2", function (d) { return d.target.y; });

    node
      .attr("cx", function (d) { return d.x = Math.max(5, Math.min(1895, d.x));})
      .attr("cy", function (d) { return d.y = Math.max(5, Math.min(745, d.y));});
  }
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}