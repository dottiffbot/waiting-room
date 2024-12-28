// hello! this grass was modified from this awesome sketch by James Smyth. https://smythdesign.com/blog/stylized-grass-webgl/

import * as THREE from 'three'
import { gsap } from 'gsap'
import { OrbitControls }  from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'

let clouds = [], text = [];
const scene = new THREE.Scene()


const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(-0.2, 5, 10) 
camera.rotation.set(-0.1, -0.2, -0.004)
camera.setFocalLength(12.5);

const threeScene = document.querySelector('#scene')
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.setSize( window.innerWidth, window.innerHeight )
renderer.setAnimationLoop( animate )
         

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 2
renderer.outputEncoding = THREE.sRGBEncoding

threeScene.appendChild( renderer.domElement )

//controls for testing
const controls = new OrbitControls(camera, renderer.domElement);

// controls.addEventListener('change', () => {
//     console.log("camera position:", camera.position);
//     console.log("camera rotation:", camera.rotation);
// })

// hdri
new RGBELoader().load(
    '/textures/symmetrical_garden_02_1k.hdr', function (texture){
        texture.mapping = THREE.EquirectangularReflectionMapping
        scene.environment = texture
    } 
)


// gltf loader
const loader = new GLTFLoader()
loader.load(
    '/models/chair.glb',

function (gltf){
    scene.add(gltf.scene)
}
)


const cloudModels = ['/models/clouds_left.glb', '/models/clouds_right.glb']
cloudModels.forEach((cloudPath, index) => {
  loader.load(cloudPath, function(gltf) {
      const cloud = gltf.scene.clone();
      clouds.push(cloud);  
      scene.add(cloud);

      // Get visible width at the current depth (z-position)
      const visibleWidth = getVisibleWidth(camera, cloud.position.z);

      cloud.position.set(0, 0, -30)

      // // Set random initial positions for each cloud model
      cloud.position.x = (Math.random() - 0.5) * visibleWidth;
      // cloud.position.y = (Math.random() - 0.5) * 5;
      // cloud.position.z = -(Math.random() - 0.5) * 100

      // Animate cloud to move from left to right and loop back
      gsap.to(cloud.position, {
          x: "+=" + visibleWidth,    // Move the cloud to the right by one screen width
          duration: 20 + Math.random() * 4, // Randomized speed for variation
          repeat: -1,
          yoyo: true,                
          ease: "linear",            
          modifiers: {
              x: function(x) {
                  return (parseFloat(x) % (visibleWidth * 2)) - visibleWidth; // Wrap around screen width
              }
          }
      });
  });
});


// menu
const menu = document.createElement('div');
menu.className = 'menu';

document.body.appendChild(menu);

const menuButton = document.createElement('div')
menuButton.className = 'menu-button'
menuButton.textContent = "+";

menuButton.addEventListener('click', () => {
  menuButton.classList.toggle('menu-clicked');
  otherIcons.classList.toggle('visible');
})

const otherIcons = document.createElement('div');
otherIcons.className = 'other-icons'

