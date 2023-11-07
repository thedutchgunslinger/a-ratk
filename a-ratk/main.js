// import { RealityAccelerator, ARButton } from "ratk";
// import { MeshBasicMaterial } from "three";
// let ratk;
// const arBtn = document.querySelector("#arBtn");
// AFRAME.registerComponent("ratk", {
//   init: function () {
//     console.log("renderer 1", this.el.renderer); // OK
//     const renderer = this.el.renderer;
//     ratk = new RealityAccelerator(renderer.xr);

//     let planes = []; // Array to store the planes
//     let planeCounter = 0; // Counter to keep track of the number of planes added

//     ARButton.convertToARButton(arBtn, renderer, {
//       requiredFeatures: [
//         "anchors",
//         "plane-detection",
//         "hit-test",
//         "mesh-detection",
//         "local-floor",
//       ],
//       onUnsupported: () => {
//         arButton.style.display = "none";
//         // webLaunchButton.style.display = "block";
//       },
//     });

//     ratk.onPlaneAdded = (plane) => {
//       // get the mesh of the plane
//       const mesh = plane.planeMesh;

//       // Set the material of the mesh
//       mesh.material = new MeshBasicMaterial({
//         wireframe: false,
//         color: Math.random() * 0xffffff,
//         colorWrite: false, // Set colorWrite to false to prevent the plane from being colored by the material, this basically makes it a cloak
//       });

//       planes.push(mesh); // Store the mesh in the planes array
//       planeCounter++; // Increment the counter

//       if (planeCounter === 6) {
//         console.log("All planes have been added");

//         console.log("planes", planes);
//         planes[0].name = "floor";
//         planes[1].name = "ceiling";

//         // set the cieling to be invisble and not to "cloak"
//         planes[1].material.colorWrite = true;
//         planes[1].visible = false;

//         console.log("planes", planes[1]);

//         // const box = document.createElement("a-box");
//         // box.setAttribute("material", "src: #tiles; side: back;")
//         // box.setAttribute("width", planes[1].parent.boundingRectangleWidth);
//         // box.setAttribute("depth", planes[1].parent.boundingRectangleHeight);
//         // box.setAttribute("height", 2);
//         // box.setAttribute("scale", "0.999 0.999 0.999");
//         // box.setAttribute("position",  new THREE.Vector3(planes[1].parent.position.x, planes[1].parent.position.y + 0.5, planes[1].parent.position.z));
//         // this.el.sceneEl.appendChild(box);

//         // create a sky so its behind the cloak
//         // const sky = document.createElement("a-sky");
//         // sky.setAttribute("src", "#sky");
//         // this.el.sceneEl.appendChild(sky);

//         const skyTexture = "vr-360-wormhole-straight-through-087867058_prevstill.webp";

//         // Create a SphereGeometry for the skysphere
//         const skysphereGeometry = new THREE.SphereGeometry(500, 60, 40);

//         // Create a MeshBasicMaterial with the sky texture
//         const texture = new THREE.TextureLoader().load(skyTexture);
//         const skysphereMaterial = new THREE.MeshBasicMaterial({
//           map: texture,
//           side: THREE.BackSide,
//         });

//         // Create a Mesh with the geometry and material and add it to the scene
//         const skysphere = new THREE.Mesh(skysphereGeometry, skysphereMaterial);

//         this.el.sceneEl.object3D.add(skysphere);
//       }
//     };

//     ratk.onMeshAdded = (mesh) => {
//       const meshMesh = mesh.meshMesh;
//       meshMesh.material = new MeshBasicMaterial({
//         wireframe: false,
//         color: Math.random() * 0xffffff,
//         side: THREE.BackSide,
//       });
//     };

//     this.el.sceneEl.object3D.add(ratk.root);
//   },
//   tick: function () {
//     ratk.update();
//   },
// });


/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as THREE from 'three';


import { ARButton } from 'ratk';
import { MeshBasicMaterial } from 'three';
import { RealityAccelerator } from 'ratk';
// import { Text } from 'troika-three-text';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';

let camera, scene, renderer, controller;
/** @type {RealityAccelerator} */
let ratk;
let recoveredPersistentAnchors = false;

const planes = [];
let planeCounter = 0;

init();
animate();

