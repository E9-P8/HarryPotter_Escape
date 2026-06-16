import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AudioService } from '../../../services/audio.service';

interface GringottDialogue{
  character : string;
  image: string;
  text : string;
 }
 interface broomDialogue{
  character : string;
  image: string;
  text : string;
 }
 interface OllivanderDialogue{
  character : string;
  image: string;
  text : string;
 }

@Component({
  selector: 'app-part3',
  templateUrl: './part3.component.html',
  styleUrls: ['./part3.component.css']
})
export class Part3Component implements OnInit {

  constructor(private router: Router, public audioService : AudioService) { }

  currentLinebroom = 0;
  isbroomDialogueEnd: boolean = false;

  currentLineGringott = 0;
  liquidLevel: number = 0;
  liquidTarget: number = 15;
  maxLiquid :number = 16;
  isGringottDialogueEnd: boolean = false;

  isDraggingValve: boolean = false;
  activeValve: 'A' | 'B' | 'C' | null = null;
  Xcentre: number = 0;
  Ycentre: number = 0;
  startAngle: number = 0;
  accumulatedRotation: number = 0; 

  angleValveA: number = 0;
  angleValveB: number = 0;
  angleValveC: number = 0;

  currentLineOllivander = 0;
  isOllivanderDialogueEnd: boolean = false;
  isEnigmaBoxSolved : boolean = false;
  isBox1Clicked : boolean = false;
  isBox2Clicked : boolean = false;
  isBox3Clicked : boolean = false;

  toggleAudio(): void {
  this.audioService.toggleGlobalMute(0.2);
  }

  ngOnInit(): void {
    this.startIntroSequence();
    this.startbroomDialogue();
  }
  startIntroSequence() {
    this.audioService.startGlobalBackground('LetTheMysteryUnfold', 0.3); 
  }

   actualFase: 'Gringott' | 'broom' | 'Ollivander'  = 'broom';


   /***************** BROOM ************************ */

    script0 : broomDialogue[] = [
      { 
        character : 'Hagrid',
        image: "assets/img/Part3/Hagrid&Harry1.png", 
        text : "Qui troverai le penne d'oca e l'inchiostro.. e di la tutte le cianfrusaglie per fare le stregonerie"
      },
      { 
        character : 'Ragazzi in sottofondo',
        image: "assets/img/Part3/Novella2000.png",
        text : "Una scopa da corsa bellissima! Guardate che roba, la  nuova Ninbus 2000!" 
      },
      { 
        character : 'Harry',
        image: "assets/img/Part3/Harry2.png",
        text : "Ma hagrid io come farò a pagare tutto questo? Io non ho un soldo..."
      },
      { 
        character : 'Hagrid',
        image: "assets/img/Part3/HagridGringott4.png",
        text : "I tuoi soldi sono li, alla Gringott! Alla banca dei maghi!"
      }
    ]
    startbroomDialogue(){
        if(this.currentLinebroom >= this.script0.length){
          this.isbroomDialogueEnd = true;
          return;
       }
        setTimeout(() => {
          this.currentLinebroom++;
          this.startbroomDialogue();
            }, 3000);
    }
    EnterGringott(){
      this.actualFase= 'Gringott';
      this.audioService.startGlobalBackground('rainAndThunder', 0.3);

      this.currentLineGringott = 0;
      this.startGringottDialogue();
    }
  /***************** Gringott ************************ */

