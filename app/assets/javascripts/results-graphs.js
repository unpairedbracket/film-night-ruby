var nodeColors = ['#F44336', '#9C27B0', '#3F51B5', '#009688', '#FF5722', '#795548'];

function drawRunOffGraph(listOfCandidates, initialScores, changeInScores) {
  'use strict';
  var cubicBezier = {x1: 0, y1: 0.5, x2: 1, y2: 0.5, x: 1 , y: 1};

  var heightOfCount = 10;
  var heightOfChange = 100;
  var widthOfGraph = 100;

  var svgTag = '<svg id="graph" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox=" 0 0 ' + widthOfGraph + ' ' + (heightOfCount + (heightOfCount + heightOfChange) * changeInScores.length) + '">';
  var svgBody = '';
  var barProperties = [];
  var x = 0;
  var y = 0;
  var totalScore = 0;
  for (i = 0; i < listOfCandidates.length; i++) {
    totalScore = totalScore + initialScores[listOfCandidates[i]];
  }
  for (var i = 0; i < listOfCandidates.length; i++) {
    var width = widthOfGraph * initialScores[listOfCandidates[i]] / totalScore;
    barProperties.push(x);
    var rect = '<rect x="' + x + '" y="' + y + '" width="' + width + '" height="' + heightOfCount + '" fill="' + nodeColors[i % nodeColors.length] + '"/>';
    var text = '<text x="' + (x + width / 2) + '" y="' + (y + heightOfCount / 2) + '" text-anchor="middle"  fill="white"  style="alignment-baseline:central; dominant-baseline: central;font-size:' + heightOfCount / 2 + ' !important" font-family="Open Sans">' + String.fromCharCode(65 + i) + '</text>';
    x = x + width;
    svgBody = svgBody + rect + text;
  }
  y = heightOfCount;
  for (i = 0; i < changeInScores.length; i ++) {
    x = 0;
    var count = [];
    var topFlows = "";
    for (var j = 0; j < listOfCandidates.length; j++) {
      for (var k = 0; k < listOfCandidates.length; k++) {
        if (changeInScores[i][listOfCandidates[k]] && changeInScores[i][listOfCandidates[k]][listOfCandidates[j]]) {
          var deltaX = x - barProperties[k];
          var strokeWidth = widthOfGraph * changeInScores[i][listOfCandidates[k]][listOfCandidates[j]] / totalScore;
          var path = '<path opacity="0.8" stroke-width="' + strokeWidth + '" stroke="' + nodeColors[k % nodeColors.length] + '" fill="none" d="M' + (barProperties[k] + strokeWidth / 2) + ' ' + y + ' c ' + cubicBezier.x1 * deltaX + ' ' + cubicBezier.y1 * heightOfChange + ' ' + cubicBezier.x2 * deltaX + ' ' + cubicBezier.y2 * heightOfCount + ' ' + deltaX + ' ' + heightOfChange + '"/>';
          x = x + strokeWidth;
          barProperties[k] = barProperties[k] + strokeWidth;
          if (j === k) {
            svgBody = svgBody + path;
          }else {
            topFlows = topFlows + path;
          }

          if (count[j]) {
            count[j] = count[j] + changeInScores[i][listOfCandidates[k]][listOfCandidates[j]];
          }else {
            count[j] = changeInScores[i][listOfCandidates[k]][listOfCandidates[j]];
          }
        }
      }
    }
    svgBody = svgBody + topFlows;
    barProperties = [];
    y = y + heightOfChange;
    x = 0;
    for (j = 0; j < listOfCandidates.length; j++) {
      barProperties.push(x);
      if(count[j]){
        width = widthOfGraph * count[j] / totalScore;
        var rect = '<rect x="' + x + '" y="' + y + '" width="' + width + '" height="' + heightOfCount + '" fill="' + nodeColors[j % nodeColors.length] + '"/>';
        var text = '<text x="' + (x + width / 2) + '" y="' + (y + heightOfCount / 2) + '" text-anchor="middle"  fill="white"  style="alignment-baseline:central; dominant-baseline: central;font-size:' + heightOfCount / 2 + ' !important" font-family="Open Sans">' + String.fromCharCode(65 + j) + '</text>';
        x = x + width;
        svgBody = svgBody + rect + text;
      }
    }
    y = y + heightOfCount;
  }
  return svgTag + svgBody +  '</svg>';
}