function init() {
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(
		50,
		window.innerWidth / window.innerHeight,
		0.1,
		10,
	);
	camera.position.set(0, 1.6, 3);

	scene.add(new THREE.HemisphereLight(0x606060, 0x404040));

	const light = new THREE.DirectionalLight(0xffffff);
	light.position.set(1, 1, 1).normalize();
	scene.add(light);

	renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.xr.enabled = true;
	document.body.appendChild(renderer.domElement);

	const arButton = document.getElementById('ar-button');
	const webLaunchButton = document.getElementById('web-launch-button');
	webLaunchButton.onclick = () => {
		window.open(
			'https://www.oculus.com/open_url/?url=' +
				encodeURIComponent(window.location.href),
		);
	};

	ARButton.convertToARButton(arButton, renderer, {
		requiredFeatures: [
			'anchors',
			'plane-detection',
			'hit-test',
			'mesh-detection',
			'local-floor',
		],
		onUnsupported: () => {
			arButton.style.display = 'none';
			webLaunchButton.style.display = 'block';
		},
	});

	


	window.addEventListener('resize', onWindowResize);

	// RATK code
	ratk = new RealityAccelerator(renderer.xr);
 ratk.onPlaneAdded = (plane) => {
      // get the mesh of the plane
      const mesh = plane.planeMesh;

      // Set the material of the mesh
      mesh.material = new MeshBasicMaterial({
        wireframe: false,
        color: Math.random() * 0xffffff,
        colorWrite: false, // Set colorWrite to false to prevent the plane from being colored by the material, this basically makes it a cloak
      });

      planes.push(mesh); // Store the mesh in the planes array
      planeCounter++; // Increment the counter

      if (planeCounter === 6) {
        console.log("All planes have been added");

        console.log("planes", planes);
        planes[0].name = "floor";
        planes[1].name = "ceiling";

        // set the cieling to be invisble and not to "cloak"
        planes[1].material.colorWrite = true;
        planes[1].visible = false;

        console.log("planes", planes[1]);

        // const box = document.createElement("a-box");
        // box.setAttribute("material", "src: #tiles; side: back;")
        // box.setAttribute("width", planes[1].parent.boundingRectangleWidth);
        // box.setAttribute("depth", planes[1].parent.boundingRectangleHeight);
        // box.setAttribute("height", 2);
        // box.setAttribute("scale", "0.999 0.999 0.999");
        // box.setAttribute("position",  new THREE.Vector3(planes[1].parent.position.x, planes[1].parent.position.y + 0.5, planes[1].parent.position.z));
        // this.el.sceneEl.appendChild(box);

        // create a sky so its behind the cloak
        // const sky = document.createElement("a-sky");
        // sky.setAttribute("src", "#sky");
        // this.el.sceneEl.appendChild(sky);

        const skyTexture = "sky.webp";

        // Create a SphereGeometry for the skysphere
        const skysphereGeometry = new THREE.SphereGeometry(10, 40, 40);

        // Create a MeshBasicMaterial with the sky texture
        const texture = new THREE.TextureLoader().load(skyTexture);
        const skysphereMaterial = new THREE.MeshBasicMaterial({
          // color: 0x0ffff0,
          map: texture,
          side: THREE.BackSide,
        });

        // Create a Mesh with the geometry and material and add it to the scene
        const skysphere = new THREE.Mesh(skysphereGeometry, skysphereMaterial);

        scene.add(skysphere);
      }
    };
	ratk.onMeshAdded = (mesh) => {
		const meshMesh = mesh.meshMesh;
		meshMesh.material = new MeshBasicMaterial({
			wireframe: true,
			color: Math.random() * 0xffffff,
		});
		meshMesh.geometry.computeBoundingBox();
		console.log(meshMesh.geometry.boundingBox);
		// const semanticLabel = new Text();
		// meshMesh.add(semanticLabel);
		// semanticLabel.text = mesh.semanticLabel;
		// semanticLabel.anchorX = 'center';
		// semanticLabel.anchorY = 'bottom';
		// semanticLabel.fontSize = 0.1;
		// semanticLabel.color = 0x000000;
		// semanticLabel.sync();
		// semanticLabel.position.y = meshMesh.geometry.boundingBox.max.y;
		// mesh.userData.semanticLabelMesh = semanticLabel;
	};
	scene.add(ratk.root);
}



function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	renderer.setAnimationLoop(render);
}

function render() {
	if (renderer.xr.isPresenting && !recoveredPersistentAnchors) {
		setTimeout(() => {
			ratk.restorePersistentAnchors().then(() => {
				ratk.anchors.forEach((anchor) => {
					console.log(anchor);
					const geometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
					const material = new THREE.MeshBasicMaterial({ color: 0x0ffff0 });
					const cube = new THREE.Mesh(geometry, material);
					anchor.add(cube);
				});
			});
		}, 1000);

		recoveredPersistentAnchors = true;
	}



	// RATK code
	ratk.update();
	ratk.meshes.forEach((mesh) => {
		// const semanticLabel = mesh.userData.semanticLabelMesh;
		// semanticLabel.lookAt(camera.position);
	});

	renderer.render(scene, camera);
}
