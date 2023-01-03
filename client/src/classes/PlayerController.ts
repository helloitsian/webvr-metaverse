import { AbstractMesh, float, FreeCamera, WebXRCamera, Vector3 } from "@babylonjs/core";
import PlayerInputs from "./PlayerInputs";

class PlayerController {
  camera: FreeCamera | WebXRCamera;
  cameraRotation: Vector3;
  forwardOrientation: Vector3;
  rightOrientation: Vector3;
  playerInputs: PlayerInputs;
  mesh: AbstractMesh;
  movementSpeed: float;

  constructor(camera: FreeCamera, playerInputs: PlayerInputs, mesh: AbstractMesh) {
    this.camera = camera; 
    this.cameraRotation = this.getCameraRotation();
    this.forwardOrientation = this.getForwardOrientation();
    this.rightOrientation = this.getRightOrientation();
    this.playerInputs = playerInputs;
    this.mesh = mesh;
    this.movementSpeed = .2;
  }

  getCameraRotation = () => {
    if (!this.camera)
      return Vector3.Zero();

    if (window.VrState.IN_XR)
      return this.camera.rotationQuaternion.toEulerAngles();
    return this.camera.rotation;
  }

  getForwardOrientation = () => {
    if (!this.camera)
      return Vector3.Zero();

    return this.camera.getDirection(Vector3.Forward());
  }

  getRightOrientation = () => {
    if (!this.camera)
      return Vector3.Zero();

    return this.camera.getDirection(Vector3.Right());
  }

  update = () => {
    this.cameraRotation = this.getCameraRotation();
    this.forwardOrientation = this.getForwardOrientation();
    this.rightOrientation = this.getRightOrientation();
    // rotate player mesh based of camera rotation
    const yRotation = this.cameraRotation.y;
    const degrees = yRotation * (180 / Math.PI);
    const flipped = 180 - degrees;
    const flippedRadians = flipped / (180 / Math.PI);

    this.mesh.rotation = new Vector3(0.00, -flippedRadians, 0.00);

    // handle movement
    if (this.playerInputs.isMoving) {
      const verticalInputVector = new Vector3(this.playerInputs.verticalInput, this.playerInputs.verticalInput, this.playerInputs.verticalInput);
      const horizontalInputVector = new Vector3(this.playerInputs.horizontalInput, this.playerInputs.horizontalInput, this.playerInputs.horizontalInput);
      const movementSpeedVector = new Vector3(this.movementSpeed, this.movementSpeed, this.movementSpeed);
      const moveDirection = (
        this.forwardOrientation.multiply(verticalInputVector).add(this.rightOrientation.multiply(horizontalInputVector))
      );
      this.mesh.position = this.mesh.position.add(moveDirection.multiply(movementSpeedVector));
    }
  }
}

export default PlayerController;