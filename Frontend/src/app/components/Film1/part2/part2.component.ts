import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AudioService } from '../../../services/audio.service';

export interface StormLetter {
  id: number;              
  tipo: 'hogwarts' | 'bolletta' | 'supermarket';
  FrontImg: string;   
  BackImg: string;
  positionX: number;       
  positionY: number;  
  speedX: number;     
  speedY: number;         
}

interface firePlaceDialogue{
  character : string;
  image: string;
  text : string;
 }

interface lightHouseDialogue{
  character : string;
  image: string;
  text : string;
 }

 interface pubDialogue{
  character : string;
  image: string;
  text : string;
 }

@Component({
  selector: 'app-part2',
  templateUrl: './part2.component.html',
  styleUrls: ['./part2.component.css']
})
export class Part2Component implements OnInit { 

  constructor(private router: Router, public audioService : AudioService) { }

  actualFase: 'firePlace' | 'lightHouse' | 'diagonAlley' | 'letter' = 'letter';
  letterIsOpen: boolean = false;
  letterIsFlipped: boolean = false;

  isfirePlaceDialogueEnd : boolean = false;
  isfirePlaceEnigmaSolved : boolean = false;
  currentfirePlace: number = 0;

  isCatchLetterSolved: boolean = false;
  flyingLetters: StormLetter[] = [];
  stressVernon: number = 0;
  concentrazioneHarry: number = 100;
  isConcentrazioneActive: boolean = false;
  gameInterval: any;
  focusInterval: any;


  showlightHouseVideo: boolean = false;
  islightHouseDialogueEnd : boolean = false;
  islightHouseEnigmaSolved : boolean = false;
  isDoorVibrating: boolean = false;
  currentLinelightHouse: number = 0;
  doorClicks: number = 0;

  isFirePlaceSolved: boolean = false;
  correctFireplaceSequence: string[] = ['oil', 'match']; 
  userFireplaceSequence: string[] = [];
  showSmoke: boolean = false;

  isUmbrellaSolved: boolean = false;
  isUmbrellaGameActive: boolean = false;
  cursorPosition: number = 0; 
  cursorDirection: number = 1; 
  umbrellaInterval: any;
  isDudleyTransformed: boolean = false;

  isPubDialogueEnd : boolean = false;
  isPubEnigmaSolved : boolean = false;
  currentLinePub: number = 0;

  correctPubSequence: number[] = [3, 1, 4, 0, 2]; 
  userPubSequence: number[] = [];
  showVideo: boolean = false;

  toggleAudio(): void {
  this.audioService.toggleGlobalMute(0.2);
  }

  ngOnInit(): void {
    this.startIntroSequence();
  }
  startIntroSequence() {
    this.audioService.startGlobalBackground('LetTheMysteryUnfold', 0.3); 
  }

  ngOnDestroy(): void {
    if (this.gameInterval) clearInterval(this.gameInterval);
    if (this.umbrellaInterval) clearInterval(this.umbrellaInterval);
  }

  openLetter() {
  this.audioService.playSound(''); 
  this.letterIsOpen = true;
  }
  


  /***************** FIREPLACE ************************ */
     script0 : firePlaceDialogue[] = [
      { 
        character : 'Zio Vernon',
        image: "assets/img/Part2/AngryZio_letter.png", 
        text : "Chi ti scrive?! Chi sa del sottoscala?! Non ci saranno risposte! Questa lettera verrà bruciata!"
      },
      { 
        character : 'Harry',
        image: "assets/img/Part2/Harry1.png", 
        text : "Ma era mia! C'era il mio nome sopra!"
      },
      { 
        character : 'Zio Vernon',
        image: "assets/img/Part2/AngryZio_letter2.png", 
        text : ""
      },
      { 
        character : '',
        image: "assets/img/Part2/Black.png", 
        text : ""
      },
      { 
        character : '',
        image: "assets/img/Part2/Sunday.png", 
        text : "La domenica è il giorno più bello di tutti! Niente posta la domenica!"
      },
      { 
        character : '',
        image: "assets/img/Part2/Sunday1.png", 
        text : ""
      },
      { 
        character : '',
        image: "assets/img/Part2/Sunday2.png", 
        text : ""
      },
      { 
        character : '',
        image: "assets/img/Part2/Sunday3.png", 
        text : ""
      },
      { 
        character : '',
        image: "assets/img/Part2/DursleyHouse.png", 
        text : ""
      },
      { 
        character : '',
        image: "assets/img/Part2/DursleyHouse1.png", 
        text : ""
      },
      { 
        character : '',
        image: "assets/img/Part2/DursleyHouse2.png", 
        text : ""
      },
      { 
        character : '',
        image: "assets/img/Part2/DursleyHouse3.png", 
        text : ""
      }
    ]
    
