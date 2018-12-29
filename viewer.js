var container, stats, camera, cameraTarget, scene, renderer, file;
var objects = [];

init();
animate();

function create_scene() {
  scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0x999999));
}

function create_camera() {
  camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 500);
  camera.up.set(0, 0, 1);
  camera.position.set(0, -9, 6);
  camera.add(new THREE.PointLight(0xffffff, 0.8));

  scene.add(camera);
}

function create_grid() {
  var grid = new THREE.GridHelper(25, 50, 0xffffff, 0x555555);
  grid.rotateOnAxis(new THREE.Vector3(1, 0, 0), 90 * (Math.PI/180));
  scene.add(grid);
}

function load_stl(file, x, y, z) {
  var loader = new THREE.STLLoader();
  loader.load(file, function(geometry) {
    var material = new THREE.MeshPhongMaterial({color: 0xff5533, specular: 0x111111, shininess: 200});
    var mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x, y, z);
    mesh.rotation.set(0, 0, 0);
    mesh.scale.set(.02, .02, .02);
    scene.add(mesh);
    objects.push(mesh);
  });
}

function create_renderer() {
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  container.appendChild(renderer.domElement);
}

function create_controls() {
  var orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
  orbitControls.addEventListener('change', render);
  orbitControls.target.set(0, 1.2, 2);
  orbitControls.update();

  trackballControls = new THREE.TrackballControls(camera);
  trackballControls.rotateSpeed = 1.0;
  trackballControls.zoomSpeed = 1.2;
  trackballControls.panSpeed = 0.8;
  trackballControls.noZoom = false;
  trackballControls.noPan = false;
  trackballControls.staticMoving = true;
  trackballControls.dynamicDampingFactor = 0.3;

  var dragControls = new THREE.DragControls(objects, camera, renderer.domElement);
  dragControls.addEventListener('dragstart', function() {
    orbitControls.enabled = false;
    trackballControls.enabled = false;
  });
  dragControls.addEventListener('dragend', function() {
    orbitControls.enabled = true;
    trackballControls.enabled = true;
  });
}

function reset_scene() {
  while(scene.children.length > 0){
    scene.remove(scene.children[0]);
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function handleFile(event) {
  var reader = new FileReader();
  reader.onload = function(e) {
    file = e.target.result;
    add.disabled = false;
  }
  reader.readAsDataURL(event.target.files[0]);
}

function add_stl() {
    load_stl(file, getRandomInt(10), getRandomInt(10), 0);
    animate();
}

function init() {
  container = document.getElementById('container');
  upload = document.getElementById('upload');
  upload.addEventListener('change', handleFile, false);
  add = document.getElementById('add');

  create_scene();
  create_camera();

  cameraTarget = new THREE.Vector3(0, -0.25, 0);

  create_grid();

  create_renderer();
  create_controls();

  stats = new Stats();
  container.appendChild(stats.dom);
}

function animate() {
  requestAnimationFrame(animate);

  render();
  stats.update();
}

function render() {
  camera.lookAt(cameraTarget);
  renderer.render(scene, camera);
}