    script1 : GringottDialogue[] = [
      { 
        character : 'Harry',
        image: "assets/img/Part3/", 
        text : "Hagrid, cosa sono esattamente questi cosi?"
      },
      { 
        character : 'Hagrid',
        image: "assets/img/Part3/",
        text : "Sono i folletti, astuti come non mai ma non tra le bestie piu amichevoli" 
      },
      { 
        character : 'Hagrid',
        image: "assets/img/Part3/",
        text : "Il signor harry potter desidera fare un prelievo"
      },
      { 
        character : 'Folletto',
        image: "assets/img/Part3/",
        text : "Il signor harry potter ha la sua chiave?"
      },
      { 
        character : 'Hagrid',
        image: "assets/img/Part3/",
        text : "Oh! Un momento, ce l'ho da qualche parte... Oh eccola la diavoletta!"
      },
      { 
        character : 'Hagrid',
        image: "assets/img/Part3/",
        text : "E ho anche questa cosa... riguarda lei sa cosa.. la camera blindata lei sa quale ... "
      }, 
      { 
        character : 'Folletto',
        image: "assets/img/Part3/EnigmaGringott.png",//ENIGMA
        text : "Il carrello non si muove finchè il freno di sicurezza non viene sbloccato."
      },
      { 
        character : 'Folletto',
        image: "assets/img/Part3/",
        text : "Camera blindata 687.. la lampada prego!" //dare lampada
      },
      { 
        character : 'Folletto',
        image: "assets/img/Part3/",
        text : "La chiave prego!" //dare chiave
      },
      { 
        character : 'Hagrid',
        image: "assets/img/Part3/",
        text : "Non avrai pensato che i tuoi genitori ti avevano lasciato all'asciutto!"
      },
      { 
        character : 'Harry',
        image: "assets/img/Part3/",
        text : "Hagrid, cosa c'è nella 713?"
      },
      { 
        character : 'Hagrid',
        image: "assets/img/Part3/",
        text : "Affari di hogwarts! SEGRETISSIMI!"
      },
      { 
        character : 'Harry',
        image: "assets/img/Part3/", //qui sono in strada
        text : "Mi manca ancora ... una bacchetta!"
      },
      { 
        character : 'Hagrid',
        image: "assets/img/Part3/", 
        text : "allora ci vuole Ollivander! Non c'è posto migliore! Aspettami li, non ci metterò molto"
      }
    ]
    startGringottDialogue(){
        if(this.currentLineGringott >= this.script1.length){
          this.isGringottDialogueEnd = true;
          return;
       }
       if(this.currentLineGringott === 6 && this.liquidLevel !== this.liquidTarget){ 
return;
       }
        setTimeout(() => {
          this.currentLineGringott++;
          this.startGringottDialogue();
            }, 1000);
    }

    startGame(event: MouseEvent | TouchEvent, valve: 'A' | 'B' | 'C') {
      this.activeValve = valve;
      this.isDraggingValve = true;
  
     // centro della manopola sullo schermo
     const rect = (event.target as HTMLElement).getBoundingClientRect();
     this.Xcentre = rect.left + rect.width / 2;
     this.Ycentre = rect.top + rect.height / 2;
  
     // posizione attuale del mouse/dito
     const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
     const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
  
    // angolo iniziale trigonometria
    this.startAngle = Math.atan2(clientY - this.Ycentre, clientX - this.Xcentre) * (180 / Math.PI);
   }

   onDragging(event: MouseEvent | TouchEvent) {
    if (!this.isDraggingValve || !this.activeValve) return;

    const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;

    const currentAngle = Math.atan2(clientY - this.Ycentre, clientX - this.Xcentre) * (180 / Math.PI);

    let angleDifference = currentAngle - this.startAngle;

    if (angleDifference > 180) angleDifference -= 360;
    if (angleDifference < -180) angleDifference += 360;

    if (this.activeValve === 'A') {
      this.angleValveA += angleDifference;
    } else if (this.activeValve === 'B') {
      this.angleValveB += angleDifference;
    } else if (this.activeValve === 'C') {
      this.angleValveC += angleDifference;
    }

    this.accumulatedRotation += angleDifference;
    this.startAngle = currentAngle;
    const sogliaScatto = 90; 

    if (this.accumulatedRotation >= sogliaScatto) {
        this.applyValveEffect(this.activeValve, 'orario');
        this.accumulatedRotation = 0;

       } else if (this.accumulatedRotation <= -sogliaScatto) {
          this.applyValveEffect(this.activeValve, 'antiorario');
          this.accumulatedRotation = 0;
    }
    }
    applyValveEffect(valve: 'A' | 'B' | 'C', direction: 'orario' | 'antiorario') {
      let variation = 0;

          if (valve === 'A') {
    if (direction === 'orario') {
      variation = 5;
    } else {
      variation = -5;
    }
           }
  
          if (valve === 'B') {
    if (direction === 'orario') {
      variation = 3;
    } else {
      variation = -3;
    }
            }
          if (valve === 'C') {
    if (direction === 'orario') {
      variation = 2;
    } else {
      variation = -2;
    }
           }
       this.liquidLevel = Math.max(0, this.liquidLevel + variation);
       if (this.liquidLevel >= this.maxLiquid) {
        //mettere suono
      this.liquidLevel = 0;
      alert("Sfiato di pressione! Il tubo si è svuotato.");
      return; 
    } 
    if (this.liquidLevel === this.liquidTarget) {
        this.currentLineGringott++;
        this.startGringottDialogue();
    }
    }
    stopGame() {
    this.isDraggingValve = false;
    this.activeValve = null;
    this.accumulatedRotation = 0;
  }
  