    startfirePlaceDialogue(){
      if(this.currentfirePlace >= this.script0.length){
          this.isfirePlaceDialogueEnd = true;
          return;
        } 
      if(this.currentfirePlace === 7 && !this.isfirePlaceEnigmaSolved){
        this.initStormLetters();
        return;
        } 
      setTimeout(() => {
          this.currentfirePlace++;
          this.startfirePlaceDialogue()
            }, 3000);
    }

    initStormLetters(): void {
    this.flyingLetters = [];
    this.stressVernon = 0;
    this.concentrazioneHarry = 100;

    const totalLetters = 20;

        for (let i = 0; i < totalLetters; i++) {
          let tipoLetter: 'hogwarts' | 'bolletta' | 'supermarket' = 'bolletta';
          let frontImage = 'assets/img/Part2/bollettaFront.png'; 

          if (i === 0) {
            tipoLetter = 'hogwarts';
            frontImage = 'assets/img/Part2/HogwartsFront.png'; 
          } else if (i % 2 === 0) {
            tipoLetter = 'supermarket';
            frontImage = 'assets/img/Part2/supermarketFront.png'; 
          }

          let sX = (Math.random() - 0.5) * 2;
          let sY = (Math.random() - 0.5) * 2;
          
          if (Math.abs(sX) < 0.4) sX = sX > 0 ? 0.4 : -0.4;
          if (Math.abs(sY) < 0.4) sY = sY > 0 ? 0.4 : -0.4;

          this.flyingLetters.push({
            id: i,
            tipo: tipoLetter,
            BackImg: 'assets/img/Part2/BackLetter.png', 
            FrontImg: frontImage,
            positionX: 95, 
            positionY: 50,  
            speedX: sX,
            speedY: sY
          });
        }

        this.startGameLoop();
      }

      startGameLoop() {
        if (this.gameInterval) clearInterval(this.gameInterval);

        this.gameInterval = setInterval(() => {
          const haFocus = this.isConcentrazioneActive && this.concentrazioneHarry > 0;
          const speedModifier = haFocus ? 0.25 : 1.0; 

          if (haFocus) {
            this.concentrazioneHarry = Math.max(0, this.concentrazioneHarry - 0.6);
          } else {
            this.concentrazioneHarry = Math.min(100, this.concentrazioneHarry + 0.3);
            this.stressVernon = Math.min(100, this.stressVernon + 0.08); 
          }

          if (this.stressVernon >= 100) {
            this.endFireplaceGame(false);
            return;
          }
          this.flyingLetters.forEach(letter => {
            letter.positionX += letter.speedX * speedModifier;
            letter.positionY += letter.speedY * speedModifier;

            if (letter.positionX <= 0 || letter.positionX >= 92) {
              letter.speedX = -letter.speedX;
              letter.positionX = letter.positionX <= 0 ? 0.1 : 91.9;
            }

            if (letter.positionY <= 0 || letter.positionY >= 90) {
              letter.speedY = -letter.speedY;
              letter.positionY = letter.positionY <= 0 ? 0.1 : 89.9;
            }
          });

        }, 16);
      }
      clickLetter(letter: any) {
          if (letter.tipo === 'hogwarts') {
            if (this.gameInterval) clearInterval(this.gameInterval);
            this.isConcentrazioneActive = false;
            
            this.isCatchLetterSolved = true;
            this.isfirePlaceEnigmaSolved = true;
            this.flyingLetters = []; 

            setTimeout(() => {
              this.currentfirePlace =8;
              this.startfirePlaceDialogue();
            }, 3000);
            
          } else {
            this.stressVernon = Math.min(100, this.stressVernon + 15);
          }
        }
      
