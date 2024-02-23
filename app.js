// app.js
const THREE = require('three');
const { loader } = require('ami.js');

const files = [
  'https://RandomMan0880.github.io/WUSTL-DLPTED/6314_3Dlow (1).nii'
];

const promises = [];
const seriesContainer = [];

// Load NIfTI files
files.forEach(function(url) {
  const series = loader.load(url);
  promises.push(series);
  seriesContainer.push(series);
});

Promise.all(promises).then(function(series) {
  const stackHelper = series[0].stackHelper;

  const container = document.getElementById('gl');
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  container.appendChild(renderer.domElement);

  const controls = new AMI.TrackballOrthoControl(stackHelper.slice);
  stackHelper.slice.canvas = renderer.domElement;
  controls.staticMoving = true;
  controls.noRotate = true;
  stackHelper.slice.canvas.addEventListener('dblclick', (event) => {
    event.preventDefault();
    controls.reset();
  });

  function resize() {
    const pixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(pixelRatio);
    stackHelper.slice.camera.canvas = {
      width: container.clientWidth,
      height: container.clientHeight,
    };
    stackHelper.slice.renderer = renderer;
  }
  window.addEventListener('resize', resize, false);
  setTimeout(() => {
    resize();
    stackHelper.index = Math.floor(stackHelper.orientationMaxIndex / 2);
  }, 100);

  function animate() {
    controls.update();
    renderer.render(stackHelper.slice.scene, stackHelper.slice.camera);
    requestAnimationFrame(function() {
      animate();
    });
  }

  animate();
}).catch((error) => {
  console.error('Error loading NIfTI files:', error);
});