    EnterOllivander(){
    this.actualFase= 'Ollivander';
    this.audioService.startGlobalBackground('rainAndThunder', 0.3);

    this.currentLineOllivander = 0;
    this.startOllivanderDialogue();
    }
  /***************** Ollivander ************************ */

    script2 : OllivanderDialogue[] = [
      { 
        character : 'Harry',
        image: "assets/img/Part3/HarryOllivander.png", 
        text : "C'è nessuno?"
      },
      { 
        character : 'Olivander',
        image: "assets/img/Part3/Olivander1.png", 
        text : "Mi domandavo quand'è che l'avrei conosciuta.. signor Potter! Sembra ieri che i suoi genitori sono venuti a comprare la loro prima bacchetta magica"
      },
      { 
        character : 'Olivander',
        image: "assets/img/Part3/Olivander2.png", 
        text : "Via! La agiti!" 
      },
      { 
        character : 'Olivander',
        image: "assets/img/Part3/OlivanderEnigma.png", 
        text : "Via! La agiti!" //ENIGMA
      },
      { 
        character : 'Harry',
        image: "assets/img/Part3/HarryWand.png", //bacchetta giusta
        text : ""
      },
      { 
        character : 'Olivander',
        image: "assets/img/Part3/OlivanderStupito.png", 
        text : "Curioso... Io ricordo tutte quelle che ho venduto. Si da il caso che la fenice, la cui piuma riside in questa bacchetta, abbia dato un'altra piuma, solo una. E' curioso che lei è destinato a questa bacchetta quando la sua gemella le ha inferto quella cicatrice!"
      },
      { 
        character : 'Harry',
        image: "assets/img/Part3/HarryOlivander.png", 
        text : "E chi possedeva quella bacchetta?"
      },
      { 
        character : 'Olivander',
        image: "assets/img/Part3/Olivander7.png", 
        text : "Oh noi non pronunciamo il suo nnome, è la bacchetta a scegliere il mago, signor Potter. Noi possiamo aspettarci grandi cose da lei!"
      }
      ,
      { 
        character : 'Hagrid',
        image: "assets/img/Part3/HagridCivetta.png", //hagrid che bussa con una civetta
        text : "Harry! Buon compleanno!"
      }
    ]
    startOllivanderDialogue(){
        if(this.currentLineOllivander >= this.script2.length){
          this.isOllivanderDialogueEnd = true;
          return;
       }
       if(this.currentLineOllivander === 3 && !this.isEnigmaBoxSolved){
          return
        }
        setTimeout(() => {
          this.currentLineOllivander++;
          this.startOllivanderDialogue();
            }, 3000);
    }
    
    clickBox1(){
      this.isBox1Clicked= true;
    }
    clickBox2(){
      this.isBox2Clicked  = true;
    }
    clickBox3(){
      this.isBox3Clicked = true;
    }
    onBoxWrongEnded(){
       this.isBox1Clicked = false;
       this.isBox2Clicked = false;
       this.isBox3Clicked = false;
    }
    clickBox4(){
      this.isEnigmaBoxSolved = true;
      this.currentLineOllivander = 4; 
      this.startOllivanderDialogue();
    }
    GoToStation(){
      this.router.navigate(['/part4']);
    }
}
