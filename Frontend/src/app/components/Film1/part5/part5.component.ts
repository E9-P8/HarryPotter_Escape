import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AudioService } from '../../../services/audio.service';
import { GameDataService } from '../../../services/game-data.service'
import { Router } from '@angular/router';


@Component({
  selector: 'app-part5',
  templateUrl: './part5.component.html',
  styleUrls: ['./part5.component.css']
})
export class Part5Component implements OnInit {

  Data: any;     
  actualPhase: any;    
  wizardName: string = "Esempio"; 

  showBanchetto: boolean = false;
  showFlash: boolean = false;

  showOwls: boolean = false;
  flyingOwls: any[] = [];
  private owlInterval: any;

  constructor(private http: HttpClient,
    public gameService: GameDataService, 
    public audioService : AudioService,
  private router: Router) { }


  toggleAudio(): void {
  this.audioService.toggleGlobalMute(0.2);
  }

  ngOnInit(): void {
    this.wizardName = this.gameService.wizardName;
    this.loadPart();
  }

  loadPart() {
    this.http.get('assets/data/part_5.json').subscribe(data => {
      this.Data = data;
      this.actualPhase = this.Data.nodes[0];
    });
  }

  manageChoice(option: any) {
    // 1. Applica impatto se esiste (reputazione, audacia, ecc.)
    const nextNodeId = (typeof option === 'string') ? option : option.next_node;
    const nextNode = this.Data.nodes.find((n: any) => n.id === nextNodeId);

   
    if (option.impact) {
      this.gameService.updateStats(option.impact);
    }
    if (option.next_node === 'manual') {
    this.gameService.openManual();
    return; 
    }
    if (option.next_node === "mcgranitt_reprimand") {
      this.gameService.setFlag("isSeeker", true);
    }


if (nextNode) {
        this.actualPhase = nextNode; 

        if (this.actualPhase.type === 'enigma') {
            console.log("Nodo enigma caricato:", this.actualPhase.enigma_id);
        }
        if (this.actualPhase.type === 'animation') {
            this.handleAnimation(this.actualPhase.id);
        }
        else {
           console.log("Nodo di testo caricato:", this.actualPhase.id);
        }
    }
  }
  openManual(){ 
    this.gameService.isManualOpen= true;
    this.gameService.openManual();
  }
  closeManual() {
    this.gameService.closeManual();
  }

  handleAnimation(animationId: string) {
  switch (animationId) {
    case 'banchetto':
      this.startBanchettoAnimation();
      break;
    
    case 'dormitorio':
      this.startScaleAnimation();
      break;
    case 'lesson':
      this.startTransformAnimation();
      break;
    case 'posta': 
        this.startOwlsAnimation();
      break;
    default:
      setTimeout(() => {
        this.manageChoice({ next_node: this.actualPhase.next_node });
      }, 2000);
      break;
  }
}

  startBanchettoAnimation(){ 
    console.log("startBanchettoAnimation")
    setTimeout(() => {
      this.showBanchetto = true; 
      
      setTimeout(() => {
        this.manageChoice({ next_node: this.actualPhase.next_node });
      }, 3000);
    }, 1000);
  }
  startScaleAnimation() {
    setTimeout(() => {
      this.manageChoice({ next_node: this.actualPhase.next_node });
    }, 7000);
  }
  startTransformAnimation() {
    console.log("Inizio trasformazione magica dal centro");

    setTimeout(() => {
      this.showFlash = true; 
    setTimeout(() => {
        const nextNode = this.Data.nodes.find((n: any) => n.id === this.actualPhase.next_node);
        if (nextNode) {
          this.actualPhase = nextNode;
        }
        setTimeout(() => {
          this.showFlash = false;
        }, 400); 

      }, 400); 

    }, 2000);
  }
  startOwlsAnimation() {
    console.log("Inizio volo rapido e continuo delle civette");

    this.flyingOwls = [];
    
    // Funzione di supporto per creare o rigenerare una singola civetta
    const createOwl = (id: number) => {
      const startFromLeft = Math.random() < 0.5;
      // Aumentata la velocità base (da ~0.3 a ~0.8-1.4) per farle volare molto più rapide
      const speed = Math.random() * 0.6 + 0.8;

      return {
        id: id,
        x: startFromLeft ? -20 : 105,
        y: Math.random() * 30 - 10,
        speedX: startFromLeft ? speed : -speed,
        speedY: (Math.random() * 0.4 - 0.2),
        img: `owl_${Math.floor(Math.random() * 5) + 1}.png` // Variazione casuale dell'immagine
      };
    };

    // Ne creiamo subito 8 invece di 5 per un effetto iniziale più ricco
    for (let i = 1; i <= 8; i++) {
      this.flyingOwls.push(createOwl(i));
    }

    this.showOwls = true;

    this.owlInterval = setInterval(() => {
      this.flyingOwls.forEach((owl, index) => {
        owl.x += owl.speedX;
        owl.y += owl.speedY;

        // Appena una civetta esce COMPLETAMENTE dallo schermo, la rigeneriamo
        // Questo crea l'effetto di uno sciame continuo di tantissime civette
        if ((owl.speedX > 0 && owl.x > 110) || (owl.speedX < 0 && owl.x < -20)) {
          this.flyingOwls[index] = createOwl(owl.id);
        }

        // Leggera correzione per la traiettoria verticale
        if (owl.y < -15 || owl.y > 35) {
          owl.speedY = -owl.speedY;
        }
      });
    }, 20); 

    setTimeout(() => {
      clearInterval(this.owlInterval);
      this.showOwls = false;

      const nextNode = this.Data.nodes.find((n: any) => n.id === this.actualPhase.next_node);
      if (nextNode) {
        this.actualPhase = nextNode;
      }
    }, 7000);
  }
  whistles(){ 
    setTimeout(() => {
      this.manageChoice(this.actualPhase.next_node);
    }, 800);
  }
  updateTextWithWizardName(text: string): string {
    if (!text) return "";
    return text.replace('*wizardName*', this.wizardName);
  }

  


  isAlreadySeeker(): boolean {
  return this.gameService.getFlag("isSeeker");
}

  confirmTeam(choice: boolean) {
    this.gameService.setFlag("isSeeker", choice);
    /*Opzionale: salva il completamento della parte 5 prima di uscire
  this.gameService.navigateTo("part6_start", 6);*/

    this.router.navigate(['/part6']);
  }

} 