const music = `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1689.22 1689.22">
  <defs>
    <style>
      .cls-5 {
        fill: none;
        stroke: none;
        stroke-miterlimit: 10;
        stroke-width: 80px;
      }

      .cls-6 {
        fill: #7003ff;
      }
    </style>
  </defs>
  <line class="cls-5" x1="355.61" y1="205.6" x2="1312.33" y2="1499.39"/>
  <path class="cls-6" d="M823.1,66h36.25c.4,4.04.86,7.87,1.13,11.72,2.39,33.57,8.23,66.34,21.95,97.37,12.35,27.93,30.04,51.88,52.95,72.04,48.92,43.04,96.81,87.16,140.93,135.2,33.46,36.42,63.78,75.14,87.25,118.9,21.45,39.99,37.04,82.02,44.69,126.84,5.4,31.64,5.43,63.45,2.81,95.36-2.7,32.92-8.53,65.26-17.24,97.09-.95,3.47-.16,6.08,1.24,8.98,14.68,30.3,24.85,62.02,30.3,95.26,5.28,32.2,5.51,64.55,3.16,96.97-3.04,42.01-11.88,82.82-26.06,122.49-10.85,30.35-24.77,59.25-40.92,87.13-2.45,4.24-5.25,5.94-10.03,5.59-4.97-.36-9.99-.08-15.63-.08.41-1.62.45-2.9,1.02-3.86,22.85-38.7,37.16-80.73,48.29-123.97,9.11-35.38,14.56-71.21,12.32-107.91-1.62-26.57-3.07-53.16-9.64-79.11-10.16-40.13-31.49-73.95-59.78-103.57-24.18-25.31-52.25-46.02-81.56-64.84-41.67-26.77-84.04-52.44-126.05-78.69-18.1-11.31-36.04-22.88-54.05-34.33-1.75-1.11-3.54-2.18-6.01-3.7-.39,2.25-.82,3.89-.92,5.56-.14,2.36-.04,4.74-.04,7.12,0,201.96-.36,403.92.27,605.88.15,47.34-14.7,88.46-43.73,124.83-38.5,48.23-87.95,81.23-145.84,101.86-32.77,11.68-66.55,18.45-101.45,17.13-36.73-1.39-70.54-11.89-99.09-36.05-32.19-27.23-44.62-62.41-40.18-103.73,3.87-36.01,19.74-67.16,42.32-94.67,48.56-59.17,109.71-99.33,184.14-118.63,26.65-6.91,53.76-6.74,80.92-4.84,15.77,1.1,31.35,3.58,46.56,8.23,13.97,4.26,26.75,10.72,39.31,20.79.78-12.64.28-24.07.37-35.47.09-11.34.02-22.67.02-34.01V66h.02ZM1170.98,785.33c.52-.17,1.04-.33,1.55-.5.82-13.14,1.77-26.27,2.42-39.41,1.12-22.66,1.05-45.34-1.57-67.9-4.08-35.02-15.75-67.63-33.34-98.03-32.11-55.5-72.43-104.12-122.42-144.59-47.47-38.42-98.98-70.71-151.77-101.11-1.49-.86-3.22-1.32-5.4-2.2-.11,2.47-.45,4.28-.22,6.01,1.95,14.6,2.82,29.46,6.21,43.72,20.34,85.69,65.25,156.86,129.74,216.14,21.73,19.98,44.05,39.33,65.5,59.61,40.13,37.95,76.92,78.84,106.98,125.42.66,1.02,1.54,1.9,2.32,2.84h0Z"/>
  <circle class="cls-5" cx="844.61" cy="844.61" r="804.61"/>
</svg>`
const noMusic = `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1689.22 1689.22">
  <defs>
    <style>
      .cls-3 {
        fill:  none;
        stroke: #7003ff;
        stroke-miterlimit: 10;
        stroke-width: 80px;
      }
      .cls-4{
        fill:  #7003ff;
      }
    </style>
  </defs>
  <path class="cls-4" d="M823.1,66h36.25c.4,4.04.86,7.87,1.13,11.72,2.39,33.57,8.23,66.34,21.95,97.37,12.35,27.93,30.04,51.88,52.95,72.04,48.92,43.04,96.81,87.16,140.93,135.2,33.46,36.42,63.78,75.14,87.25,118.9,21.45,39.99,37.04,82.02,44.69,126.84,5.4,31.64,5.43,63.45,2.81,95.36-2.7,32.92-8.53,65.26-17.24,97.09-.95,3.47-.16,6.08,1.24,8.98,14.68,30.3,24.85,62.02,30.3,95.26,5.28,32.2,5.51,64.55,3.16,96.97-3.04,42.01-11.88,82.82-26.06,122.49-10.85,30.35-24.77,59.25-40.92,87.13-2.45,4.24-5.25,5.94-10.03,5.59-4.97-.36-9.99-.08-15.63-.08.41-1.62.45-2.9,1.02-3.86,22.85-38.7,37.16-80.73,48.29-123.97,9.11-35.38,14.56-71.21,12.32-107.91-1.62-26.57-3.07-53.16-9.64-79.11-10.16-40.13-31.49-73.95-59.78-103.57-24.18-25.31-52.25-46.02-81.56-64.84-41.67-26.77-84.04-52.44-126.05-78.69-18.1-11.31-36.04-22.88-54.05-34.33-1.75-1.11-3.54-2.18-6.01-3.7-.39,2.25-.82,3.89-.92,5.56-.14,2.36-.04,4.74-.04,7.12,0,201.96-.36,403.92.27,605.88.15,47.34-14.7,88.46-43.73,124.83-38.5,48.23-87.95,81.23-145.84,101.86-32.77,11.68-66.55,18.45-101.45,17.13-36.73-1.39-70.54-11.89-99.09-36.05-32.19-27.23-44.62-62.41-40.18-103.73,3.87-36.01,19.74-67.16,42.32-94.67,48.56-59.17,109.71-99.33,184.14-118.63,26.65-6.91,53.76-6.74,80.92-4.84,15.77,1.1,31.35,3.58,46.56,8.23,13.97,4.26,26.75,10.72,39.31,20.79.78-12.64.28-24.07.37-35.47.09-11.34.02-22.67.02-34.01V66ZM1170.98,785.33c.52-.17,1.04-.33,1.55-.5.82-13.14,1.77-26.27,2.42-39.41,1.12-22.66,1.05-45.34-1.57-67.9-4.08-35.02-15.75-67.63-33.34-98.03-32.11-55.5-72.43-104.12-122.42-144.59-47.47-38.42-98.98-70.71-151.77-101.11-1.49-.86-3.22-1.32-5.4-2.2-.11,2.47-.45,4.28-.22,6.01,1.95,14.6,2.82,29.46,6.21,43.72,20.34,85.69,65.25,156.86,129.74,216.14,21.73,19.98,44.05,39.33,65.5,59.61,40.13,37.95,76.92,78.84,106.98,125.42.66,1.02,1.54,1.9,2.32,2.84Z"/>
  <circle class="cls-3" cx="844.61" cy="844.61" r="804.61"/>
  <line class="cls-3" x1="355.61" y1="205.6" x2="1312.33" y2="1499.39"/>
</svg>`
const audioIcon = document.createElement('div');
audioIcon.className = 'audio-icon';
audioIcon.innerHTML = music;
const audio = document.querySelector('audio')

