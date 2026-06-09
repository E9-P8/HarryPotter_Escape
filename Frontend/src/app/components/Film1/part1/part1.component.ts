import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AudioService } from '../../../services/audio.service';

interface kitchenDialogue{
  character : string;
  image: string;
  text : string;
 }

 interface reptilesDialogue{
  character : string;
  image: string;
  text : string;
 }

@Component({
  selector: 'app-part1',
  templateUrl: './part1.component.html',
  styleUrls: ['./part1.component.css']
})
export class Part1Component implements OnInit {


  constructor(private router: Router, public audioService : AudioService) { }

  @ViewChild('roomViewport') roomViewport!: ElementRef;

  isBlackScreen: boolean = true;     
  isFadeOutActive: boolean = false;   
  isVideoPlaying: boolean = false;     
  isGameplayReady: boolean = false;  
  HarrysAlarm : boolean = true;

  actualFase: 'understairs' | 'kitchen' | 'reptiles' = 'understairs';

  isRoomIlluminated: boolean = false; 
  flashlightStyle: string = 'radial-gradient(circle 120px at -999px -999px, transparent 100%, black 100%)';

  digit1: number | null = null;
  digit2: number | null = null;
  digit3: number | null = null;
  digit4: number | null = null;

  isTimerOpened = false;
  isDialogueEnd : boolean = false;
  currentLineKitchen: number = 0;
  isEnigmaSolved= false;

  currentLineReptiles: number = 0;
  isReptilesDialogueEnd : boolean = false;
  isReptilesEnigmaSolved: boolean = false;
  userSnakeInput: string = '';
  glassClicks: number = 0;


  toggleAudio(): void {
  this.audioService.toggleGlobalMute(0.2);
}

  ngOnInit(): void {
    this.startIntroSequence();
  } 

  startIntroSequence() {
    this.audioService.startGlobalBackground('forest', 0.3); 

      setTimeout(() => {
        this.isFadeOutActive = true;
      }, 3000);
      setTimeout(() => {
        this.isBlackScreen = false;
        this.isVideoPlaying = true;
      }, 4500);
  }
  onVideoEnd() {
    this.isVideoPlaying = false;
    this.isGameplayReady = true;

      setTimeout(() => {
      this.isGameplayReady = false;
      this.HarrysAlarm= false;

      setTimeout(() => {
        if (this.roomViewport) {

          const element = this.roomViewport.nativeElement;
          element.scrollLeft = (element.scrollWidth - element.clientWidth) / 2;
          element.scrollTop = (element.scrollHeight - element.clientHeight) / 2;
          element.focus();
        }
      }, 50);

      }, 3000);
  }
  updateFlashlight(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.flashlightStyle = `radial-gradient(circle 120px at ${x}px ${y}px, transparent 80%, black 100%)`;
  }
  updateFlashlightTouch(event: TouchEvent) {
      if (event.touches.length === 0) return;
      const touch = event.touches[0];
      const target = event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      this.flashlightStyle = `radial-gradient(circle 120px at ${x}px ${y}px, transparent 80%, black 100%)`;
    }

  findGlasses() {
    this.audioService.playSound('switchOnOff');
    this.isRoomIlluminated = true;
  }
  openDoor(){
    if(this.isRoomIlluminated === true ){
      this.audioService.playSound('doorOpening'); 
        setTimeout(() => {
          this.audioService.startGlobalBackground('wizard', 0.1);
          this.actualFase = 'kitchen';
          this.startDialogue();
        }, 2000);
  }}

  /******** KITCHEN ********/
  script : kitchenDialogue[] = [
    { 
      character : 'Zia Petunia',
      image: "assets/img/Dudley&zia.png",
      text : "Ecco che arriva il nostro festeggiato! *smuack* *smuack*"
    },
    { 
      character : 'Zio Vernon',
      image: "assets/img/ZioVernon.png",
      text : "Buon compleanno, figliolo"
    },
    { 
    character: 'Zia Petunia', 
    image: "assets/img/Dudley&zia.png",
    text: "Voglio che ogni cosa sia perfetta!"
    },
    { 
      character : 'Dudley',
      image: "assets/img/Dudley.png",
      text : "MA QUANTI SONO?!"
    },
    { 
      character : 'Zio Vernon',
      image: "assets/img/ZioVernon.png",
      text : "36! Li ho contati personalmente"
    },
    { 
      character : 'Dudley',
      image: "assets/img/Dudley.png",
      text : "36???? MA L'ANNO SCORSO NE HO AVUTI 37!"
    },
    { 
      character : 'Zio Vernon',
      image: "assets/img/ZioVernon.png",
      text : "Ma alcuni sono piu grossi di quelli dell'anno scorso..."
    },
    { 
      character : 'Dudley',
      image: "assets/img/Dudley.png",
      text : "NON MI INTERESSA QUANTO SONO GROSSI!"
    },
    { 
      character : 'Zia Petunia',
      image: "assets/img/Zia&Dudley.png",
      text : "Ecco cosa faremo. Mentre siamo fuori ti compreremo altri 2 regali... che ne dici, zuccottino?"
    },
    { 
      character : 'Zia Petunia',
      image: "assets/img/ZiaPetunia.png",
      text : "Tu prepara la colazione e vedi di non bruciare niente!"
    }
  ]

