import { IntersectionInfo, Plane, StandardMaterial, Mesh, Light, PointLight, DirectionalLight,  SpotLight, HemisphericLight, Scene, MirrorTexture, AbstractMesh, Vector3 } from "@babylonjs/core";
import Entity from "./Entity";
import Player from "./Player";

class World {
  name: string;
  spawnPoint: Vector3;
  scene: Scene;
  entities: Array<Entity> = [];
  floor: Mesh;
  mirrors: Array<Mesh> = [];
  lights: Array<Light | PointLight | DirectionalLight | SpotLight | HemisphericLight> = [];

  constructor(name: string, spawnPoint: Vector3, scene: Scene) {
    this.name = name;
    this.spawnPoint = spawnPoint;
    this.scene = scene;
  }

  addEntity = (entity: Entity) => {
    this.entities.push(entity);
  }

  addMesh = (mesh: Mesh | AbstractMesh) => {
    const entity = new Entity(mesh);
    this.addEntity(entity)
  }

  addMeshes = (meshes: Array<Mesh | AbstractMesh>) => {
    if (meshes) {
      for (let mesh of meshes) {
        this.addMesh(mesh);
      }
    }
  }

  private applyMirrorReflection = (mirrorMesh: Mesh) => {
    mirrorMesh.material = new StandardMaterial("mirrorMaterial");
    (mirrorMesh.material as any).reflectionTexture = new MirrorTexture("mirrorTexture", 1920, this.scene, true);
    (mirrorMesh.material as any).reflectionTexture.mirrorPlane = new Plane(0, -1.0, 0, -10.0);
    (mirrorMesh.material as any).reflectionTexture.mirrorPlane = Plane.FromPositionAndNormal(mirrorMesh.position, mirrorMesh.getFacetNormal(0).scale(-1));
    (mirrorMesh.material as any).reflectionTexture.renderList = [];

    return mirrorMesh;
  }

  addMirror = (mirror: Mesh) => {
    if (mirror) {
      const mirrorWithReflection = this.applyMirrorReflection(mirror);
      this.mirrors.push(mirrorWithReflection);
    }
  }

  setFloor = (floor: Mesh) => {
    if (floor) {
      this.floor = floor;
      this.addMesh(floor);
    }
  }

  spawnPlayer = (player: Player) => {
    const heightAdjustedSpawnPoint = this.spawnPoint.clone();
    heightAdjustedSpawnPoint.y += player.avatarHeight;
    player.mesh.position.copyFrom(heightAdjustedSpawnPoint);
    this.addMeshes(player.meshes);
  }

  addEntityToMirrorRenderLists(entity) {
    for (let mirror of this.mirrors) {
      (mirror.material as any).reflectionTexture.renderList.push(entity.mesh);
    }
  }

  addEntitiesToScene() {
    for (let entity of this.entities) {
      if (entity.hasRendered)
        continue;
      
      this.scene.addMesh(entity.mesh);
      this.addEntityToMirrorRenderLists(entity);
      entity.hasRendered = true;
    }
  }

  _updateInternal() {
    // add meshes to scene
    this.addEntitiesToScene();
  }

  /* stub functions */
  initLights() {}
  init() { }
  update() { }
}

export default World;