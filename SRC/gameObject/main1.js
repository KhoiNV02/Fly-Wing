class Game {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.ctx = context;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.baseHeight = 720;
        this.ratio = this.height / this.baseHeight;
        this.background = new Background(this);
        this.player = new Player(this);
        this.sound = new AudioControl();
        this.obstacles = [];
        this.numberOfObstacles = 1000;
        this.gravity;
        this.speed;
        this.minSpeed;
        this.maxSpeed;
        this.score;
        this.gameOver;
        this.timer;
        this.message1;
        this.message2;
        this.touchStartX;
        this.paused = false;
        this.showStartScreen = true;
        this.showHelpScreen = false;
        this.playerNameInput = document.getElementById('playerNameInput');
        this.playerName = '';
        this.showInputBox;

        this.resize(window.innerWidth, window.innerHeight);
        this.scrollPosition = 0;
        this.leaderboard = []
        window.addEventListener('keydown', e => this.handleScroll(e));
        window.addEventListener('resize', e => {
            this.resize(e.currentTarget.innerWidth, e.currentTarget.innerHeight);
        });

        this.canvas.addEventListener('mousedown', e => {
            if(!this.gameOver)
            {
            if (this.showStartScreen || this.showHelpScreen) return;
            this.player.flap();
            }
        });

        this.canvas.addEventListener('mouseup', e => {
            if(!this.gameOver)
                {
            if (this.showStartScreen || this.showHelpScreen) return;
            this.player.wingsUp();
                }
        });

        window.addEventListener('keydown', e => {

            if (e.key.toLowerCase() === 'r') {
                this.playerNameInput.style.display = 'none';
                this.resize(window.innerWidth, window.innerHeight);
            }
            if (!this.gameOver) {
                if (e.key.toLowerCase() === 'h') {
                    this.showHelpScreen = true;
                    this.showStartScreen = false;
                }
                if (e.key === 'c') this.player.startCharge();
                if (this.showStartScreen || this.showHelpScreen) return;
                if (e.key === ' ') this.player.flap();
                if (e.key.toLowerCase() === 'p') this.togglePause();
            }
        });

        this.canvas.addEventListener('touchstart', e => {
            if (this.showStartScreen || this.showHelpScreen) return;
            this.player.flap();
            this.touchStartX = e.changedTouches[0].pageX;
        });

        this.canvas.addEventListener('touchmove', e => {
            if (!this.gameOver) {
                if (this.showStartScreen || this.showHelpScreen) return;
                if (e.changedTouches[0].pageX - this.touchStartX > 30) {
                    this.player.startCharge();
                }
            }
        });

        this.canvas.addEventListener('click', e => {
            if (this.showStartScreen) {
                this.showStartScreen = false;
            }
            if (this.showHelpScreen) {
                this.showHelpScreen = false;
            }
        });

        // Move the event listener here
        this.playerNameInput.addEventListener('keydown', e => {
            if (e.key === 'Enter' && this.showInputBox) {
                this.saveScore();
            }
        });
    }

    handleScroll(e) {
        const maxLeaderboardHeight = 200 * this.ratio;
        const entryHeight = 30 * this.ratio;
        const visibleEntries = Math.floor(maxLeaderboardHeight / entryHeight);

        if (e.key === 'ArrowUp') {
            this.scrollPosition = Math.max(this.scrollPosition - 1, 0);
        }
        if (e.key === 'ArrowDown') {
            this.scrollPosition = Math.min(this.scrollPosition + 1, Math.max(this.leaderboard.length - visibleEntries, 0));
        }
    }

    renderLeaderboard() {
        const rectX = this.width / 2 - 150 * this.ratio/0.6;
        const rectY = this.height / 2 - 120 * this.ratio/0.6;
        const rectWidth = 300 * this.ratio/0.6;
        const rectHeight = 240 * this.ratio/0.6;
        const borderRadius = 20 * this.ratio/0.6;
    
        // Draw rounded rectangle
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(rectX + borderRadius, rectY);
        this.ctx.lineTo(rectX + rectWidth - borderRadius, rectY);
        this.ctx.quadraticCurveTo(rectX + rectWidth, rectY, rectX + rectWidth, rectY + borderRadius);
        this.ctx.lineTo(rectX + rectWidth, rectY + rectHeight - borderRadius);
        this.ctx.quadraticCurveTo(rectX + rectWidth, rectY + rectHeight, rectX + rectWidth - borderRadius, rectY + rectHeight);
        this.ctx.lineTo(rectX + borderRadius, rectY + rectHeight);
        this.ctx.quadraticCurveTo(rectX, rectY + rectHeight, rectX, rectY + rectHeight - borderRadius);
        this.ctx.lineTo(rectX, rectY + borderRadius);
        this.ctx.quadraticCurveTo(rectX, rectY, rectX + borderRadius, rectY);
        this.ctx.closePath();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // Optional: background color
        this.ctx.fill();
        this.ctx.strokeStyle = 'white'; // Optional: border color
        this.ctx.lineWidth = 2 * this.ratio/0.6; // Optional: border width
        this.ctx.stroke();
        this.ctx.restore();
    
        // Rest of the leaderboard rendering
        this.ctx.save();
        this.ctx.textAlign = 'center';
        this.ctx.font = `${20 * this.ratio}/0.6px Arial`;
        this.ctx.fillStyle='white';
        this.ctx.fillText('Leaderboard', this.width / 2, this.height / 2 - 90 * this.ratio/0.6);
    
        const maxLeaderboardHeight = 200 * this.ratio/0.6;
        const entryFontSize = 20 * this.ratio/0.6;
        const entryHeight = 30 * this.ratio/0.6;
        const startY = this.height / 2 -50 * this.ratio/0.6;
    
        const visibleEntries = Math.floor(maxLeaderboardHeight / entryHeight);
    
        let leaderboardToShow = this.leaderboard.slice(this.scrollPosition, this.scrollPosition + visibleEntries);
    
        this.ctx.font = `${entryFontSize}px Arial`;
        if (leaderboardToShow.length > 0) {
            leaderboardToShow.forEach((entry, index) => {
                this.ctx.fillStyle = (entry.id ==='new') ? 'yellow' : 'white';
                this.ctx.fillText(
                    `${this.scrollPosition + index + 1}. ${entry.name}: ${entry.score} points - ${entry.time}s`,
                    this.width / 2,
                    startY + index * entryHeight
                );
            });
            
        } else {
            this.ctx.fillText('Loading leaderboard...', this.width / 2, this.height / 2);
        }
    
        this.ctx.font = `${entryFontSize}px Arial`;
        this.ctx.fillText('Press R to try again', this.width / 2, this.height / 2 + 140 * this.ratio/0.6);
        this.ctx.restore();
    }
    

    resize(width, height){
        fetch('https://fly-wing.onrender.com/getLeaderBoard')
  .then(response => response.json())
  .then(data =>{
    this.leaderboard = data.map(item =>{return {name:item.name,score:item.score,time:item.time}}); })
        this.canvas.width = width;
        this.canvas.height = height;
        this.showInputBox = false;
        this.playerNameInput.style.display='none';
        this.playerNameInput.style.top=`${this.ratio+13}%`;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.ratio = this.height / this.baseHeight;
        this.ctx.textAlign='right'
        this.ctx.lineWidth=3;
        this.gravity = 0.15 * this.ratio;
        this.speed=3*this.ratio;
        this.minSpeed=this.speed;
        this.maxSpeed=this.speed*3; 
        this.background.resize();
        this.player.resize();
        this.createObstacles();
        this.obstacles.forEach(obstacle=>{
            obstacle.resize();
        });
        this.score=0;
        this.gameOver=false;
        this.timer=0;
        this.background.image=document.getElementById('background');
        const baseWidth = 400; 
    this.playerNameInput.style.width = `${baseWidth * this.ratio}px`;
    }
    togglePause() {
        this.paused = !this.paused;
        if (this.paused) {
            this.sound.pauseAll(); 
        } else {
            this.sound.resumeAll(); 
        }
    }
    render(deltaTime){
        if (this.showStartScreen) {
            this.renderStartScreen();
            return;
        }

        if (this.showHelpScreen) {
            this.renderHelpScreen();
            return;
        }
        if (this.paused) {
            this.ctx.save();
            this.background.draw();
            this.drawStatusText();
            this.player.draw();
            this.obstacles.forEach(obstacle=>{
                 obstacle.draw();
                });
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; 
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.fillStyle = 'white';
            this.ctx.textAlign = 'center';
            this.ctx.font = '40px Arial';
            this.ctx.fillText('PAUSED', this.width / 2, this.height / 2);
            this.ctx.restore();
        }
        else
        {
     if(!this.gameOver)
        {  
            if(!this.player.charging)
            {
                this.speed = this.minSpeed + (this.maxSpeed - this.minSpeed) * (this.timer * 0.001) / 100; 
            if (this.speed>this.maxSpeed)
            {
                if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
            }
            }
     this.timer+=deltaTime;
      this.background.update();
        this.background.draw();
        this.drawStatusText();
        this.player.update();
        this.player.draw();
        this.obstacles.forEach(obstacle=>{
        obstacle.update();
         obstacle.draw();
        });
    }
    else
    {
        this.player.stopCharge();
        this.background.update();
        this.background.draw();
        this.drawStatusText();}
    }}
    createObstacles(){
        this.obstacles=[];
        const firstX=this.baseHeight*this.ratio;
        const obstacleSpacing=Math.max(200 * this.ratio, 400 * this.ratio - this.speed * 2);
        for (let i=0;i<this.numberOfObstacles;i++)
        {
            this.obstacles.push(new Obstacle(this,firstX+i*obstacleSpacing))
        }
    }
    formatTime(time)
    {
      return (time*0.001).toFixed();
    }
    drawStatusText(){
        this.ctx.save();
        this.ctx.font=`25px Arial`
        this.ctx.fillText('Score: '+ this.score,this.width-10,30);
        this.ctx.textAlign='left';
        this.ctx.fillText('Time: '+ this.formatTime(this.timer)+'s',10,30);
        if (this.gameOver)
        {   
                this.renderLeaderboard();
        }
        if (this.player.energy<=this.player.minEnergy) this.ctx.fillStyle='red';
        else
        if (this.player.energy>=this.player.maxEnergy) this.ctx.fillStyle='orangered';    
        for (let i=0;i<this.player.energy;i++)
        {
            this.ctx.fillRect(10,this.height-10-this.player.barSize*i,this.player.barSize*5, this.player.barSize);
        }
        this.ctx.restore();

    }

    checkCollision(a,b)
    {
        const dx=a.collisionX - b.collisionX;
        const dy=a.collisionY - b.collisionY;
        const distance = Math.hypot(dx,dy);
        const sumOfRadius = a.collisionRadius + b.collisionRadius;
        return distance<=sumOfRadius;
    }
   
    triggerGameOver() {
        if (!this.gameOver) {
            this.gameOver = true;
            this.showInputBox = true;
            this.sound.play(this.sound.lose);
            this.background.image=document.getElementById('backgroundEndGame');
            this.playerNameInput.style.display = 'block';
            this.playerNameInput.focus();
        }
    }
    saveScore() {
        fetch('https://fly-wing.onrender.com/getLeaderBoard')
  .then(response => response.json())
  .then(data =>{
    this.leaderboard = data.map(item =>{return {name:item.name,score:item.score,time:item.time}}); 
    this.playerName = this.playerNameInput.value.trim();
    if (this.playerName) {
        this.leaderboard.push({
            name: this.playerName,
            score: this.score,
            time: (this.timer * 0.001).toFixed(2),
            id:'new'
        });

        this.leaderboard.sort((a, b) => b.score - a.score || a.time - b.time);

        // Find the player's rank
        const playerIndex = this.leaderboard.findIndex(entry => entry.name === this.playerName);

        // Calculate the number of visible entries
        const maxLeaderboardHeight = 200 * this.ratio / 0.6;
        const entryHeight = 30 * this.ratio / 0.6;
        const visibleEntries = Math.floor(maxLeaderboardHeight / entryHeight);

        // Adjust scrollPosition to center the player's rank
        this.scrollPosition = Math.max(playerIndex - Math.floor(visibleEntries / 2), 0);
        
        this.playerNameInput.style.display = 'none';
        this.playerNameInput.value='';

        this.renderLeaderboard();
        fetch('https://fly-wing.onrender.com/saveScore', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json' // Đảm bảo rằng server nhận dữ liệu dưới dạng JSON
            },
            body: JSON.stringify({
              name:this.playerName,
              score:this.score,
              time:this.formatTime(this.timer)
            })
          })
            .catch(error => console.error('Error:', error));
          
    }
})
.catch(error => console.error('Error:', error));

  
  }
    
        

    renderStartScreen() {
        this.ctx.save();
        this.player.draw();
        this.background.draw();
        this.ctx.fillStyle = 'black';
        this.ctx.textAlign = 'center';
        this.ctx.font = '40px Arial';
        this.ctx.fillText('Welcome to the Game!', this.width / 2, this.height / 3);
        this.ctx.font = '20px Arial';
        this.ctx.fillText('Click to Start', this.width / 2, this.height / 2);
        this.ctx.fillText('Press H for Help', this.width / 2, this.height / 2 + 30);
        this.ctx.restore();
     ;
    }

    renderHelpScreen() {
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        this.ctx.font = '30px Arial';
        this.ctx.fillText('How to Play', this.width / 2, this.height / 4);
        this.ctx.font = '20px Arial';
        this.ctx.fillText('Space or Click: Flap', this.width / 2, this.height / 3);
        this.ctx.fillText('C: Charge', this.width / 2, this.height / 3 + 30);
        this.ctx.fillText('P: Pause', this.width / 2, this.height / 3 + 60);
        this.ctx.fillText('R: Reset', this.width / 2, this.height / 3 + 90);
        this.ctx.fillText('Click to Start the Game', this.width / 2, this.height / 2 + 120);
        this.ctx.restore();
    }
}

window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 720;
    canvas.height = 720;

    const game = new Game(canvas, ctx);
    let lastTime=0;
    function animate(timeStamp){
        const deltaTime=timeStamp-lastTime;
        lastTime=timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.render(deltaTime);
    //   if(!game.gameOver) 
         requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
});