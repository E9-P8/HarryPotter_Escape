import { Component, OnInit, HostListener } from '@angular/core';
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
  liquidTarget: number = 21;
  maxLiquid :number = 23;
  isGringottDialogueEnd: boolean = false;
  gringottTimer: any;

  isDraggingValve: boolean = false;
  activeValve: 'A' | 'B' | 'C' | null = null;
  Xcentre: number = 0;
  Ycentre: number = 0;
  startAngle: number = 0;
  accumulatedRotation: number = 0; 
  hasTriggeredThisDrag: boolean = false; 

  angleValveA: number = 0;
  angleValveB: number = 0;
  angleValveC: number = 0;

  gaveLamp : boolean = false;
  gaveKeys: boolean = false;
  activeItem: 'lamp' | 'key' | 'coin' | null = null;
  itemX: number = 0;
  itemY: number = 0;
  private dragOffsetX: number = 0;
  private dragOffsetY: number = 0;

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
        image: "assets/img/Part3/FollettiBank.png", 
        text : "Hagrid, cosa sono esattamente questi cosi?"
      },
      { 
        character : 'Hagrid',
        image: "assets/img/Part3/HagridEntrata.png",
        text : "Sono i folletti, astuti come non mai ma non tra le bestie piu amichevoli" 
      },
      { 
        character : 'Hagrid',
        image: "assets/img/Part3/Prelievo.png",
        text : "Il signor harry potter desidera fare un prelievo"
      },
      { 
        character : 'Folletto',
        image: "assets/img/Part3/FolletoPrelievo.png",
        text : "Il signor harry potter ha la sua chiave?"
      },
      { 
        character : 'Hagrid',
        image: "assets/img/Part3/ChiaveRoom.png",
        text : "Oh! Un momento, ce l'ho da qualche parte... Oh eccola la diavoletta!"
      },
      { 
        character : 'Hagrid',
        image: "assets/img/Part3/HagridSegreto.png",
        text : "E ho anche questa cosa... riguarda lei sa cosa.. la camera blindata lei sa quale ... "
      }, 
      { 
        character : 'Folletto',
        image: "assets/img/Part3/EnigmaGringott.png",//ENIGMA
        text : "Il carrello non si muove finchè il freno di sicurezza non viene sbloccato."
      },
      { 
        character : 'Folletto',
        image: "assets/img/Part3/follettoRoom2.png",
        text : "Camera blindata 687.. la lampada prego!" //dare lampada
      },
      { 
        character : 'Folletto',
        image: "assets/img/Part3/FollettoRoom.png",
        text : "La chiave prego!" //dare chiave
      },
      { 
        character : 'Hagrid',
        image: "assets/img/Part3/Room643.png",
        text : "Non avrai pensato che i tuoi genitori ti avevano lasciato all'asciutto!"
      },
      { 
        character : 'Harry',
        image: "assets/img/Part3/UscitaStanza.png",
        text : "Hagrid, cosa c'è nella 713?"
      },
      { 
        character : 'Hagrid',
        image: "assets/img/Part3/UscitaStanza.png",
        text : "Affari di hogwarts! SEGRETISSIMI!"
      },
      { 
        character : 'Harry',
        image: "assets/img/Part3/HagridToOlivander.png", //qui sono in strada
        text : "Mi manca ancora ... una bacchetta!"
      },
      { 
        character : 'Hagrid',
        image: "assets/img/Part3/HagridToOlivander.png", 
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
       if (this.currentLineGringott === 7 && !this.gaveLamp) {
          return;
       }

    
      if (this.currentLineGringott === 8 && !this.gaveKeys) {
        return;
      }
        setTimeout(() => {
          this.currentLineGringott++;
          this.startGringottDialogue();
            }, 3000);
    }


    startItemDrag(event: MouseEvent | TouchEvent, item: 'lamp' | 'key' | 'coin') {
    this.activeItem = item;
    
    const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
    
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    
    this.dragOffsetX = clientX - rect.left;
    this.dragOffsetY = clientY - rect.top;

    this.itemX = rect.left;
    this.itemY = rect.top;
  }

    checkItemDrop() {
    const imgElement = document.querySelector(`.inventory-item.dragging`);
    
    if (!imgElement) {
      this.resetItemPosition();
      return;
    }
    const rect = imgElement.getBoundingClientRect();
    const currentGlobalX = rect.left + rect.width / 2;
    const currentGlobalY = rect.top + rect.height / 2;

    const insideCenterX = currentGlobalX > window.innerWidth * 0.30 && currentGlobalX < window.innerWidth * 0.70;
    const insideCenterY = currentGlobalY > window.innerHeight * 0.25 && currentGlobalY < window.innerHeight * 0.70;

    if (insideCenterX && insideCenterY) {
      if (this.activeItem === 'coin') {
        alert("Folletto: 'Non accettiamo mance qui!'");
        this.resetItemPosition();
        return;
      }

      if (this.currentLineGringott === 7) {
        if (this.activeItem === 'lamp') {
          this.gaveLamp = true;
          this.currentLineGringott++; 
          this.resetItemPosition();
          this.startGringottDialogue();
        } else if (this.activeItem === 'key') {
          alert("Folletto: 'Ho chiesto LA LAMPADA, non la chiave! Senti il peso degli anni, mago?'");
        }
      } 
      
      else if (this.currentLineGringott === 8) {
        if (this.activeItem === 'key') {
          this.gaveKeys = true;
          this.currentLineGringott++;
          this.resetItemPosition();
          this.startGringottDialogue();
        } else if (this.activeItem === 'lamp') {
          alert("Folletto: 'Cosa me ne faccio di un'altra lampada?! Mi serve LA CHIAVE della camera blindata!'");
        }
      }
      this.resetItemPosition();

    }
  }
  resetItemPosition() {
    this.activeItem = null;
  }

 startGame(event: MouseEvent | TouchEvent, valve: 'A' | 'B' | 'C') {
    this.activeValve = valve;
    this.isDraggingValve = true;
    this.hasTriggeredThisDrag = false; 
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    this.Xcentre = rect.left + rect.width / 2;
    this.Ycentre = rect.top + rect.height / 2;
 
    const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
 
    this.startAngle = Math.atan2(clientY - this.Ycentre, clientX - this.Xcentre) * (180 / Math.PI);
  }

  @HostListener('window:mousemove', ['$event'])
  @HostListener('window:touchmove', ['$event'])
  onDragging(event: MouseEvent | TouchEvent) {
    const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;

    if (this.activeItem) {
      const imgElement = document.querySelector(`.inventory-item[alt*="${this.activeItem === 'lamp' ? 'Lamp' : this.activeItem === 'key' ? 'Key' : 'Coin'}"]`);
      let parentOffsetLeft = 0;
      let parentOffsetTop = 0;

      if (imgElement && imgElement.parentElement) {
        const parentRect = imgElement.parentElement.getBoundingClientRect();
        parentOffsetLeft = parentRect.left;
        parentOffsetTop = parentRect.top;
      }
      
      this.itemX = clientX - parentOffsetLeft - this.dragOffsetX;
      this.itemY = clientY - parentOffsetTop - this.dragOffsetY;
      return;
    }
    if (!this.isDraggingValve || !this.activeValve || this.hasTriggeredThisDrag) return;

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
      this.hasTriggeredThisDrag = true; 
      this.applyValveEffect(this.activeValve, 'orario');
      this.accumulatedRotation = 0;
    } else if (this.accumulatedRotation <= -sogliaScatto) {
      this.hasTriggeredThisDrag = true; 
      this.applyValveEffect(this.activeValve, 'antiorario');
      this.accumulatedRotation = 0;
    }
  }

  applyValveEffect(valve: 'A' | 'B' | 'C', direction: 'orario' | 'antiorario') {
    let variation = 0;

    if (valve === 'A') {
      variation = direction === 'orario' ? 9 : -9;
    }
    if (valve === 'B') {
      variation = direction === 'orario' ? 5 : -5;
    }
    if (valve === 'C') {
      variation = direction === 'orario' ? 2 : -2;
    }
    
    this.liquidLevel = Math.max(0, this.liquidLevel + variation);
    
    if (this.liquidLevel >= this.maxLiquid) {

      this.liquidLevel = 0;
      alert("Sfiato di pressione! Il liquido ha strabordato!.");
      this.stopGame(); 
      return; 
    } 

    if (this.liquidLevel === this.liquidTarget) {
      this.currentLineGringott++;
      this.startGringottDialogue();
    }
  }
  @HostListener('window:mouseup')
  @HostListener('window:touchend')
  stopGame() {
    if (this.activeItem) {
      this.checkItemDrop();
    }
    this.isDraggingValve = false;
    this.activeValve = null;
    this.accumulatedRotation = 0;
    this.hasTriggeredThisDrag = false;
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
