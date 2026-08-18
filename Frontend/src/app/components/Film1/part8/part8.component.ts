import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AudioService } from '../../../services/audio.service';
import { GameDataService } from '../../../services/game-data.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-part8',
  templateUrl: './part8.component.html',
  styleUrls: ['./part8.component.css']
})
export class Part8Component implements OnInit, OnDestroy {

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

  loadPart() {

    this.http.get('assets/data/part_8.json').subscribe(data => {

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
        this.manageChoice({ next_node: 'greatHall_Hermione' });
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
    if (nextNodeId === 'final_part' || nextNodeId === '/final_part') {
      this.router.navigate(['/final_part']);
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
      case 'hagrid_dragon':
      break;

      default:
        setTimeout(() => {
          this.manageChoice({ next_node: this.actualPhase.next_node });
        }, 2000);
        break;
    }
  }

}
