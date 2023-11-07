import { RealityAccelerator } from "ratk";
import { MeshBasicMaterial } from "three";
let ratk;

AFRAME.registerComponent("ratk", {
  init: function () {
    console.log("renderer 1", this.el.renderer); // OK
    const renderer = this.el.renderer;
    ratk = new RealityAccelerator(renderer.xr);

    let planes = []; // Array to store the planes
    let planeCounter = 0; // Counter to keep track of the number of planes added

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
        const sky = document.createElement("a-sky");
        sky.setAttribute("src", "#sky");
        this.el.sceneEl.appendChild(sky);
      }
    };

    ratk.onMeshAdded = (mesh) => {
      const meshMesh = mesh.meshMesh;
      meshMesh.material = new MeshBasicMaterial({
        wireframe: false,
        color: Math.random() * 0xffffff,
        side: THREE.BackSide,
      });
    };

    this.el.sceneEl.object3D.add(ratk.root);
  },
  tick: function () {
    ratk.update();
  },
});
