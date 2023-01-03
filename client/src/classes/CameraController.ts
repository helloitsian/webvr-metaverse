import { Camera, Scene, Vector3, FreeCamera } from "@babylonjs/core";
import Player from "./Player";

class CameraController {
  scene: Scene;
  camera: FreeCamera;
  player: Player;
  
  constructor(scene: Scene, player: Player) {
    this.scene = scene;
    this.camera = this.scene.activeCamera as FreeCamera;
    this.player = player;
  }

  update() {
    // adjust position to player avatar's head
    const newCameraLocation = this.player.mesh.position.clone();
    newCameraLocation.y += this.player.avatarHeight;

    if (window.VrState.IN_XR)
      newCameraLocation.y -= .9;
    
    this.camera.position = newCameraLocation;
  }
}

export default CameraController;