        toggleLetterFlip() {
          this.audioService.playSound(''); // Riproduce il suono del flip se necessario
          this.letterIsFlipped = !this.letterIsFlipped;

          setTimeout(() => {
            this.letterIsOpen = false;
            this.actualFase = 'firePlace';
            this.startfirePlaceDialogue();
          }, 1000);
          }

      endFireplaceGame(isVictory: boolean) {
          if (this.gameInterval) clearInterval(this.gameInterval);
          this.isConcentrazioneActive = false;

          if (isVictory) {
            this.isCatchLetterSolved = true;
            this.isfirePlaceEnigmaSolved = true; 
            this.flyingLetters = [];
            
            this.currentfirePlace = 8;
            this.startfirePlaceDialogue();
          } else {
            alert("Zio Vernon ha preso tutte le lettere e le ha bruciate! Riprova!");
            this.initStormLetters();
          }
        }

      trackByLetteraId(index: number, item: StormLetter): number {
        return item.id;
      }
      attivaConcentrazione() {
          if (this.isCatchLetterSolved) return;
          this.isConcentrazioneActive = true;
        }

      disattivaConcentrazione() {
        setTimeout(() => {
        this.isConcentrazioneActive = false;
        }, 500);
      }

    GoToLighthouse(){
    this.actualFase= 'lightHouse';
    this.showlightHouseVideo = true;
    this.audioService.startGlobalBackground('rainAndThunder', 0.3);
    }
    onLighthouseVideoEnded(): void {
      this.showlightHouseVideo = false;          
      this.currentLinelightHouse = 0; 
      this.startlightHousePubDialogue();   
    }
  /***************** LIGHTHOUSE ************************ */


    script : lightHouseDialogue[] = [
      { 
        character : 'Harry',
        image: "assets/img/Part2/HarryBirthday.png", //suona bip
        text : "Esprimi un desiderio Harry"
      },
      { 
        character : '*TOC TOC*',
        image: "assets/img/Part2/lightHouse_emptyDoor.png", 
        text : "*Qualcuno sta bussando alla porta*"
      },
      { 
        character : 'Hagrid',
        image: "assets/img/Part2/lightHouse_HagridDoor.png",
        text : "Scusate tanto!"
      },
      { 
        character: 'Zio vernon', 
        image: "assets/img/Part2/ZioFucile.png",
        text: "Se ne vada immediatamente signore! Questa è un'effrazione!!"
      },
      { 
        character : 'Hagrid',
        image: "assets/img/Part2/HagridFucile.png",
        text : "Essiccati Sursley, vecchia prugna (?)"//suono di sparo
      },
      { 
        character : 'Hagrid',
        image: "assets/img/Part2/HarryCake.png", 
        text : "Tieni Harry, ho qualcosa per te. Mica tutti i giorni un giovanotto compie 11 anni eh!" //accende fuoco
      },
      { 
        character : 'Hagrid', 
        image: "assets/img/Part2/FireOff.png", //fuoco spento
        text : ""
      },
      { 
        character : 'Hagrid', 
        image: "assets/img/Part2/FireOn.png",//fuoco acceso
        text : ""
      },
      { 
        character : 'Hagrid', //dialogo hagrid e harry
        image: "assets/img/Part2/HagridLetter.png",
        text : ""
      },
      { 
        character : 'Harry', //dialogo hagrid e harry
        image: "assets/img/Part2/HarryLetter.png",
        text : ""
      },{ 
        character : 'Hagrid', //mettere lettera di benvenuto
        image: "assets/img/Part2/HogwartsLetter12.png",
        text : ""
      },
      { 
        character : 'Zio Vernon',
        image: "assets/img/Part2/Vernon13.png",
        text : "Lui non ci andrà! Lo abbiamo promesso quando l'abbiamo preso!"
      },
      { 
        character : 'Hagrid',
        image: "assets/img/Part2/Hagrid12.png",
        text : "Questo ragazzo è iscritto dal giorno in cui è nato! Andrà alla miglior scuola di magia e stregoneria del mondo e sarà sotto il miglior preside che Hogwarts ha mai visto!.. Albus Silente!"
      },
      { 
        character : 'Zio Vernon',
        image: "assets/img/Part2/Vernon13.png",
        text : "Non intendo pagare perchè un vecchio strampalato insegni trucchi di magia"
      },
      { 
        character : 'Hagrid',
        image: "assets/img/Part2/angryHagrid14.png",
        text : "Mai insultare Albus Silente davanti a me!" //mettere incantesimo coda panico generale
      },
      { 
        character : '',
        image: "assets/img/Part2/DudleyNotTrasformed.png.png", 
        text : "" 
      },
      { 
        character : '',
        image: "assets/img/Part2/DudleyTrasformed.png",
        text : "" 
      },
      { 
        character : 'Hagrid',
        image: "assets/img/Part2/followHagrid.png",
        text : "Oh! Siamo molto in ritardo, dobbiamo andare!"
      }
  ]
    startlightHousePubDialogue(){
        if(this.currentLinelightHouse >= this.script.length){
          this.islightHouseDialogueEnd = true;
          return;
        } 
        if (this.currentLinelightHouse === 0) {
          this.audioService.playSound("clockTwelve"); 
          setTimeout(() =>{
            this.audioService.playSound("BlowingCandle");
          }, 100  )
        }
        if (this.currentLinelightHouse === 4) {
          this.audioService.playSound("shot");
        }
        if (this.currentLinelightHouse === 1 && this.doorClicks < 6) {
          this.audioService.playSound(""); //sbattere la porta
          //time out suono urla
          return;
        }
        if (this.currentLinelightHouse === 6 && !this.isFirePlaceSolved) {
          return;
        }
        if (this.currentLinelightHouse === 14 && !this.isUmbrellaSolved) {
          this.startUmbrellaGame();
          return;
        }
        setTimeout(() => {
          this.currentLinelightHouse++;
          this.startlightHousePubDialogue()
            }, 3000);
    }

