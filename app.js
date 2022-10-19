let victoryDiv=document.getElementById("victory-text");
let scoreDiv=document.querySelector(".score");
let scoreFlip=document.querySelector(".final_score_flip");
let scoreTime=document.querySelector(".final_score_time");
let highScoreDiv=document.querySelector("#high-score");
let gametype=document.querySelector(".overlay-text-small.type");
let goBack=document.querySelector(".overlay-text-small.back");

let highScoreDisplay=document.querySelector(".high-scores-display");

let checkScore=document.querySelector(".overlay-text-smaller.check-score");

goBack.addEventListener("click",()=>{
    highScoreDiv.classList.remove("visible");
    victoryDiv.classList.add("visible");
})

class AudioController {
    constructor() {
        this.bgMusic1 = new Audio('audio/pain-theme.mp3');
        this.bgmusic2 = new Audio("audio/itachi-theme.mp3");
        this.bgmusic3 = new Audio("audio/naruto_challenge.mp3");
        this.bgMusic1.addEventListener("ended",()=>{
            this.bgmusic2.play();
        })
        this.bgmusic2.addEventListener("ended",()=>{
            this.bgMusic1.play();
        })
        this.flipSound = new Audio('audio/flip.mp3');
        this.matchSound = new Audio('audio/match.wav');
        this.victorySound = new Audio('audio/victory.mp3');
        this.gameOverSound = new Audio('audio/gameover.wav');
        this.bgMusic1.volume = 0.5;
        this.bgmusic2.volume=0.5;
        this.bgmusic3.volume=0.4;
        
    }
    startChallengeMusic(){
        this.bgmusic3.play();
    }
    startMusic() {
        this.bgMusic1.play();
    }
    stopMusic() {
        this.bgMusic1.pause();
        this.bgmusic2.pause();
        this.bgmusic3.pause();
        this.bgMusic1.currentTime= 0;
        this.bgmusic2.currentTime=0;
        this.bgmusic3.currentTime=0;
    }
    flip() {
        this.flipSound.play();
    }
    match() {
        return setTimeout(()=>this.matchSound.play(),500);
    }
    victory() {
        this.stopMusic();
        this.victorySound.play();
    }
    gameOver() {
        this.stopMusic();
        this.gameOverSound.play();
    }
}

class NarutoGame {
    constructor(totalTime, cards, gameType) {
        this.gameType=gameType;
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time-remaining');
        this.ticker = document.getElementById('flips');
        this.audioController = new AudioController();
    }
    displayHighScore(highScoreArray,flips,time){
        if(highScoreArray[0].flips==flips && highScoreArray[0].time==time){
            let showHS=document.createElement("div");
            showHS.classList.add("highscore");
            showHS.innerText="New HIGH SCORE";
            scoreDiv.appendChild(showHS);
        }  
        console.log(highScoreArray[0].flips==flips && highScoreArray[0].time==time);
    }

    displayHighscoreScreen(highScoreArray,gameType){
        checkScore.addEventListener("click",()=>{
            victoryDiv.classList.remove("visible");
            highScoreDiv.classList.add("visible");
            highScoreDisplay.innerHTML="";
            gametype.innerText=`(${gameType} Mode)`;
            for(let i=0;i<highScoreArray.length;i++){
                let highScore=document.createElement("li");
                highScore.classList.add("list-score")
                highScore.innerHTML=`<div>${i+1}.</div><div>Flips: <span>${highScoreArray[i].flips}</span></div><div>Time: <span>${highScoreArray[i].time}s</span></div>`
                highScoreDisplay.appendChild(highScore);
            }
        
        })
    }