  startDialogue(){
    if(this.currentLineKitchen >= this.script.length){
      this.isDialogueEnd = true;
      return;
    } 
    if (this.currentLineKitchen === 0 || this.currentLineKitchen === 2) {
      this.audioService.playSound('kiss');
    }
  
    setTimeout(() => {
      this.currentLineKitchen++;
      this.startDialogue()
        }, 4000); 
          
  }
  openTimer(){ 
    this.isTimerOpened = true;
    this.audioService.playSound('kitchenTimer1', 0.5, true);
   }
   closeTimer(){ 
    this.isTimerOpened = false;
    this.audioService.stopSound('kitchenTimer1');
   }
  checkCode(){ 
    if (this.digit1 == 3 && this.digit2 == 7 && this.digit3 == 2 && this.digit4 == 8) {
      this.isEnigmaSolved = true;
      this.audioService.stopSound('kitchenTimer1');
      this.audioService.playSound('kitchenTimer2');
      this.isTimerOpened = false; 
        setTimeout(()=>{ 
            this.audioService.playSound('car');
        }, 1000)
          setTimeout(()=>{ 
            this.actualFase = 'reptiles';
            this.startReptilesDialogue();
          }, 3000)
    
    } else{
      alert("Sbrigati! Il bacon si sta bruciando!");
    }
    }
  
    /******** Reptiles ********/

  script2 : reptilesDialogue[] = [
    { 
      character : 'Dudley',
      image: "assets/img/WaitingSnake.png",
      text : "E fallo muovere! MUOVITI!"
    },
    { 
      character : 'Harry',
      image: "assets/img/Harry&Snake.png",
      text : "Devi scusarlo... non capisce cosa significa stare sdraiati giorno dopo giorno a guardare tante brutte facce premute contro il vetro"
    },
    { 
    character: 'Serpente', 
    image: "assets/img/snake.png",
    text: "SsSsSsSs...."
    },
    { 
    character: 'Harry', 
    image: "assets/img/Harry&Snake.png",
    text: "Riesci a sentirmi? Vedi... non ho mai parlato con un serpente"
    },
    { 
    character: 'Serpente', 
    image: "assets/img/snake.png",
    text: "Io non parlo <span translate='no'>ssssssss</span>spesso con le per<span translate='no'>sssss</span>one... <span translate='no'>ssssssssssss</span>ono cre<span translate='no'>sssssssssssssss</span>ciuto in cattività... <span translate='no'>sssssssssssss</span>cusa, tu puoi <span translate='no'>sssss</span>entirmi?"
    },
    { 
      character : 'Dudley',
      image: "assets/img/DudleyReptiles.png",
      text : "Mamma, papà, venite qui! Venite a vedere cosa fa il serpente!!"
    },
    { 
      character : 'Serpente',
      image: "assets/img/SnakeTerrarium.png",
      text : "SsSsSsSs...."
    },
    { 
      character : 'Dudley',
      image: "assets/img/DudleyTerrarium.png",
      text : "Mamma! Mamma! Aiutami! Aiutami ti prego!"
    },
    { 
      character : 'Zia Petunia & Dudley',
      image: "assets/img/Zia&Dudley_Home.png",
      text : ""
    },
    { 
      character : 'Zio Vernon ',
      image: "assets/img/AngryZio.png",
      text : "COSA E' SUCCESSO?!"
    },
    { 
      character : 'Harry',
      image: "assets/img/ScariedHarry.png",
      text : "Giuro non lo so! Un minuto prima c'era il vetro e un minuto dopo è sparito.. come per magia!"
    },
    { 
      character : 'Zio Vernon',
      image: "assets/img/Harry&Zio_understairs.png",
      text : "NON ESISTE LA MAGIA!"
    }
  ]

  startReptilesDialogue(){
    if(this.currentLineReptiles >= this.script2.length){
      this.isReptilesDialogueEnd = true;

       setTimeout(()=>{ 
            this.router.navigate(['/part2']);
          }, 3000)
           
      return;
    } 
      if (this.currentLineReptiles === 2 || this.currentLineReptiles === 4 ) {
        this.audioService.playSound('snake_hiss');
      }
    
      if(this.currentLineReptiles === 4 && !this.isReptilesEnigmaSolved){
      console.log("Attesa di risoluzione enigma");
        return;
      }
      
      if(this.currentLineReptiles === 6 && this.glassClicks < 10){
        this.audioService.playSound('snake_hiss');
      console.log("TAP TAP");
        return;
      }

          setTimeout(() => {
          this.currentLineReptiles++;
          this.startReptilesDialogue();
        }, 5000); 
    }
     
    checkSnakeEnigma() {
      if (this.userSnakeInput.toUpperCase().trim() === 'HELP ME') {
        this.solveReptilesEnigma(); 
      } else {
        alert("Il serpente sibila in modo strano... sembra voglia dirti qualcosa.");
      }
    } 

    solveReptilesEnigma() {
      this.isReptilesEnigmaSolved = true;
      console.log("Enigma risolto! Il dialogo del rettilario riprende.");
      
      this.currentLineReptiles++; 
      this.startReptilesDialogue();
    }
    onGlassClick() {
      if (this.currentLineReptiles === 6 && this.glassClicks < 10) {
        this.glassClicks++;
        this.audioService.playSound('glass_tap');

        if (this.glassClicks === 10) {
          this.audioService.playSound('glass_shatter');
          this.currentLineReptiles++;
          this.startReptilesDialogue();
        }
      }
    }
}

 