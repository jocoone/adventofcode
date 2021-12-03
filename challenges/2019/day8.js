const { countBy } = require('lodash');

const WIDTH = 25;
const HEIGHT = 6;

function createLayers(imageData, width, height) {
  const layers = [];
  let layer = [];
  for (let i = 0; i < imageData.length; i++) {
    layer.push(imageData[i]);
    if ((i + 1) % (width * height) === 0) {
      layers.push(layer);
      layer = [];
    }
  }
  return layers;
}

function A(layers) {
  let resultLayer = layers[0];
  let resultLayerZeros = 1000000;
  layers.forEach((layer) => {
    const zeros = countBy(layer, (x) => x)['0'];
    if (resultLayerZeros > zeros) {
      resultLayer = layer;
      resultLayerZeros = zeros;
    }
  });
  const count = countBy(resultLayer, (x) => x);
  const ones = count['1'];
  const twos = count['2'];
  return ones * twos;
}

function B(layers) {
  const result = [];
  for (let i = 0; i < layers[0].length; i++) {
    const pixels = layers.map((x) => x[i]).filter((x) => x != 2);
    result.push(pixels[0] == 1 ? 'x' : ' ');
  }
  let row = '\n';
  let x = 1;
  for (let i = 0; i < result.length; i++) {
    row += result[i];
    if (x === WIDTH) {
      row += '\n';
      x = 0;
    }
    x++;
  }
  return row;
}

function parse(input) {
  const imageData = input[0].split('');
  return createLayers(imageData, WIDTH, HEIGHT);
}

module.exports = {
  A,
  B,
  parse,
};
