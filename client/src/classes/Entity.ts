import { AbstractMesh, Mesh } from "@babylonjs/core";

class Entity {
  mesh: Mesh | AbstractMesh;
  hasRendered: boolean;

  constructor(mesh: Mesh | AbstractMesh) {
    this.mesh = mesh;
  }
}

export default Entity;