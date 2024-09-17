// hello! this grass was modified from this awesome sketch by James Smyth. https://smythdesign.com/blog/stylized-grass-webgl/

import * as THREE from 'three'
import { gsap } from 'gsap'
import { OrbitControls }  from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js'


// Parameters
const PLANE_SIZE = 30;
const BLADE_COUNT = 100000;
const BLADE_WIDTH = 0.2; // adjust
const BLADE_HEIGHT = 0.8;
const BLADE_HEIGHT_VARIATION = 0.6;

let clouds = [], text = [];


const scene = new THREE.Scene()


const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(-0.2, 5, 10) 
camera.rotation.set(-0.1, -0.2, -0.004)
camera.setFocalLength(10);

const threeScene = document.querySelector('#scene')
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.setSize( window.innerWidth, window.innerHeight )
renderer.setAnimationLoop( animate )

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize( window.innerWidth, window.innerHeight );
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
threeScene.appendChild( labelRenderer.domElement );

                

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

// cloud

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


// under plane
const floor = new THREE.CircleGeometry(PLANE_SIZE/2, PLANE_SIZE/2)
const floorMaterial = new THREE.MeshBasicMaterial({color: '#390273', side: THREE.DoubleSide})
const floorPlane = new THREE.Mesh(floor, floorMaterial)
floorPlane.rotation.x = -Math.PI / 2
floorPlane.position.y = -0.01
scene.add(floorPlane)

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


const audioIcon = document.createElement('img');
audioIcon.className = 'audio-icon';
audioIcon.src = '/images/note.svg';

const audio = document.querySelector('audio')

audioIcon.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    audioIcon.src = '/images/no-music.svg';  
  } else {
    audio.pause();
    audioIcon.src = '/images/note.svg';  
  }

})

const resume = document.createElement('a')
resume.textContent = 'CV'
resume.href = 'https://docs.google.com/document/d/12WFJXY8Y1A6OWtH0RYm7YtEvBQPnIjDBeGnILVBjL_c/edit?usp=sharing'
resume.target = '_blank'

const aboutLink2 = document.createElement('a')
aboutLink2.textContent = 'About'
aboutLink2.className = 'about-link-two'


const work = document.createElement('a')
work.textContent = 'Work'
work.href ='https://www.figma.com/proto/TQfe0qGhQjr2pyMETGBRvn/TeeTopor_DesignPortfolio_2024?page-id=337%3A2&node-id=338-510&node-type=canvas&viewport=450%2C349%2C0.03&t=KnAO1jY15wEU0cYj-1&scaling=contain&content-scaling=fixed'
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
otherIcons.appendChild(aboutLink2);
otherIcons.appendChild(work);
otherIcons.appendChild(resume);
// otherIcons.appendChild(archive);
// otherIcons.appendChild(instagram);




// text prompts

text = [
  "Hello, welcome to the waiting room of Tee's Website.", 
  "It's nice to have you here. Please, take a seat... make yourself comfortable.",
  "We'd like to invite you into Tee's Website... but it's currently undergoing some serious renovations...",
  "Unfortunately, it's a bit too unruly for guests at the moment. Our sincerest apologies for the inconvenience :-/",
  "Would you like to learn more about Tee, or view a presentation of some of their recent works while you wait?"
];

let i = 0; 

const wrapper = document.createElement('div')
wrapper.className = 'wrapper-container';
threeScene.appendChild(wrapper)


const textContainer = document.createElement('div');
textContainer.className = 'container';

const image = document.createElement('img');
image.src = '/images/bitmap-icon.png';  
image.className = 'image';  
image.style.width = '60px'; 
image.style.height = '60px';  


const welcomeText = document.createElement('div');
welcomeText.className = 'label';
welcomeText.textContent = text[i];

const nextButton = document.createElement('img');
nextButton.src='/images/arrow.svg'
nextButton.style.width = '30px'; 
nextButton.style.height = '30px';  
nextButton.className = 'next';


textContainer.appendChild(image);  
textContainer.appendChild(welcomeText); 
textContainer.appendChild(nextButton);

wrapper.appendChild(textContainer);


// const welcomeLabel = new CSS2DObject(textContainer);
// welcomeLabel.position.set(0, -5, 0);
// welcomeLabel.layers.set(0);
// scene.add(welcomeLabel);

function fadeInText() {
  welcomeText.style.opacity = 0;  
  welcomeText.style.transition = 'opacity 0.5s ease-in-out'; 
  setTimeout(() => {
    welcomeText.style.opacity = 1; 
  }, 10);  
}


const bottomMenu = document.createElement('div');
bottomMenu.className = 'bottom-menu';
wrapper.appendChild(bottomMenu);

// view tee's work
const figmaLink = document.createElement('a');
figmaLink.className = 'figma-link';
figmaLink.href = 'https://www.figma.com/proto/TQfe0qGhQjr2pyMETGBRvn/TeeTopor_DesignPortfolio_2024?page-id=337%3A2&node-id=338-510&node-type=canvas&viewport=450%2C349%2C0.03&t=KnAO1jY15wEU0cYj-1&scaling=contain&content-scaling=fixed'
figmaLink.target = '_blank'
figmaLink.textContent = "Work Samples"
figmaLink.style.opacity = '0';
bottomMenu.appendChild(figmaLink);

// about tee

const aboutLink = document.createElement('a');
aboutLink.className = 'about-link';
aboutLink.textContent = "About Tee"
aboutLink.style.opacity = '0';
bottomMenu.appendChild(aboutLink);

const aboutModal = document.querySelector('#about')
aboutLink.addEventListener('click', () => {
aboutModal.classList.add('visible');
aboutModal.classList.remove('hidden');
})
aboutLink2.addEventListener('click', () => {
  aboutModal.classList.add('visible');
  aboutModal.classList.remove('hidden');
  console.log('clicked about2')
})
const closeAbout = document.querySelector('#escape')
closeAbout.addEventListener('click', () => {
  aboutModal.classList.add('hidden');
})


// Function to check if the last text is displayed
function checkLastText() {

  if (i === text.length -1) {
    figmaLink.style.opacity = '1' 
    aboutLink.style.opacity = '1'
  } else {
    figmaLink.style.opacity = '0' 
    aboutLink.style.opacity = '0'
  }
}

welcomeText.addEventListener('click', () => {
  i = (i + 1) % text.length; 
  welcomeText.textContent = text[i];  
  // fadeInText();
  checkLastText();
  console.log('clicked');
});



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
    cpos.x += sin((iTime / 1500.) + (uv.x * waveSize)) * tipDistance;
    // cpos.z += cos((iTime / 2000.) + (uv.x * waveSize)) * tipDistance;
  }else if (color.x > 0.0f) {
    cpos.x += sin((iTime / 1500.) + (uv.x * waveSize)) * centerDistance;
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

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    labelRenderer.setSize( window.innerWidth, window.innerHeight )
  });


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
  
    const yaw = Math.random() * Math.PI * 2;
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
    labelRenderer.render( scene, camera );

}
animate();

