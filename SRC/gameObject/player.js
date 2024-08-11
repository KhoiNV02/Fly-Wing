class Player {
    constructor(game){
        this.game = game;
        this.x = 20;
        this.y;
        this.spriteWidth = 200;
        this.spriteHeight = 200;
        this.width;
        this.height;
        this.speedY;
        this.flapSpeed;
        this.collisionX=this.x;
        this.collisionY;
        this.collisionRadius;
        this.collided;
        this.energy=30;
        this.maxEnergy=this.energy*2;
        this.minEnergy=15;
        this.barSize;
        this.charging;
        this.image=document.getElementById('player_fish');
        this.frameY;
    }
    draw(){
        // this.game.ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        this.game.ctx.drawImage(this.image,0,this.frameY*this.spriteHeight,this.spriteWidth,this.spriteHeight, this.x, this.y,this.width, this.height);
        this.game.ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
        this.game.ctx.beginPath();
        this.game.ctx.arc(this.collisionX+this.collisionRadius*0.9,this.collisionY,this.collisionRadius,0,Math.PI*2);
        this.game.ctx.stroke(); 
    }
    update(){
        this.handleEnergy();
        if(this.speedY>=0) this.wingsUp();
        if (this.y+this.speedY>0)
        this.y += this.speedY;
    else
    this.y+=0;
        this.collisionY=this.y+this.height*0.5;
        if (!this.isTouchingBottom()&&!this.charging){
            this.speedY += this.game.gravity;
        }
        else
        {
            this.speedY=0;
        }
        // bottom boundary
        if (this.isTouchingBottom()){
            this.y = this.game.height - this.height;
            this.wingsIdle();
        }
    }
    resize(){
        this.width = this.spriteWidth * this.game.ratio;
        this.height = this.spriteHeight * this.game.ratio;
        this.y = this.game.height * 0.5 - this.height * 0.5;
        this.speedY = -8 * this.game.ratio;
        this.flapSpeed=5*this.game.ratio;
        this.collisionRadius=this.game.ratio*40;
        this.collisionX=this.x+this.width*0.5;
        this.collisionY=this.y+this.height*0.5;
        this.collided=false;
        this.barSize= Math.floor(5*this.game.ratio);
        this.frameY=0;
    }
    startCharge(){
        if (this.energy>=this.minEnergy&&!this.charging)
        {
            this.charging=true;
            this.game.speed = this.game.maxSpeed;
            this.game.sound.play(this.game.sound.charge);
            this.wingsCharge();
        }
        else
        {
            this.stopCharge();
        }
    }
    stopCharge(){
        this.charging=false;
        this.game.speed=this.game.minSpeed;
    }
    wingsIdle(){
        if(!this.charging)   this.frameY=0;
    }
    wingsDown(){
      if(!this.charging)  this.frameY=1;
    }
    wingsUp(){
       if(!this.charging)  this.frameY=2;
    }
    wingsCharge(){
        this.frameY=3;
    }
    isTouchingTop(){
        return this.y<=0
    }
    isTouchingBottom(){
        return this.y >= this.game.height - this.height;
    }
    handleEnergy(){
        if(this.energy<this.maxEnergy)
        this.energy+=0.1;
    if (this.charging)
        this.energy-=1;
    if (this.energy<=0)
    {
        this.energy=0;
        this.stopCharge();
    }
    }
    flap(){
        this.stopCharge();
        if(!this.isTouchingTop())
        {
        this.game.sound.play(this.game.sound.flap1);
        this.speedY-=this.flapSpeed;
        this.wingsDown();
    }
}
}