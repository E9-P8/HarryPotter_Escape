import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AudioService } from '../../../services/audio.service';

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
  }
  openLetter() {
  this.audioService.playSound(''); 
  this.letterIsOpen = true;
}
  toggleLetterFlip() {
    this.audioService.playSound(''); 
    this.letterIsFlipped = !this.letterIsFlipped;

     setTimeout(()=> {
      this.letterIsOpen = false;
      this.actualFase= 'firePlace';
    }, 1000) //mettere 10k
  }

  /***************** LIGHTHOUSE ************************ */
  nonLoSo(){
    this.actualFase= 'lightHouse';
    setTimeout(()=>{
      this.startlightHousePubDialogue();
    },1000)
    }

    script : lightHouseDialogue[] = [
      { 
        character : 'Harry',
        image: "assets/img/Part2/HarryBirthday.png", //suona bip
        text : "Esprimi un desiderio Harry"
      },
      { 
        character : '*TOC TOC*',
        image: "assets/img/Part2/lightHouse_emptyDoor.png", //bottone da cliccare 6 volte 
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
        image: "assets/img/Part2/",
        text : ""
      },
      { 
        character : 'Hagrid', //dialogo hagrid e harry
        image: "assets/img/Part2/",
        text : ""
      },{ 
        character : 'Hagrid', //mettere lettera di benvenuto
        image: "assets/img/Part2/",
        text : ""
      },
      { 
        character : 'Zio Vernon',
        image: "assets/img/Part2/",
        text : "Lui non ci andrà! Lo abbiamo promesso quando l'abbiamo preso!"
      },
      { 
        character : 'Hagrid',
        image: "assets/img/Part2/",
        text : "Questo ragazzo è iscritto dal giorno in cui è nato! Andrà alla miglior scuola di magia e stregoneria del mondo e sarà sotto il miglior preside che Hogwarts ha mai visto!.. Albus Silente!"
      },
      { 
        character : 'Zio Vernon',
        image: "assets/img/Part2/",
        text : "Non intendo pagare perchè un vecchio strampalato insegni trucchi di magia"
      },
      { 
        character : 'Hagrid',
        image: "assets/img/Part2/",
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
        image: "assets/img/Part2/",
        text : "Oh! Siamo molto in ritardo, dobbiamo andare!"
      }
  ]
  startlightHousePubDialogue(){
      if(this.currentLinelightHouse >= this.script.length){
        this.islightHouseDialogueEnd = true;
        return;
      } 
      if (this.currentLinelightHouse === 0) {
        this.audioService.playSound(""); //bip mezzanotte 
      }
      if (this.currentLinelightHouse === 1 && this.doorClicks < 6) {
        this.audioService.playSound(""); //sbattere la porta a ogni click 
        //time out suono urla
        //timeout parte la battuta
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
          }, 1000);
  }

      onDoorClick() {
        if (this.currentLinelightHouse === 1 && this.doorClicks < 6) {
          this.doorClicks++;
          this.audioService.playSound('');

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
          
          this.audioService.playSound('item_click'); 

          if (this.userFireplaceSequence.length === 2) {
            
            const isSequenceCorrect = this.userFireplaceSequence[0] === this.correctFireplaceSequence[0] &&
                                      this.userFireplaceSequence[1] === this.correctFireplaceSequence[1];

            if (isSequenceCorrect) {
              this.isFirePlaceSolved = true;
              this.audioService.playSound('fire_burst'); // Suono fiammata
              this.userFireplaceSequence = []; // Svuota
              
              this.currentLinelightHouse = 7;
              this.startlightHousePubDialogue();
            } else {
              this.audioService.playSound('smoke_fail'); 
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
          this.currentLinelightHouse = 15;

          setTimeout(() => {
            this.currentLinelightHouse = 16; 
            this.audioService.playSound('pig_squeak'); 
          }, 1000);

        setTimeout(() => {
            this.isDudleyTransformed = false; 
            this.currentLinelightHouse = 17; 
          }, 2500);
      } else {
      this.audioService.playSound('spark_fail'); 
    }
    }

      followHagrid(){
        this.actualFase= 'diagonAlley';
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
