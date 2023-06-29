import React from "react";
//@ts-ignore
import * as THREE from 'three';


const STLComponent: React.FC<any> = (props) => {
  const [stlRef] = React.useState(React.createRef() as React.RefObject<any>);

  React.useEffect(() => {
    const camera = new THREE.PerspectiveCamera( 70, 100 / 100, 0.01, 10 );
    camera.position.z = 1;
    
    const scene = new THREE.Scene();
    
    const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
    const material = new THREE.MeshNormalMaterial();
    
    const mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    function animation( time: any ) {

      mesh.rotation.x = time / 2000;
      mesh.rotation.y = time / 1000;
    
      renderer.render( scene, camera );
    
    }
    
    const renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animation );

    console.log(stlRef);
    stlRef.current.appendChild( renderer.domElement );
  }, []);

  return (
    <div ref={stlRef} className="stl-d3">

    </div>
  );
}

export default STLComponent;
