import { Scene, Vector3, AbstractMesh, AssetContainer, FreeCamera, SceneLoader, float, Skeleton, MeshBuilder, BoneIKController } from "@babylonjs/core";
import PlayerInputs from "./PlayerInputs";
import PlayerController from "./PlayerController";
import World from "./World";

class Player {
  world: World;
  camera: FreeCamera;
  playerController: PlayerController;
  playerInputs: PlayerInputs;
  avatarPath: string;
  avatarFileName: string;
  mesh: AbstractMesh;
  meshes: Array<AbstractMesh>;
  skeleton: Skeleton;
  avatarHeight: float;

  constructor(world: World, camera, avatarPath: string, avatarFileName: string) {
    // scene info
    this.world = world;
    this.camera = camera;

    // avatar info
    this.avatarPath = avatarPath;
    this.avatarFileName = avatarFileName;
    this.avatarHeight = 0.0;
    this.mesh = null;
    this.meshes = [];
    this.skeleton = null;
  }
  
  onLoadAvatarAsset(container: AssetContainer) {} // stub function

  decapitate() {
    for (let mesh of this.meshes) {
      if (mesh.name === "Wolf3D_Head" || mesh.name === "EyeRight" || mesh.name === "EyeLeft" || mesh.name === "Wolf3D_Teeth") {
        mesh.setEnabled(false);
      }
    }
  }

  calculateAvatarHeight() {
    for (let mesh of this.meshes) {
      if (mesh.name === "Wolf3D_Head" || mesh.name === "Wolf3D_Body" || mesh.name === "Wolf3D_Outfit_Bottom") {
        const boundingBox = mesh.getBoundingInfo().boundingBox;
        const minMaxDelta = boundingBox.maximum.clone().subtract(boundingBox.minimum.clone());
        this.avatarHeight += minMaxDelta.y;
        mesh.showBoundingBox = true;
      }
    }
  }

  configureIK() {
    
  }

  async init(): Promise<AssetContainer> {
    try {
      const container: AssetContainer = await SceneLoader.LoadAssetContainerAsync(
        this.avatarPath, 
        this.avatarFileName, 
        this.world.scene
      );

      this.mesh = container.meshes[0];
      this.meshes = container.meshes;
      this.skeleton = container.skeletons[0];
      
      this.calculateAvatarHeight();
      this.configureIK()

      this.playerInputs = new PlayerInputs();
      this.playerController = new PlayerController(this.camera, this.playerInputs, this.mesh);

      return container;
    } catch(error) {
      console.error(error);
      return null;
    }
  }

  update = () => {
    if (this.playerController)
      this.playerController.update();
  }
}

export default Player;