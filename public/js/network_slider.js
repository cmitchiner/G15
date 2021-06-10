
(function () {
    $("#slider-range").slider({
      range: true,
      min: 0,
      max: 101,
      values: [0, 2],
      slide: function (event, ui) {
        //changeSlider(g1, ui.values[0], ui.values[1]);
        $("#amount").val(ui.values[0] + " - " + ui.values[1]);
      }
    });
    $("#amount").val($("#slider-range").slider("values", 0) +
      " - " + $("#slider-range").slider("values", 1));
  });