audioIcon.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    audioIcon.innerHTML = noMusic;  
  } else {
    audio.pause();
    audioIcon.innerHTML = music;  
  }

})

const resume = document.createElement('a')
resume.textContent = 'CV'
resume.href = 'https://docs.google.com/document/d/1C8xP_UCQQ4_rMs48h6RJXycYukevY_-JXDpGtxfvE8c/edit?usp=sharing'
resume.target = '_blank'

const aboutLink = document.createElement('a')
aboutLink.textContent = 'About'
aboutLink.className = 'about-link-two'

const work = document.createElement('a')
work.textContent = 'Work'
work.href ='https://studio.teetopor.art/'
work.target = '_blank'

const archive = document.createElement('a')
archive.textContent = 'Archive'
archive.href = 'https://bozo.services'
archive.target = '_blank'

// const instagram = document.createElement('a')
// instagram.textContent = 'Instagram'
// instagram.href = 'https://instagram.com/bozobill'
// instagram.target = '_blank'


menu.appendChild(menuButton);
menu.appendChild(otherIcons);
otherIcons.appendChild(audioIcon);
otherIcons.appendChild(aboutLink);
otherIcons.appendChild(work);
otherIcons.appendChild(resume);
// otherIcons.appendChild(archive);
// otherIcons.appendChild(instagram);


// text prompts

text = [
  "Hello, welcome to the waiting room of Tee's Website.", 
  "It's nice to have you here.",
  "Please, take a seat ... make yourself... comfortable.",
  "Now then, I suppose you've come here for a reason...",
  "Would you like to visit Tee's Design Portal or Art Portal? "
];

