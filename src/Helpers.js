export const componentToHex = (c) => {
  let hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
};

export const rgbToHex = (r, g, b) => {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

export const rgbaToHex = (r, g, b, a) => {
  var outParts = [
    r.toString(16),
    g.toString(16),
    b.toString(16),
    Math.round(a * 255)
      .toString(16)
      .substring(0, 2),
  ];

  // Pad single-digit output values
  outParts.forEach(function (part, i) {
    if (part.length === 1) {
      outParts[i] = "0" + part;
    }
  });

  return "#" + outParts.join("");
};

var sortColors = function (colors) {
  for (var c = 0; c < colors.length; c++) {
    /* Get the hex value without hash symbol. */
    var hex = colors[c].hex.substring(1);

    /* Get the RGB values to calculate the Hue. */
    var r = parseInt(hex.substring(0, 2), 16) / 255;
    var g = parseInt(hex.substring(2, 4), 16) / 255;
    var b = parseInt(hex.substring(4, 6), 16) / 255;

    /* Getting the Max and Min values for Chroma. */
    var max = Math.max.apply(Math, [r, g, b]);
    var min = Math.min.apply(Math, [r, g, b]);

    /* Variables for HSV value of hex color. */
    var chr = max - min;
    var hue = 0;
    var val = max;
    var sat = 0;

    if (val > 0) {
      /* Calculate Saturation only if Value isn't 0. */
      sat = chr / val;
      if (sat > 0) {
        if (r == max) {
          hue = 60 * ((g - min - (b - min)) / chr);
          if (hue < 0) {
            hue += 360;
          }
        } else if (g == max) {
          hue = 120 + 60 * ((b - min - (r - min)) / chr);
        } else if (b == max) {
          hue = 240 + 60 * ((r - min - (g - min)) / chr);
        }
      }
    }

    /* Modifies existing objects by adding HSV values. */
    colors[c].hue = hue;
    colors[c].sat = sat;
    colors[c].val = val;
  }

  /* Sort by Hue. */
  return colors.sort(function (a, b) {
    return a.hue - b.hue;
  });
};
