class Pacman{
  constructor(pos, size, speed, dir, pac){
    this.x = pos.x;
    this.y = pos.y;
    this.w = size.w;
    this.h = size.h;
    this.speed = speed;
    this.speedX = 0;
    this.speedY = 0;
    this.dir = dir;
    this.r = false;
    this.l = false;
    this.u = false;
    this.d = false;
    this.checkArr = false;
    this.dirX = -1;
    this.dirY = -1;
    this.pac = pac;
    this.open = millis();
    this.closed = false;
  }

  update(wall){
    this.show();
    this.y += this.speedY;
    this.x += this.speedX;
    this.move(wall);
  }

  show(){
    var pac1 = this.pac.r1;
    var pac2 = this.pac.r2;
    if(this.dir === "left"){
      pac1 = this.pac.l1;
      pac2 = this.pac.l2;
    }
    if(this.dir === "up"){
      pac1 = this.pac.u1;
      pac2 = this.pac.u2;
    }
    if(this.dir === "down"){
      pac1 = this.pac.d1;
      pac2 = this.pac.d2;
    }
    if(this.dir === "right"){
      pac1 = this.pac.r1;
      pac2 = this.pac.r2;
    }
    if(this.open + 150  < millis()){
      this.closed = !this.closed;
      this.open = millis();
    }
    if(this.closed){
	    image(pac1, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    }
    else{
      image(pac2, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    }

  }

  followPath(path){

    if(path.length > 1){

      if(this.dir === "left"){
        this.dirX = -1;
      }
      if(this.dir === "right"){
        this.dirX = 1;
      }
      if(this.dir === "up"){
        this.dirY = -1;
      }
      if(this.dir === "down"){
        this.dirY = 1;
      }
      var p = this.setPos(path[path.length - 2]);
      var pos = this.getPos(this.dirX, this.dirY);


        if(path[path.length - 2].i > pos.i){
          this.r = true;
        }
        if(path[path.length - 2].i < pos.i){
          this.l = true;
        }
        if(path[path.length - 2].j > pos.j){
          this.d = true;;
        }
        if(path[path.length - 2].j < pos.j){
          this.u = true;
        }

      if(path[path.length - 2].i === pos.i && path[path.length - 2].j === pos.j){

           this.r = false;
           this.l = false;
           this.u = false;
           this.d = false;
           return true;
      }
    }
    return false;
  }

  move(wall){

    // if(this.checkWall(wall, "x") || !this.r || !this.l){
    //   this.speedX = 0;
    // }
    if(this.checkWall(wall, "x")){
      this.speedX = 0;
    }

    if(testLib.keys().r || this.r){
      this.speedX = this.speed;
      if(!this.checkWall(wall, "x")){
          this.dir = "right";
      }
      else{
          this.dir = this.moveDir("right");
      }
    }

    if(testLib.keys().l || this.l){
      this.speedX = -this.speed;
      if(!this.checkWall(wall, "x")){
        this.dir = "left";
      }
      else{
          this.dir = this.moveDir("left");
      }
    }

    if(this.checkWall(wall, "Y")){
      this.speedY = 0;
    }

    if(testLib.keys().u || this.u){
      this.speedY = -this.speed;
      if(!this.checkWall(wall, "y")){
        this.dir = "up";
      }
      else{
          this.dir = this.moveDir("up");
      }
    }

    if(testLib.keys().d || this.d){
      this.speedY = this.speed;
      if(!this.checkWall(wall, "y")){
        this.dir = "down";
      }
      else{
          this.dir = this.moveDir("down");
      }
    }
  }
  setPos(pos){
    var x = pos.i * this.w;
    var y = pos.j * this.h;
    return ({x:x, y:y, w:this.w, h:this.h});
  }
  getPos(dirX, dirY){
    // if(this.x - dirX > 0 && this.x - dirY > 0){
      var i = snap(this.x - 7 * dirX, this.w) / this.w;
      var j = snap(this.y - 7 * dirY, this.h) / this.h;
      // console.log(i);
      return {i:i, j:j};
    // }
    // return {};
  }

  moveDir(exclude){
    if(exclude != "down"){
      if(testLib.keys().d){
        return "down";
      }
    }
    if(exclude != "up"){
      if(testLib.keys().u){
        return "up";
      }
    }
    if(exclude != "left"){
      if(testLib.keys().l){
        return "left";
      }
    }
    if(exclude != "right"){
      if(testLib.keys().r){
        return "right";
      }
    }
  }

  checkArrived(target){
    var pacPos = {
      x:this.x - this.w / 2,
      y:this.y - this.h / 2,
      w:this.w,
      h:this.h
    };
    var pcOffBound = this.getOffsetBound(pacPos);
    return testLib.rectRectCol(target, pcOffBound);
  }

  checkEnd(input){
    var temp = this.setPos(input);
    var pacPos = {
      x:this.x - this.w / 2,
      y:this.y - this.h / 2,
      w:this.w,
      h:this.h
    };
    var pcOffBound = this.getOffsetBound(pacPos);

    return testLib.rectRectCol(input, pcOffBound);
  }

  checkWall(wall, xy){
    var moveAvailable = {
      l:true,
      r:true,
      u:true,
      d:true
    };
    var pacPos = {
      // x:this.x - this.w / 2,
      // y:this.y - this.h / 2,
      x:this.x - this.w / 2,
      y:this.y - this.h / 2,
      w:this.w,
      h:this.h
    };
    var pcOffBound = this.getOffsetBound(pacPos);

    for(var i = 0; i < wall.length; i++){

      if(testLib.rectRectCol(wall[i], pcOffBound)){
        if(xy === "x"){
          this.speedX = 0;
        }
        if(xy === "y"){
          this.speedY = 0;
        }
        return true;
      }
    }
    return false;
  }

  getOffsetBound(pacPosition){
    var offRect = {
      x:pacPosition.x + this.speedX,
      y:pacPosition.y + this.speedY,
      w:pacPosition.w,
      h:pacPosition.h
    };
    return offRect;
  }

  snap(val, dim){
    var snapCndidate = dim * Math.floor(val/dim);
    return snapCndidate;
  }
}