let i = 0; 
// let arrowDelay = 8000;
const wrapper = document.createElement('div')
wrapper.className = 'wrapper-container';
threeScene.appendChild(wrapper)


const textContainer = document.createElement('div');
textContainer.className = 'container';

const devil = `<img src="/images/bitmap-icon.png"/>`
const image = document.createElement('div');
image.className = 'image';  
image.innerHTML = devil;

const welcomeText = document.createElement('div');
welcomeText.className = 'label';
welcomeText.textContent = text[i];
welcomeText.style.opacity = 1;

const arrowSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2024.11 1514.92">
  <path class="cls-1" d="M1989.44,765.4L1428.65,214.62c-73.28-71.97-197.03-20.06-197.03,82.65v1101.57c0,102.71,123.75,154.62,197.03,82.65l560.78-550.78c46.23-45.41,46.23-119.9,0-165.3Z"/>
</svg>`
const nextButton = document.createElement('div');
nextButton.className = 'next';
nextButton.style.animation = 'blinker 2s linear infinite';
nextButton.style.animationDelay= '3s';
nextButton.innerHTML = arrowSvg;

textContainer.appendChild(image);  
textContainer.appendChild(welcomeText); 
textContainer.appendChild(nextButton);
wrapper.appendChild(textContainer);


const bottomMenu = document.createElement('div');
bottomMenu.className = 'bottom-menu';
wrapper.appendChild(bottomMenu);

// view tee's design work
const designLink = document.createElement('a');
designLink.className = 'design-link';
designLink.href = 'https://studio.teetopor.art/design'
designLink.target = '_blank'
designLink.textContent = "Design Work"
designLink.style.opacity = '0';
bottomMenu.appendChild(designLink);

// view tee's art work

const artLink = document.createElement('a');
artLink.className = 'art-link';
artLink.href='https://studio.teetopor.art/art'
artLink.textContent = "Art Work"
artLink.style.opacity = '0';
bottomMenu.appendChild(artLink);

const aboutModal = document.querySelector('#about');

aboutLink.addEventListener('click', () => {
  aboutModal.classList.add('visible');
  aboutModal.classList.remove('hidden');
})
const closeAbout = document.querySelector('#escape')
closeAbout.addEventListener('click', () => {
  aboutModal.classList.add('hidden');
})


// Function to check if the last text is displayed
function checkLastText() {

  if (i === text.length -1) {
    designLink.style.opacity = '1' 
    artLink.style.opacity = '1'
    nextButton.style.opacity = '0'
    bottomMenu.style.zIndex = '10'
  } else {
    designLink.style.opacity = '0' 
    artLink.style.opacity = '0'
    nextButton.style.opacity = '1'
    nextButton.style.transition = 'opacity 1s ease-in'
    bottomMenu.style.zIndex = '0'
  }
}

welcomeText.addEventListener('click', () => {
  welcomeText.style.opacity = 0; 
  nextButton.style.opacity = 0;
  nextButton.style.animation = 'none';
  setTimeout(() => {
    i = (i + 1) % text.length; 
    welcomeText.textContent = text[i]; 
    void welcomeText.offsetWidth;
    void nextButton.offsetWidth;
    welcomeText.style.opacity = 1; 
    nextButton.style.opacity = 1;
    checkLastText();

    setTimeout(() =>{
      nextButton.style.animation= 'blinker 2s linear infinite';

    }, 2000);

  }, 500);  
});



function fadeInText() {
  setTimeout(() => {
    welcomeText.style.opacity = 1; 

  }, 500);  
}


// Parameters
const PLANE_SIZE = 20;
const BLADE_COUNT = 2500; // adjust 
const BLADE_WIDTH = 0.2; // adjust
const BLADE_HEIGHT = 0.8;
const BLADE_HEIGHT_VARIATION = 0.7;


// under plane
const floor = new THREE.CircleGeometry(PLANE_SIZE/2, PLANE_SIZE/2)
const floorMaterial = new THREE.MeshBasicMaterial({color: '#390273', side: THREE.DoubleSide})
const floorPlane = new THREE.Mesh(floor, floorMaterial)
floorPlane.rotation.x = -Math.PI / 2
floorPlane.position.y = -0.01
scene.add(floorPlane)

//shaders for grass

const vertexShader = `