      onDoorClick() {
        if (this.currentLinelightHouse === 1 && this.doorClicks < 6) {
          this.doorClicks++;
          this.audioService.playSound('PunchingDoor');

          this.isDoorVibrating = true;

          setTimeout(() => {
                this.isDoorVibrating = false;
              }, 150); 

          if (this.doorClicks === 6) { 
            this.audioService.playSound('');
            this.currentLinelightHouse++;
            this.startlightHousePubDialogue();
          }
        }
      }
      useFireplaceItem(item: 'wood' | 'oil' | 'match' | 'wetNews') {
          if (this.isFirePlaceSolved) return;
          this.userFireplaceSequence.push(item);
          
          this.audioService.playSound('switchOnOff'); 

          if (this.userFireplaceSequence.length === 2) {
            
            const isSequenceCorrect = this.userFireplaceSequence[0] === this.correctFireplaceSequence[0] &&
                                      this.userFireplaceSequence[1] === this.correctFireplaceSequence[1];

            if (isSequenceCorrect) {
              this.isFirePlaceSolved = true;
              this.audioService.playSound('fireOn'); 
              this.userFireplaceSequence = []; 
              
              this.currentLinelightHouse = 7;
              this.startlightHousePubDialogue();
            } else {
              this.audioService.playSound('fireFailed'); 
              this.showSmoke = true;
              this.userFireplaceSequence = []; 

              setTimeout(() => {
                this.showSmoke = false;
              }, 2500);
            }
          }
        }
      startUmbrellaGame() {
          this.isUmbrellaGameActive = true;
          this.cursorPosition = 0;
          this.cursorDirection = 1;

          this.umbrellaInterval = setInterval(() => {
            this.cursorPosition += 3 * this.cursorDirection; 

            if (this.cursorPosition >= 100) {
              this.cursorPosition = 100;
              this.cursorDirection = -1; 
            } else if (this.cursorPosition <= 0) {
              this.cursorPosition = 0;
              this.cursorDirection = 1; 
            }
          }, 10);
        }
      onUmbrellaShoot() {
        if (!this.isUmbrellaGameActive || this.isUmbrellaSolved) return;

        const minWinZone = 40;
        const maxWinZone = 60;

        if (this.cursorPosition >= minWinZone && this.cursorPosition <= maxWinZone) {
          clearInterval(this.umbrellaInterval);
          this.isUmbrellaGameActive = false;
          this.isUmbrellaSolved = true;
          
          this.isDudleyTransformed = true;
          this.audioService.playSound('magic_shoot'); 
          console.log(this.isDudleyTransformed);
          this.currentLinelightHouse = 15;

          setTimeout(() => {
            this.currentLinelightHouse = 16; 
            this.audioService.playSound('pig_squeak'); 
          }, 1000);

        setTimeout(() => {
            this.isDudleyTransformed = false; 
            this.currentLinelightHouse = 17; 
          }, 1500);
      } else {
      this.audioService.playSound('spark_fail'); 
    }
    }

