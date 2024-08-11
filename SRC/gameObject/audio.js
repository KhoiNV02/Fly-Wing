class AudioControl {
    constructor(){
        this.charge=document.getElementById('charge');
        this.flap1=document.getElementById('flap1');
        this.win=document.getElementById('win');
        this.lose=document.getElementById('lose');
        
    }
    play(sound){
        sound.currentTime=0;
        sound.play();
    }
}