varying vec2 vUv;
varying vec2 cloudUV;

varying vec3 vColor;
uniform float iTime;

void main() {
  vUv = uv;
  cloudUV = uv;
  vColor = color;
  vec3 cpos = position;

  float waveSize = 10.0f;
  float tipDistance = 0.3f;
  float centerDistance = 0.1f;

  //movement speed

  if (color.x > 0.6f) {
    cpos.x += sin((iTime / 1200.) + (uv.x * waveSize)) * tipDistance;
    // cpos.z += cos((iTime / 1500.) + (uv.x * waveSize)) * tipDistance;
  }else if (color.x > 0.0f) {
    cpos.x += sin((iTime / 1200.) + (uv.x * waveSize)) * centerDistance;
  }

  float diff = position.x - cpos.x;
  cloudUV.x += iTime / 10000.;
  cloudUV.y += iTime / 10000.;

  vec4 worldPosition = vec4(cpos, 1.);
  vec4 mvPosition = projectionMatrix * modelViewMatrix * vec4(cpos, 1.0);
  gl_Position = mvPosition;
}
`;

const fragmentShader = `
uniform sampler2D texture1;
uniform sampler2D textures[4];
uniform sampler2D normalMap;
uniform sampler2D detailTexture;
uniform float detailFactor;


varying vec2 vUv;
varying vec2 cloudUV;
varying vec3 vColor;