      followHagrid(){
        this.actualFase= 'diagonAlley';
        this.audioService.startGlobalBackground('QueenGhosts', 0.3);
        setTimeout(()=>{
          this.startPubDialogue();
        },1000)
        
        }
 
  /***************** DIAGON ALLEY ************************ */
  script2 : pubDialogue[] = [
  { 
    character : 'Harry',
    image: "assets/img/Part2/Harry&Hagrid.png",
    text : "Tutti gli studenti possono portare o un gufo, o un ratto, o un rospo.. Tutto questo lo troviamo a Londra?"
  },
  { 
    character : 'Hagrid',
    image: "assets/img/Part2/Harry&Hagrid.png",
    text : "Se sai dove andare!"
  },
  { 
    character: 'Voci', 
    image: "assets/img/Part2/Pub_ccrowd.png",
    text: "Non ci credo! E' Harry Potter! ... Wow, Harry!"
  },
  { 
    character : 'Harry',
    image: "assets/img/Part2/HarryWall.png",
    text : "Hagrid, perchè sono famoso? Come fanno a conoscere il mio nome?"
  },
  { 
    character : 'Hagrid',
    image: "assets/img/Part2/HagridWall.png",
    text : "Non credo di essere la persona più adatta per dirtelo, Harry"
  },
  { 
    character : 'Hagrid',
    image: "assets/img/Part2/DiagonAlley_wall.png",
    text : "Guarda bene Harry...  tre a destra, sette in alto a destra, sei a sinistra, quattro in basso a sinistra ...Aspetta, il mondo magico è l'esatto opposto di quello babbano. Per aprire la via, devi guardare le cose da un altro punto di vista"
  },
  { 
    character : 'Hagrid',
    image: "",
    text : "Benvenuto Harry, a Diagon Halley!"
  }
  ]
  startPubDialogue(){
        if (this.currentLinePub === this.script2.length-1) {
          console.log(this.currentLinePub, this.showVideo );
              setTimeout(() => {
                    this.showVideo = true;
                    console.log("Stato aggiornato in Angular:", this.currentLinePub, this.showVideo);
                    // this.audioService.stopMusic();
          }, 0);
        return;
        
      }
      /*if(this.currentLinePub >= this.script.length){
        this.isDialogueEnd = true;
        return;
      } */
      if (this.currentLinePub === 1) {
        this.audioService.playSound("doorOpening"); 
      }
      if (this.currentLinePub === 2) {
        this.audioService.playSound("laughing_people"); 
      }

      if(this.currentLinePub === 5 && !this.isPubEnigmaSolved){
        console.log("Attesa di risoluzione enigma");
          return;
        }
      setTimeout(() => {
        this.currentLinePub++;
        this.startPubDialogue()
          }, 3000); 
            
    }

  onVideoEnded(): void {
    this.router.navigate(['/part3']); 
  }

    onBrickClick(brickIndex: number): void {

        this.audioService.playSound('brick_click'); 
        this.userPubSequence.push(Number(brickIndex));

      if (this.userPubSequence.length === this.correctPubSequence.length) {
      
         const isSequenceCorrect = this.userPubSequence.every(
        (value, index) => value === this.correctPubSequence[index]
      );

        if (isSequenceCorrect) {
          this.solvePubEnigma();
        } else {
          alert("Il muro non si muove... la combinazione sembra sbagliata.");
          this.userPubSequence = []; 
        }
    }
  }

  solvePubEnigma(): void {
      this.isPubEnigmaSolved = true;
      this.userPubSequence = [];

      this.audioService.playSound('wall_opening');

      this.currentLinePub++; 
      this.startPubDialogue();
    }
}
