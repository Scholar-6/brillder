//@ts-ignore
import * as THREE from 'three';
//@ts-ignore
import {STLLoader} from "three/examples/jsm/loaders/STLLoader";
//@ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
//@ts-ignore
import Stats from 'three/examples/jsm/libs/stats.module';

export const renderStl = (el: Element, width: number, height: number) => {
  const url: any = el.getAttribute("src");

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(75, width / height, 1);
  camera.position.z = 6;

  const renderer = new THREE.WebGLRenderer();
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setSize(width, height);
  el.appendChild(renderer.domElement);
  
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enableZoom = true;


  const envTexture = new THREE.CubeTextureLoader().load([
    '/images/texture/microsoft.png',
    '/images/texture/microsoft.png',
    '/images/texture/microsoft.png',
    '/images/texture/microsoft.png',
    '/images/texture/microsoft.png',
    '/images/texture/microsoft.png'
  ]);

  const material = new THREE.MeshPhysicalMaterial({
    color: 0xb2ffc8,
    envMap: envTexture,
    metalness: 0.25,
    roughness: 0.1,
    opacity: 1.0,
    transparent: true,
    transmission: 0.99,
    clearcoat: 1.0,
    clearcoatRoughness: 0.25
  })

  const loader = new STLLoader()
  loader.load(
    url,
    function (geometry: any) {
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        var box = new THREE.Box3().setFromObject( mesh );
        box.getCenter( mesh.position ); // this re-sets the mesh position
        mesh.position.multiplyScalar( - 1 );

        console.log('box', geometry.boundingSphere);

        function setPosition(geometry: any) {
          camera.position.z = geometry.boundingSphere.radius * 1.5 + 4;
        }

        setTimeout(() => {
          console.log('box', box, geometry.boundingSphere);
          if (geometry.boundingSphere) {
            setPosition(geometry);
          } else {
            setTimeout(() => {
              if (geometry.boundingSphere) {
                setPosition(geometry);
              } else {
                setTimeout(() => {
                  if (geometry.boundingSphere) {
                    setPosition(geometry);
                  }    
                }, 1000);
              }
            }, 1000);
          }
        }, 500);
    },
    (xhr: any) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    (error: any) => {
        console.log(error);
    }
  )

  window.addEventListener('resize', onWindowResize, false);
  function onWindowResize() {
      camera.aspect = 1;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      render();
  }

  const stats = new Stats();
  el.appendChild(stats.dom);

  function render() {
    renderer.render(scene, camera);
  }

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    render();
    stats.update();
  }

  animate();
}
