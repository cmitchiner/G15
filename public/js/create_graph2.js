var g1;
  d3.json("/data/enron_dataset.json", function (g) {
    g1 = g;
    changeSlider(g1, 0, 1);
  });


  var slider = document.getElementById("myRange");
  var output = document.getElementById("demo");;
  output.innerHTML = slider.value;



  slider.oninput = function () {
    output.innerHTML = this.value;
    changeSlider(g1, 0, this.value);
  }