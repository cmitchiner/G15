

var g1;

createGraph();

function createGraph()
{
    
    var m1 = localStorage.getItem("LocalStorageMONTH");
    var y1 = localStorage.getItem("LocalStorageYEAR");

    var MONTH = Number(m1);
    var YEAR = Number(y1);
    console.log(MONTH, YEAR);

    d3.json("/data/GraphInput.json", function (g) {
        
        //Filter data by date from sliders
        // var month = 12;
        // var year = 2000;
        g1 = {"nodes" : [], "links" : []}; 

        var filteredLinks = g.links.filter(d => parseInt(d.value.substr(0, 4)) <= YEAR && parseInt(d.value.substr(5, 7)) <= MONTH);
        filteredLinks = filteredLinks.map(u => ({ source: u.source, target: u.target}));
        console.log("filteredLinks", filteredLinks);
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
        
        console.log("filteredLinks", groupArray(filteredLinks));

        g1.nodes = g.nodes;
        g1.links = groupArray(filteredLinks);        
        console.log("g1", g1);
        changeSlider(g1, $("#slider-range").slider("values",0), $("#slider-range").slider("values",1));
       // $("#slider-range").slider("values", 1);
    });
}


    


    var slider = document.getElementById("myRange");
    var output = document.getElementById("demo");;
    output.innerHTML = slider.value;



    slider.oninput = function () {
        output.innerHTML = this.value;
        changeSlider(g1, 0, this.value);
    }