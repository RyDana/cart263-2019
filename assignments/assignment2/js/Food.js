// Food
//
// A class to represent food, mostly just involves the ability to be
// a random size and to reset

class Food extends Agent {

  // Constructor
  //
  // Pass arguments on to the super() constructor (e.g. for Agent)
  // Also set a minimum and maximum size for this food object which it
  // will vary between when it resets
  constructor(x,y,minSize,maxSize,maxSpeed) {
    super(x,y,random(minSize,maxSize),'#55cccc');
    this.minSize = minSize;
    this.maxSize = maxSize;
    this.maxSpeed = maxSpeed;
    this.vx = random(-maxSpeed,maxSpeed);
    this.vy = random(-maxSpeed,maxSpeed);
  }

  // reset()
  //
  // Set position to a random location on the canvas
  // Set the size to a random size within the limits
  reset() {
    this.x = random(0,width);
    this.y = random(0,height);
    this.size = random(this.minSize,this.maxSize);
  }

  //update()
  //
  //Updates position of food, constraint to canvas
  //randomly chages velocity of Food
  update(){
    if(random()<0.2){
      this.vx = random(-this.maxSpeed,this.maxSpeed);
      this.vy = random(-this.maxSpeed,this.maxSpeed);
    }

    this.x += this.vx;
    this.y += this.vy;

    this.x = constrain(this.x,0,width);
    this.y = constrain(this.y,0,height);

  }
}