void main() {
  vec3 normal = texture(normalMap, vUv).rgb * 2.0 -1.0;
  normal = normalize(normal);

  float contrast = 2.0;
  float brightness = 0.02;

  vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
  float diffuse = max(dot(normal, lightDir), 0.0);
  vec3 ambient = vec3(0.1, 0.1, 0.1);

  vec3 baseColor = texture(textures[0], vUv).rgb * contrast;
  vec3 detailColor = texture(detailTexture, vUv * 2.0).rgb;


  vec3 color = mix(baseColor, detailColor, detailFactor);
  color = mix(color, texture(textures[1], cloudUV).rgb, 0.2);
  color = color + vec3(brightness, brightness, brightness);

  color = (ambient + diffuse) * color;


  gl_FragColor.rgb = color;
  gl_FragColor.a = 1.0;


}
`;

// Grass Texture
const grassTexture = new THREE.TextureLoader().load('grass.jpg');
const cloudTexture = new THREE.TextureLoader().load('cloud.jpg');
const normalMap = new THREE.TextureLoader().load('NormalMap.png');
cloudTexture.wrapS = cloudTexture.wrapT = THREE.RepeatWrapping;

// Time Uniform
const startTime = Date.now();
const timeUniform = { type: 'f', value: 0.0 };

// Grass Shader
const grassUniforms = {
  textures: { value: [grassTexture, cloudTexture] },
  normalMap: {value: normalMap},
  iTime: timeUniform
};


const grassMaterial = new THREE.ShaderMaterial({
  uniforms: grassUniforms,
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  vertexColors: true,
  side: THREE.DoubleSide
});

generateField();


// making the geometry for the grass. 
function convertRange (val, oldMin, oldMax, newMin, newMax) {
    return (((val - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin;
  }
  
  function generateField () {
    const positions = [];
    const uvs = [];
    const indices = [];
    const colors = [];
  
    for (let i = 0; i < BLADE_COUNT; i++) {
      const VERTEX_COUNT = 5;
      const surfaceMin = PLANE_SIZE / 2 * -1;
      const surfaceMax = PLANE_SIZE / 2;
      const radius = PLANE_SIZE / 2;
  
      const r = radius * Math.sqrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
  
      const pos = new THREE.Vector3(x, 0, y);
  
      const uv = [convertRange(pos.x, surfaceMin, surfaceMax, 0, 1), convertRange(pos.z, surfaceMin, surfaceMax, 0, 1)];
  
      const blade = generateBlade(pos, i * VERTEX_COUNT, uv);
      blade.verts.forEach(vert => {
        positions.push(...vert.pos);
        uvs.push(...vert.uv);
        colors.push(...vert.color);
      });
      blade.indices.forEach(indice => indices.push(indice));
    }
  
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    geom.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
    geom.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
    geom.setIndex(indices);
    geom.computeVertexNormals();

  
    const mesh = new THREE.Mesh(geom, grassMaterial);
    scene.add(mesh);
  }
  
  function generateBlade (center, vArrOffset, uv) {
    const MID_WIDTH = BLADE_WIDTH * 0.5; // Adjust this proportionally to make the middle part thicker
    const TIP_OFFSET = 0.15; // adjust this for a larger tip offset
    const height = BLADE_HEIGHT + (Math.random() * BLADE_HEIGHT_VARIATION);
  
    const yaw = Math.random() * Math.PI * 2; // where the blade twists
    const yawUnitVec = new THREE.Vector3(Math.sin(yaw), 0, -Math.cos(yaw));
    const tipBend = Math.random() * Math.PI * 2;
    const tipBendUnitVec = new THREE.Vector3(Math.sin(tipBend), 0, -Math.cos(tipBend));
  
    // Find the Bottom Left, Bottom Right, Top Left, Top right, Top Center vertex positions, increase the width of the blade
    const bl = new THREE.Vector3().addVectors(center, new THREE.Vector3().copy(yawUnitVec).multiplyScalar((BLADE_WIDTH / 2) * 1.5));
    const br = new THREE.Vector3().addVectors(center, new THREE.Vector3().copy(yawUnitVec).multiplyScalar((BLADE_WIDTH / 2) * -1.5));
    const tl = new THREE.Vector3().addVectors(center, new THREE.Vector3().copy(yawUnitVec).multiplyScalar((MID_WIDTH / 2) * 1.2));
    const tr = new THREE.Vector3().addVectors(center, new THREE.Vector3().copy(yawUnitVec).multiplyScalar((MID_WIDTH / 2) * -1.2));
    const tc = new THREE.Vector3().addVectors(center, new THREE.Vector3().copy(tipBendUnitVec).multiplyScalar(TIP_OFFSET));
  
    tl.y += height / 2;
    tr.y += height / 2;
    tc.y += height;
  
    // Vertex Colors
    const black = [0, 0, 0];
    const gray = [0.5, 0.5, 0.5];
    const white = [1.0, 1.0, 1.0];
  
    const verts = [
      { pos: bl.toArray(), uv: uv, color: black },
      { pos: br.toArray(), uv: uv, color: black },
      { pos: tr.toArray(), uv: uv, color: gray },
      { pos: tl.toArray(), uv: uv, color: gray },
      { pos: tc.toArray(), uv: uv, color: white }
    ];
  
    const indices = [
      vArrOffset,
      vArrOffset + 1,
      vArrOffset + 2,
      vArrOffset + 2,
      vArrOffset + 4,
      vArrOffset + 3,
      vArrOffset + 3,
      vArrOffset,
      vArrOffset + 2
    ];
  
    return { verts, indices };
  }

  // helper function for the clouds to animate back and forth

  function getVisibleWidth(camera, depth){
    const cameraOffset = camera.position.z;
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const heightAtDepth = 2 * Math.tan (vFov/ 2) * Math.abs(depth - cameraOffset);
    const aspect = camera.aspect;
    return heightAtDepth * aspect;

  }


  
  function animate () {
    // controls.update();
    const elapsedTime = Date.now() - startTime;
    grassUniforms.iTime.value = elapsedTime;
    window.requestAnimationFrame(animate);
    renderer.render( scene, camera );

}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
});


