class PlayerInputs {
  isMoving: boolean;
  wDown: boolean;
  aDown: boolean;
  sDown: boolean;
  dDown: boolean;

  horizontalInput: number;
  verticalInput: number;

  constructor() {
    this.isMoving = false;
    this.wDown = false;
    this.aDown = false;
    this.sDown = false;
    this.dDown = false;

    this.horizontalInput = 0;
    this.verticalInput = 0;

    document.addEventListener("keydown", (event: KeyboardEvent) => {
      const { key } = event;
      switch(key.toLowerCase()) {
        case "w":
          this.isMoving = true;
          this.wDown = true;
          this.verticalInput = 1;
        break;
        case "a":
          this.isMoving = true;
          this.aDown = true;
          this.horizontalInput = -1;
        break;
        case "s":
          this.isMoving = true;
          this.sDown = true;
          this.verticalInput = -1;
        break;
        case "d":
          this.isMoving = true;
          this.dDown = true;
          this.horizontalInput = 1;
        break;
      }

      const {
        wDown,
        aDown,
        sDown,
        dDown,
      } = this;
    });

    document.addEventListener("keyup", (event: KeyboardEvent) => {
      const { key } = event;
      switch(key.toLowerCase()) {
        case "w":
          this.wDown = false;
          this.verticalInput = 0;
        break;
        case "a":
          this.aDown = false;
          this.horizontalInput = 0;
        break;
        case "s":
          this.sDown = false;
          this.verticalInput = 0;
        break;
        case "d":
          this.dDown = false;
          this.horizontalInput = 0;
        break;
      }

      if (!this.wDown && !this.aDown && !this.sDown && !this.dDown)
        this.isMoving = false;
    });

    
  }
}

export default PlayerInputs;