    setHighScore(){
        scoreFlip.innerText=this.ticker.innerHTML;
        scoreTime.innerText=this.timer.innerHTML;
        if(this.gameType==="arcade"){
            let arcadeHighScore=[];
            if(localStorage.getItem("naruto_highScores_arcade")){
                arcadeHighScore=JSON.parse(localStorage.getItem("naruto_highScores_arcade"));
                console.log(arcadeHighScore);
                arcadeHighScore.push({flips:this.ticker.innerHTML, time:this.timer.innerHTML});
                if(arcadeHighScore.length!==6){
                    arcadeHighScore.sort((a,b)=>{
                        if (a.flips === b.flips)
                          return a.time - b.time;
                        else 
                          return a.flips - b.flips;
                        
                    })
                }
                else{
                    arcadeHighScore.sort((a,b)=>{
                        if (a.flips === b.flips)
                          return a.time - b.time;
                        else 
                          return a.flips - b.flips;
                        
                    })
                    arcadeHighScore.pop();
                }
                localStorage.setItem("naruto_highScores_arcade",JSON.stringify(arcadeHighScore));
            }
            else{
                arcadeHighScore.push({flips:this.ticker.innerHTML, time:this.timer.innerHTML})
                localStorage.setItem("naruto_highScores_arcade",JSON.stringify(arcadeHighScore));
            } 
            this.displayHighScore(arcadeHighScore,this.ticker.innerHTML,this.timer.innerHTML);
            this.displayHighscoreScreen(arcadeHighScore,"ARCADE");

        }else{
            let challengeHighScore=[];
            if(localStorage.getItem("naruto_highScores_challenge")){
                challengeHighScore=JSON.parse(localStorage.getItem("naruto_highScores_challenge"));
                challengeHighScore.push({flips:this.ticker.innerHTML, time:this.timer.innerHTML});
                if(challengeHighScore.length!==6){
                    challengeHighScore.sort((a,b)=>{
                        if (a.flips === b.flips)
                          return b.time - a.time;
                        else 
                          return a.flips - b.flips;
                        
                    });
                }
                else{
                    challengeHighScore.sort((a,b)=>{
                        if (a.flips === b.flips)
                          return b.time - a.time;
                        else 
                          return a.flips - b.flips;
                        
                    });
                    challengeHighScore.pop();
                }
                localStorage.setItem("naruto_highScores_challenge",JSON.stringify(challengeHighScore));
            }
            else{
                challengeHighScore.push({flips:this.ticker.innerHTML, time:this.timer.innerHTML})
                localStorage.setItem("naruto_highScores_challenge",JSON.stringify(challengeHighScore));
            }   
            this.displayHighScore(challengeHighScore,this.ticker.innerHTML,this.timer.innerHTML);  
            this.displayHighscoreScreen(challengeHighScore,"CHALLENGE");  
        }
    }

    startGameChallenge(obj) {
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.cardToCheck = null;
        this.matchedCards = [];
        this.busy = true;
        setTimeout(() => {
            this.audioController.startChallengeMusic();
            this.shuffleCards(this.cardsArray);
            this.countdown = this.startCountdown(obj);
            this.busy = false;
        }, 500)
        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;
    }
    startGameArcade(obj){
        this.totalClicks = 0;
        this.cardToCheck = null;
        this.matchedCards = [];
        this.busy = true;
        setTimeout(() => {
            this.audioController.startMusic();
            this.shuffleCards(this.cardsArray);
            this.countdown = this.startStopwatch();
            this.busy = false;
        }, 500)
        this.hideCards();
        this.ticker.innerText = this.totalClicks;
    }

