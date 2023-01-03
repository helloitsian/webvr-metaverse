import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import WebXRPolyfill from 'webxr-polyfill';
import CANNON from "cannon";
import { Engine, Scene, CannonJSPlugin, Vector3, MeshBuilder, WebXRDefaultExperience, WebXRState, WebXRSessionManager, FreeCamera, WebXRCamera, Color3, PointLight, HemisphericLight, ArcFollowCamera, ArcRotateCamera } from "@babylonjs/core";
import World from "./classes/World";
import Player from "./classes/Player";
import CameraController from "./classes/CameraController";

declare global {
  interface Window { VrState: any; }
}

window.VrState = {};

window.CANNON = CANNON;

// navigator.xr polyfill for iOS and Older Android Devices
if (!navigator.xr) {
  new WebXRPolyfill({
    cardboardConfig: {
      // include iPhone 14 Pro Max in dpdb list
      DPDB_URL: "https://raw.githubusercontent.com/helloitsian/webvr-polyfill-dpdb/main/dpdb.json",
    }
  });
}

class SampleWorld extends World {
  constructor(scene: Scene) {
    super("sample-world", new Vector3(0, -5, 0), scene);
  }

  initLights() {
    const pointLight = new HemisphericLight("pointLight", new Vector3(0, 1, 0), this.scene);
    //pointLight.position = new Vector3(20, 40, 20);
	  pointLight.intensity = 1;
    this.lights = [pointLight];
  }

  init() {
    const floor = MeshBuilder.CreatePlane("floor", { size: 100 })
    floor.position = new Vector3(0, -5, 0);
    floor.rotation = new Vector3(Math.PI / 2, 0, 0);
    floor.checkCollisions = true;
    this.setFloor(floor);

    const mirror = MeshBuilder.CreatePlane("mirror", { size: 100 });
    mirror.position = new Vector3(0, 0, 10);
    this.addMirror(mirror);
  }
}

class SampleWorldWithSphere extends World {
  constructor(scene: Scene) {
    super("sample-world", new Vector3(2, -5, 0), scene);
  }

  initLights() {
    this.scene.createDefaultCameraOrLight(true, true, true);
    this.lights = this.scene.lights;
  }

  init() {
    const floor = MeshBuilder.CreatePlane("floor", { size: 100 });
    floor.position = new Vector3(0, -5, 0);
    floor.rotation = new Vector3(Math.PI / 2, 0, 0);
    this.setFloor(floor);

    const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 5 });
    sphere.position = Vector3.Zero();
    this.addMesh(sphere);

    const mirror = MeshBuilder.CreatePlane("mirror", { size: 100 });
    mirror.position = new Vector3(0, 0, 10);
    this.addMirror(mirror);
  }
}

class App {
  canvas: HTMLCanvasElement;
  engine: Engine;
  scene: Scene;
  camera: FreeCamera | WebXRCamera | ArcRotateCamera;
  cameraController: CameraController;
  player: Player;
  xrHelper: WebXRDefaultExperience;
  xrSession: WebXRSessionManager;
  world: World;

  constructor() { }

  switchToXRCamera() {
    this.camera.detachControl();
    this.camera = this.xrHelper.baseExperience.camera;
    this.cameraController.camera = this.camera;
    this.player.playerController.camera = this.camera;
  }

  onXRStateChanged(state) {
    window.VrState.IN_XR = state; 
    if (state === WebXRState.IN_XR) {
      this.switchToXRCamera();
      this.player.decapitate();
    }
  }

  async createXRHelper() {
    this.xrHelper = await this.scene.createDefaultXRExperienceAsync({
      floorMeshes: [this.world.floor],
    });
    this.xrSession = this.xrHelper.baseExperience.sessionManager;
    this.xrHelper.baseExperience.onStateChangedObservable.add(this.onXRStateChanged.bind(this));
  }

  async init() {
    this.canvas = document.querySelector("canvas");
    this.engine = new Engine(this.canvas, true);

    this.scene = new Scene(this.engine);
    this.scene.enablePhysics(null, new CannonJSPlugin())

    this.world = new SampleWorld(this.scene);
    this.world.initLights();
    this.world.init();

    // this.camera = new FreeCamera("Camera", new Vector3(0, 0, 0), this.scene);
    // this.camera.fov = .5;
    // this.camera.attachControl(this.canvas, true);

    this.player = new Player(this.world, this.camera, "./assets/models/", "avatar.glb");
    const playerAssetContainer = await this.player.init();

    if (playerAssetContainer) {
      this.world.spawnPlayer(this.player);
      //this.cameraController = new CameraController(this.scene, this.player);
      console.log(this.player.skeleton);

      this.camera = new ArcRotateCamera("Camera", 1, 1, 10, new Vector3(0, -1, 1), this.scene);
      this.camera.fov = .5;
      this.camera.attachControl(this.canvas, true);
    }

    // handle initializing a XR experience
    if (navigator.xr && navigator.xr.isSessionSupported) {
      const isVRSupported = await navigator.xr.isSessionSupported("immersive-vr");
      if (isVRSupported) {
        this.createXRHelper();
      }
    }
  
    //this.scene.debugLayer.show();

    // handle player update, handle camera update
    this.scene.registerBeforeRender(() => {
      this.world.update();
      this.world._updateInternal();
      this.player.update();
      // this.cameraController.update();
    });

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
}

const app = new App();
app.init();