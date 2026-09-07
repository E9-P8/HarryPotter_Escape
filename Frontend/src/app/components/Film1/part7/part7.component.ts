import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AudioService } from '../../../services/audio.service';
import { GameDataService } from '../../../services/game-data.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-part7',
  templateUrl: './part7.component.html',
  styleUrls: ['./part7.component.css']
}) 
export class Part7Component implements OnInit, OnDestroy {

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
    (window as any).gameService = this.gameService;

    this.wizardName = this.gameService.getWizardName() || this.gameService.wizardName;
    this.isSeeker = this.gameService.getFlag('isSeeker');
    this.loadPart();
  }
  ngOnDestroy(): void {
  this.timeouts.forEach(t => clearTimeout(t));
    if (this.owlInterval) {
      clearInterval(this.owlInterval);
    }
    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }
  }
 
  Data: any;     
  actualPhase: any;    
  private timeouts: any[] = [];
  private dataSub?: Subscription;

  wizardName: string = this.gameService.wizardName;  //  questa la prende dal GameDataService
  isSeeker: boolean = this.gameService.getFlag("isSeeker");  //  questa la prende dal GameDataService
  bgAnimationClass: string = ''; 

  trollAnimClass: string = '';

  loadPart() {
    this.http.get('assets/data/part_7.json').subscribe(data => {
    this.Data = data;

    if (this.Data && this.Data.nodes && this.Data.nodes.length > 0) {
      const savedNodeId = this.gameService.getCurrentNodeId();
      const savedNode = this.Data.nodes.find((n: any) => n.id === savedNodeId);

      if (savedNode) {
        // Riparte dal nodo salvato
        this.actualPhase = JSON.parse(JSON.stringify(savedNode));
      } else {
        // Se non c'è un nodo salvato valido, parte dal nodo iniziale 
        const defaultNode = this.Data.nodes.find((n: any) => n.id === 'great_hall_dinner') || this.Data.nodes[0];
        this.actualPhase = JSON.parse(JSON.stringify(defaultNode));
        this.gameService.setCurrentNode(this.actualPhase.id, 7);
      }

      // Esegue la gestione delle animazioni o del testo per il nodo caricato
      if (this.actualPhase.type === 'animation') {
        this.handleAnimation(this.actualPhase.id);
      } else if (this.actualPhase.next_node && (!this.actualPhase.options || this.actualPhase.options.length === 0)) {
        // Se è un nodo di passaggio automatico senza opzioni, avvia il timer
        const timer = setTimeout(() => {
          this.manageChoice({ next_node: this.actualPhase.next_node });
        }, 4000);
        this.timeouts.push(timer);
      }
    }
    });
  }
  updateTextWithWizardName(text: string): string {
    if (!text) return "";
    return text.replace('*wizardName*', this.wizardName);
  }
  checkCondition(condition?: string): boolean {
    if (!condition) return true;

    if (condition.includes('==')) {
      const parts = condition.split('==').map(s => s.trim());
      const flagName = parts[0];
      const expectedValue = parts[1] === 'true';

      const actualValue = !!this.gameService.getFlag(flagName);

      return actualValue === expectedValue;
    }

    // Fallback per flag booleani semplici scritti solo come "flagName"
    return !!this.gameService.getFlag(condition);
  }

  manageChoice(option: any) {
    const nextNodeId = (typeof option === 'string') ? option : option.next_node;
    const nextNode = this.Data.nodes.find((n: any) => n.id === nextNodeId);

   
    if (option.impact) {
      this.gameService.updateStats(option.impact);
    }
    if (option && option.set_flag) {
      Object.keys(option.set_flag).forEach(key => {
        this.gameService.setFlag(key, option.set_flag[key]);
      });
      }
    if (nextNodeId === 'part_8' || nextNodeId === '/part8') {
      this.router.navigate(['/part8']);
      return;
    }
    if (nextNode) {
        //this.actualPhase = nextNode; 
        this.actualPhase = JSON.parse(JSON.stringify(nextNode));
        this.gameService.setCurrentNode(this.actualPhase.id, 7);

        if (this.actualPhase.text) {
          this.actualPhase.text = this.actualPhase.text.replace('*wizardName*', this.gameService.wizardName);
        }
        if (this.actualPhase.set_flag) {
          Object.keys(this.actualPhase.set_flag).forEach(key => {
            this.gameService.setFlag(key, this.actualPhase.set_flag[key]);
          });
        }

        if (this.actualPhase.type === 'enigma') {
            console.log("Nodo enigma caricato:", this.actualPhase.enigma_id);
        }
        if (this.actualPhase.type === 'animation') {
            this.handleAnimation(this.actualPhase.id);
        }
        else {
          console.log("Nodo di testo caricato:", this.actualPhase.id);

        if (this.actualPhase.next_node && (!this.actualPhase.options || this.actualPhase.options.length === 0)) {
            setTimeout(() => {
                this.manageChoice({ next_node: this.actualPhase.next_node });
            }, 4000); 
        }
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
      case 'troll_Girlsbathroom':
        this.playTrollSmash();
      break;
      case 'nimbus2000_mail': 
        this.startOwlsAnimation();
      break;
      case 'quidditch_spectator': 
        this.startOwlsAnimation();
      break;

      default:
        setTimeout(() => {
          this.manageChoice({ next_node: this.actualPhase.next_node });
        }, 4000);
        break;
    }
  }

  playTrollSmash(): void {
    this.trollAnimClass = 'troll-swing';

    const tImpact = setTimeout(() => {
      this.trollAnimClass = 'troll-swing scene-shake dust-active';
    }, 1300);
    this.timeouts.push(tImpact);
    const tBgSwitch = setTimeout(() => {
      this.actualPhase.image_id = 'bathroom_destroyed';
    }, 1600);
    this.timeouts.push(tBgSwitch);

    const tEnd = setTimeout(() => {
      this.trollAnimClass = '';
      this.manageChoice({ next_node: this.actualPhase.next_node });
    }, 4000);
    this.timeouts.push(tEnd);
  }
  startOwlsAnimation() {
    console.log("Inizio volo rapido e continuo delle civette");

    this.flyingOwls = [];
    
    const createOwl = (id: number) => {
      const startFromLeft = Math.random() < 0.5;
      const speed = Math.random() * 0.6 + 0.8;

      return {
        id: id,
        x: startFromLeft ? -20 : 105,
        y: Math.random() * 25 - 25,
        speedX: startFromLeft ? speed : -speed,
        speedY: (Math.random() * 0.3 - 0.15),
        img: `owl_${Math.floor(Math.random() * 5) + 1}.png` // Variazione casuale dell'immagine
      };
    };
    for (let i = 1; i <= 8; i++) {
      this.flyingOwls.push(createOwl(i));
    }

    this.showOwls = true;

    this.owlInterval = setInterval(() => {
      this.flyingOwls.forEach((owl, index) => {
        owl.x += owl.speedX;
        owl.y += owl.speedY;

        if ((owl.speedX > 0 && owl.x > 110) || (owl.speedX < 0 && owl.x < -20)) {
          this.flyingOwls[index] = createOwl(owl.id);
        }
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
        //this.actualPhase = nextNode;
        this.manageChoice({ next_node: this.actualPhase.next_node })
      }
    }, 5000);
  }
}