    startCountdown(obj) {
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if(this.timeRemaining === 0){
                obj=null;
                this.gameOver();
            }

        }, 1000);
    }
    startStopwatch(){
        let time=0;
        return setInterval(()=>{
            this.timer.innerText=time;
            time=Number(this.timer.innerText)+1;
        },1000);
    }
    gameOver() {
        clearInterval(this.countdown);
        this.audioController.gameOver();
        document.getElementById('game-over-text').classList.add('visible');
    }
    victory() {
        clearInterval(this.countdown);
        this.setHighScore();
        this.audioController.victory();
        document.getElementById('victory-text').classList.add('visible');
    }
    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }
    flipCard(card,obj) {
        if(this.canFlipCard(card)) {
            this.audioController.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');

            if(this.cardToCheck) {
                this.checkForCardMatch(card,obj);
            } else {
                this.cardToCheck = card;
            }
        }
    }
    checkForCardMatch(card,obj) {
        if(this.getCardType(card) === this.getCardType(this.cardToCheck))
            this.cardMatch(card, this.cardToCheck, obj);
        else 
            this.cardMismatch(card, this.cardToCheck,obj);

        this.cardToCheck = null;
    }
    cardMatch(card1, card2, obj) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.audioController.match();
        if(this.matchedCards.length === this.cardsArray.length){
            obj=null;
            setTimeout(()=>this.victory(), 500)
        }
    }
    cardMismatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000);
    }
    shuffleCards(cardsArray) {
        for (let i = cardsArray.length - 1; i > 0; i--) {
            let randIndex = Math.floor(Math.random() * (i + 1));
            cardsArray[randIndex].style.order = i;
            cardsArray[i].style.order = randIndex;
        }
    }
    getCardType(card) {
        return card.getElementsByClassName('card-value')[0].src;
    }
    canFlipCard(card) {
        return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
    }
}

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

function startScreen(){
    document.querySelector(".overlay-text.start").classList.add("visible");
}

function ready() {
    let start = document.querySelector('.overlay-text.start');
    let cards = Array.from(document.getElementsByClassName('card'));
    let gameOver=document.getElementById("game-over-text");
    let victoryClick=document.querySelector(".overlay-text-small.click");

    let arcadeGame=document.querySelector('.overlay-text-small.arcade');
    let challengeGame=document.querySelector(".overlay-text-small.challenge");

    gameOver.addEventListener("click",()=>{
        window.location.reload();
        addEventListener("load",()=>{
            gameOver.classList.remove("visible");
        })
    })
    victoryClick.addEventListener("click",()=>{
        window.location.reload();
        addEventListener("load",()=>{
            victoryDiv.classList.remove("visible");
        })
    })

    arcadeGame.addEventListener("click",()=>{
        start.classList.remove('visible');
        document.querySelector("body").style.overflow="auto";
        let game = new NarutoGame(0, cards, "arcade");
        game.startGameArcade();
        cards.forEach(card => {
            card.addEventListener('click', () => {
                game.flipCard(card,game);
            });
        });
        

    })

    challengeGame.addEventListener("click",()=>{
        start.classList.remove('visible');
        document.querySelector("body").style.overflow="auto";
        let game = new NarutoGame(92, cards, "challenge");
        game.startGameChallenge();
        cards.forEach(card => {
            card.addEventListener('click', () => {
                game.flipCard(card,game);
            });
        });
    })


}









// const items=[
//     {name:"naruto",image:"images/naruto.svg"},
//     {name:"gaara",image:"images/gaara.svg"},
//     {name:"hashirama",image:"images/hashirama.svg"},
//     {name:"itachi",image:"images/itachi.svg"},
//     {name:"jiraiya",image:"images/jiraiya.svg"},
//     {name:"kakashi",image:"images/kakashi.svg"},
//     {name:"konan",image:"images/konan.svg"},
//     {name:"madara",image:"images/madara.svg"},
//     {name:"minato",image:"images/minato.svg"},
//     {name:"nagato",image:"images/nagato.svg"},
//     {name:"obito",image:"images/obito.svg"},
//     {name:"orochi",image:"images/orochi.svg"},
//     {name:"sasuke",image:"images/sasuke.svg"},
//     {name:"sakura",image:"images/sakura.svg"},
//     {name:"shikamaru",image:"images/shikamaru.svg"},
//     {name:"tsunade",image:"images/tsunade.svg"},
// ]

// //Pick random objects from items array
// const generateRandom = (size=4)=>{
//     let tempArray=[...items];
//     let cardValues=[];
//     size=(size*size)/2;
//     for(let i=0;i<size;i++){
//         const randomIndex=Math.floor(Math.random()*tempArray.length);
//         cardValues.push(tempArray[randomIndex]);
//         tempArray.splice(randomIndex,1);
//     }
//     return cardValues;
// }
// console.log(generateRandom());
