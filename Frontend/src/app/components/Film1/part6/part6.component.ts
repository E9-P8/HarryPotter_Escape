import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AudioService } from '../../../services/audio.service';
import { GameDataService } from '../../../services/game-data.service';
import { Subscription } from 'rxjs';

export interface Hotspot {
  id: string;
  label: string;
  x: number;
  y: number;
  title: string;
  description: string;
  opened_image?: string;
}

@Component({
  selector: 'app-part6',
  templateUrl: './part6.component.html',
  styleUrls: ['./part6.component.css']
})
export class Part6Component implements OnInit, OnDestroy {

  constructor(private http: HttpClient,
      public gameService: GameDataService, 
      public audioService : AudioService,
      private router: Router) { }

  Data: any;     
  actualPhase: any;    
  wizardName: string = this.gameService.wizardName;  //  questa la prende dal GameDataService
  isSeeker: boolean = this.gameService.getFlag("isSeeker");  //  questa la prende dal GameDataService

  bgAnimationClass: string = '';
  stairAnimationClass: string = '';
  currentBgImage: string = '';

  activeHotspot: Hotspot | null = null;
  openedHotspots: Set<string> = new Set<string>();

  private timeouts: any[] = [];
  private dataSub?: Subscription;

  toggleAudio(): void {
    this.audioService.toggleGlobalMute(0.2);
  }
 /* startIntroSequence() {
    this.audioService.startGlobalBackground('LetTheMysteryUnfold', 0.3); 
  }*/

  ngOnInit(): void {
    (window as any).gameService = this.gameService;


    this.wizardName = this.gameService.getWizardName() || this.gameService.wizardName;
    this.isSeeker = this.gameService.getFlag('isSeeker');
    this.loadPart();
  }
  ngOnDestroy(): void {
    this.timeouts.forEach(t => clearTimeout(t));
    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }
  }

 loadPart() {

    this.http.get('assets/data/part_6.json').subscribe(data => {

      this.Data = data;

      if (this.Data && this.Data.nodes && this.Data.nodes.length > 0) {

      //  this.manageChoice({ next_node: this.Data.nodes[0].id });
        const savedNodeId = this.gameService.getCurrentNodeId();
        const savedNode = this.Data.nodes.find((n: any) => n.id === savedNodeId);

        if (savedNode) {
        // Riparte dal nodo salvato
        this.actualPhase = JSON.parse(JSON.stringify(savedNode));
        } else {
          // Se non c'è un nodo salvato valido, parte dal primo
          this.actualPhase = JSON.parse(JSON.stringify(this.Data.nodes[0]));
        }
        if (this.actualPhase.type === 'animation') {
        this.handleAnimation(this.actualPhase.id);
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
    const isSeeker = this.gameService.getFlag('isSeeker');

    if (condition === 'isSeeker == true') {
      return this.isSeeker;
    }
    if (condition === 'isSeeker == false') {
      return !this.isSeeker;
    }

    return true;
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
    if (nextNodeId === 'part_7' || nextNodeId === '/part7') {
      this.router.navigate(['/part7']);
      return;
    }
    if (nextNode) {
        //this.actualPhase = nextNode; 
        this.actualPhase = JSON.parse(JSON.stringify(nextNode));
        this.gameService.setCurrentNode(this.actualPhase.id, 6);

        this.activeHotspot = null;
        this.openedHotspots.clear();

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
        
        if (this.actualPhase.id === 'Quidditch_balls') {
          console.log("Nodo Quidditch_balls caricato: in attesa dell'apertura di tutti i bottoni.");
          return;
        }

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

  openHotspot(spot: Hotspot): void {
    this.activeHotspot = spot;
    this.openedHotspots.add(spot.id);
  }

  closeHotspotModal(): void {
    this.activeHotspot = null;

    if (
      this.actualPhase?.id === 'Quidditch_balls' && 
      this.actualPhase?.hotspots && 
      this.openedHotspots.size === this.actualPhase.hotspots.length
    ) {
      const timer = setTimeout(() => {
        this.manageChoice({ next_node: this.actualPhase.next_node });
      }, 1000);
      this.timeouts.push(timer);
    }
  }

  isHotspotOpened(id: string): boolean {
    return this.openedHotspots.has(id);
  }

  handleAnimation(animationId: string) {
    switch (animationId) {
      case 'Griffindor_3floor':
        this.movingStairs();
      break;

        
      default:
        setTimeout(() => {
          this.manageChoice({ next_node: this.actualPhase.next_node });
        }, 2000);
        break;
    }
  }

  movingStairs(){
    this.stairAnimationClass = '';

  setTimeout(() => {
    this.bgAnimationClass = 'bg-glitch-out';
    this.stairAnimationClass = 'slide-out-right';
  }, 800);

  setTimeout(() => {
    this.actualPhase.image_id = 'Forbidden_3floor';
    this.bgAnimationClass = 'bg-glitch-in';
    this.stairAnimationClass = 'slide-in-left'; 
  }, 2000);

  setTimeout(() => {
    this.bgAnimationClass = '';
    this.stairAnimationClass = '';
  }, 3500);

  setTimeout(() => {
    this.manageChoice({ next_node: this.actualPhase.next_node });
  }, 4500);
  }
}