function drawDirectedGraph(listOfCandidates, distances) {
  'use strict';
  var coldColor = '1B28BF';
  var warmColor = 'BF1B1B';

  var graphRadius = 100;
  var nodeRadius = 10;
  var numberOfIndicatorSquares = 10;
  var size = graphRadius / numberOfIndicatorSquares;

  var svgTag = '<svg id="graph" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="' + (-graphRadius - nodeRadius) + ' ' + (-graphRadius - nodeRadius) +  ' ' + (2 * graphRadius + 2 * nodeRadius + 3 * size + 25) + ' ' + (2 * graphRadius + 2 * nodeRadius) + '" style="overflow: visible">';
  var svgBody = '';
  var defs = '<defs>';
  var coordinates = [];
  for (var i = 0; i < listOfCandidates.length; i++) {
    var x = graphRadius * Math.sin(-i / listOfCandidates.length * 2 * Math.PI + Math.PI);
    var y = graphRadius * Math.cos(-i / listOfCandidates.length * 2 * Math.PI + Math.PI);
    coordinates.push({'x': x, 'y': y});
  }
  var min = Number.POSITIVE_INFINITY;
  var max = 0;
  for (i = 0; i < listOfCandidates.length; i++) {
    for (var j = 0; j < listOfCandidates.length; j++) {
      if (distances[i][j] >= distances[j][i] && i !== j) {
        min = Math.min(min, distances[i][j]);
        max = Math.max(max, distances[i][j]);
      }
    }
  }
  for (i = 0; i < listOfCandidates.length; i++) {
    for (var j = 0; j < listOfCandidates.length; j++) {
      if (distances[i][j] < distances[j][i]) {
        var differenceX = coordinates[i].x - coordinates[j].x;
        var differenceY = coordinates[i].y - coordinates[j].y;
        var length = Math.sqrt(differenceX * differenceX + differenceY * differenceY);
        var targetX = coordinates[j].x + differenceX * (length - 10) / length;
        var targetY = coordinates[j].y + differenceY * (length - 10) / length;
        var color = interpolateColors(coldColor, warmColor, (distances[j][i] - min) / Math.max(max - min, 1));
        var newMarker = '<marker id="arrow' + color + '" markerWidth="10" markerHeight="10" refx="6" refy="2" orient="auto" markerUnits="strokeWidth" fill="#' + color + '"><path d="M0,0 L0,4 L6,2 z"/></marker>';
        defs = defs + newMarker;
        var line = '<line x1="' + coordinates[j].x + '" y1 = "' + coordinates[j].y + '" x2="' +  targetX + '" + y2="' + targetY + '" stroke-width="2" stroke="#' + color + '" marker-end="url(#arrow' + color + ')"/>';
        svgBody = svgBody + line;
      }
    }
  }
  for (i = 0; i < listOfCandidates.length; i++) {
    var node = '<circle cx="' + coordinates[i].x + '" cy="' + coordinates[i].y + '" r="' + nodeRadius + '" fill="' + nodeColors[i % nodeColors.length] + '"/>';
    var text = '<text x="' + coordinates[i].x + '" y="' + coordinates[i].y + '" text-anchor="middle"  fill="white" font-size="' + nodeRadius * 1.5 + '" style="alignment-baseline:central; dominant-baseline: central;" font-family="Open Sans">' + String.fromCharCode(65 + i) + '</text>';
    svgBody = svgBody + node + text;
  }

  for (i = 0; i < numberOfIndicatorSquares; i++) {

    var rect = '<rect x="' + (graphRadius + nodeRadius + size) + '" y="' + (-graphRadius + i * size * 2) + '" width="' + size + '" height="' + size + '" fill="#' + interpolateColors(coldColor, warmColor, 1 - i / numberOfIndicatorSquares) + '"/>';
    var colorKey = '<text x="' + (graphRadius + nodeRadius + 3 * size) + '" y="' + (-graphRadius + i * size * 2 + size / 2) + '"font-size="' + size + '" style="alignment-baseline:central" font-family="Open Sans">' + Math.round((max - (max - min) * i / numberOfIndicatorSquares)) + '</text>';
    svgBody = svgBody + rect + colorKey;

  }
  defs = defs + '</defs>';
  return svgTag + defs + svgBody + '</svg>';
}

function interpolateColors(hex1, hex2, t) {
  if (hex1.charAt(0) === '#') {
    hex1 = hex1.substring(1);
  }
  if (hex1.length === 3) {
    hex1 = hex1.substring(0,1) + hex1.substring(0,1) + hex1.substring(1,2) + hex1.substring(1,2) + hex1.substring(2) + hex1.substring(2);
  }
  if (hex2.charAt(0) === '#') {
    hex1 = hex2.substring(1);
  }
  if (hex2.length === 3) {
    hex2 = hex2.substring(0,1) + hex2.substring(0,1) + hex2.substring(1,2) + hex2.substring(1,2) + hex2.substring(2) + hex2.substring(2);
  }
  var red = Math.round(parseInt(hex1.substring(0,2), 16) * (1 - t) + parseInt(hex2.substring(0,2),16) * t);
  var green = Math.round(parseInt(hex1.substring(2,4), 16) * (1 - t) + parseInt(hex2.substring(2,4),16) * t);
  var blue = Math.round(parseInt(hex1.substring(4), 16) * (1 - t) + parseInt(hex2.substring(4),16) * t);

  var tempHex = red.toString(16);
  var redHex = tempHex == 1 ? '0' + tempHex : tempHex;
  tempHex = green.toString(16);
  var greenHex = tempHex == 1 ? '0' + tempHex : tempHex;
  tempHex = blue.toString(16);
  var blueHex = tempHex == 1 ? '0' + tempHex : tempHex;
  return redHex + greenHex + blueHex;

}
