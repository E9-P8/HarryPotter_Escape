import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AudioService } from '../../services/audio.service';

interface introDialogue{
  character : string;
  image : string;
  text : string;
 }

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css']
})



export class IntroComponent implements OnInit {

 isTransforming: boolean = false;
 isHagridArriving: boolean = false;
 isDialogueEnd : boolean = false;
 currentLine: number = 0;

 isVideo1Playing: boolean = true;  
 isVideo2Playing: boolean = false; 
 isMinigameActive: boolean = false;

 streetLights = [
  { id: 1, isOn: true, top: '38%', left: '31%' }, 
  { id: 2, isOn: true, top: '57%', left: '46%' }, 
  { id: 3, isOn: true, top: '57%', left: '61%' }
  ];
   
  get dialogClasses() {
  return {
    'magical-flash': this.isTransforming,
    'hagrid-rumble': this.isHagridArriving
  };
}

  script : introDialogue[] = [
    { 
      character : '',
      image : 'assets/img/PivetDrive_notte.png',
      text : "... Spegni i 3 lampioni pr oscurare la via ... "
    },
    { 
      character : 'Silente',
      image : 'assets/img/Silente_spegnino.png',
      text : "Una notte fin troppo tranquilla per il mondo dei babbani..."
    },
    { 
    character: 'Gatto',
    image: 'assets/img/McGranitt_gatto.png', 
    text: "Sapevo di trovarla qui, Prof.ssa McGranitt *Rivela la magia*"
    },
    { 
    character: 'Prof.ssa McGranitt',
    image: 'assets/img/McGranitt_umana.png', 
    text: "Buonasera, Professor Silente. "
    },
    { 
      character : 'Prof.ssa McGranitt',
      image : 'assets/img/McGranitt-Silente_incontro.png',
      text : "Sono vere le voci? E il bambino?"
    },
    { 
      character : 'Silente',
      image : 'assets/img/Silente_incontro.png',
      text : "Hagrid lo sta portando qui. È l'unico posto sicuro."
    },
    { 
      character : 'Hagrid',
      image : 'assets/img/Hagrid_bambino.png',
      text : "Professor Silente, Prof.ssa McGranitt. Il marmocchio si è addormentato mentre venivamo qui. Cerchi di non svegliarlo"
    },
    { 
      character : 'Prof.ssa McGranitt',
      image : 'assets/img/McGranitt_incontro.png',
      text : "Albus, lo lasceremo davvero a queste persone? Li ho osservati tutto il giorno, sono la peggior specie di babbani possibili!"
    },
    { 
      character : 'Silente',
      image : 'assets/img/Silente_culla.png',
      text : "Sì. è meglio che cresca lontano da tutto questo, finché non sarà pronto. Questo non è un vero addio dopotutto."
    },
    { 
      character : 'Silente',
      image : 'assets/img/Harry_culla.png',
      text : "Buona fortuna, harry potter."
    }
  ]

  constructor(private router: Router, public audioService: AudioService) { }

  toggleAudio(): void {
  this.audioService.toggleGlobalMute(0.2);
}
  ngOnInit(): void {
  this.audioService.startGlobalBackground('mistery', 0.2);

  setTimeout(() => { 
    this.isVideo1Playing = false;
    this.isMinigameActive = true;
  }, 7000);
}
 

turnOffLight(id: number) {
    const light = this.streetLights.find(l => l.id === id);
    if (light) {
      this.audioService.playSound('switchOnOff');
      light.isOn = false;
    }

    if (this.streetLights.every(l => !l.isOn)) {
      this.isMinigameActive = false; 
      console.log(this.currentLine);
      this.isVideo2Playing = true;   

      setTimeout(() => {
        this.isVideo2Playing = false;
        this.currentLine = 1; 
      }, 5000); 
    }
  }
    nextLine() {
        if (this.currentLine >= this.script.length - 1) {
          this.isDialogueEnd = true;
          this.router.navigate(['/part1']);
          //this.audioService.muteIntro('intro');
          return;
        }

        if (this.currentLine === 0 && !this.isMinigameActive) {
          
          }

 if (this.currentLine === 2) {
  this.isTransforming = true;
  this.audioService.playSound('traformation');
    setTimeout(() => {
        this.currentLine++;
      }, 1500); 
      setTimeout(() => {
        this.isTransforming = false;
      }, 3500); 
    
    }else if (this.currentLine === 5) {
      this.isHagridArriving = true;
      this.audioService.playSound('motorcycle'); 
      setTimeout(() => {
        this.currentLine++;
        this.isHagridArriving = false;
      }, 4500); 
    }
     else {
      this.currentLine++;
    }
}
  prevLine(){
    console.log(this.currentLine);
    if(this.currentLine > 0){
       this.currentLine--;
     }
   }
}
