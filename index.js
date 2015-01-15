/**
 * Takes any GeoJSON object and flips all of its coordinates
 * from `[x, y]` to `[y, x]`.
 *
 * @module turf/flip
 * @param {GeoJSON} input
 * @returns {GeoJSON} output
 * @example
 * var saudiArabia = turf.point([20.56640625, 43.42100882994726]);
 * //=saudiArabia
 * var serbia = turf.flip(saudiArabia);
 * //=serbia
 */
module.exports = flipAny;

function flipAny(_) {
    // ensure that we don't modify features in-place and changes to the
    // output do not change the previous feature, including changes to nested
    // properties.
    var input = JSON.parse(JSON.stringify(_));
    switch (input.type) {
        case 'FeatureCollection':
            for (var i = 0; i < input.features.length; i++)
                flipGeometry(input.features[i].geometry);
            return input;
        case 'Feature':
            flipGeometry(input.geometry);
            return input;
        default:
            flipGeometry(input);
            return input;
    }
}

function flipGeometry(geometry) {
    var coords = geometry.coordinates;
    switch(geometry.type) {
      case 'Point':
        flip0(coords);
        break;
      case 'LineString':
      case 'MultiPoint':
        flip1(coords);
        break;
      case 'Polygon':
      case 'MultiLineString':
        flip2(coords);
        break;
      case 'MultiPolygon':
        flip3(coords);
        break;
      case 'GeometryCollection':
        geometry.geometries.forEach(flipGeometry);
        break;
    }
}

function flip0(coord) {
    coord.reverse();
}

function flip1(coords) {
  for(var i = 0; i < coords.length; i++) coords[i].reverse();
}

function flip2(coords) {
  for(var i = 0; i < coords.length; i++)
    for(var j = 0; j < coords[i].length; j++) coords[i][j].reverse();
}

function flip3(coords) {
  for(var i = 0; i < coords.length; i++)
    for(var j = 0; j < coords[i].length; j++)
      for(var k = 0; k < coords[i][j].length; k++) coords[i][j][k].reverse();
}
