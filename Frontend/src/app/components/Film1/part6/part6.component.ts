import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AudioService } from '../../../services/audio.service';
import { GameDataService } from '../../../services/game-data.service'


@Component({
  selector: 'app-part6',
  templateUrl: './part6.component.html',
  styleUrls: ['./part6.component.css']
})
export class Part6Component implements OnInit {

  constructor(private http: HttpClient,
      public gameService: GameDataService, 
      public audioService : AudioService,
    private router: Router) { }

  Data: any;     
  actualPhase: any;    
  wizardName: string = this.gameService.wizardName;  //  questa la prende dal GameDataService
  isSeeker: boolean = this.gameService.getFlag("isSeeker");  //  questa la prende dal GameDataService

  toggleAudio(): void {
    this.audioService.toggleGlobalMute(0.2);
  }
 /* startIntroSequence() {
    this.audioService.startGlobalBackground('LetTheMysteryUnfold', 0.3); 
  }*/

  ngOnInit(): void {
    this.wizardName = this.gameService.wizardName;
    this.loadPart();
  }
  loadPart() {
    this.http.get('assets/data/part_6.json').subscribe(data => {
      this.Data = data;
      this.actualPhase = this.Data.nodes[0];
    });
  }

  updateTextWithWizardName(text: string): string {
    if (!text) return "";
    return text.replace('*wizardName*', this.wizardName);
  }


  manageChoice(option: any) {
    const nextNodeId = (typeof option === 'string') ? option : option.next_node;
    const nextNode = this.Data.nodes.find((n: any) => n.id === nextNodeId);

   
    if (option.impact) {
      this.gameService.updateStats(option.impact);
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

            if (this.actualPhase.next_node && (!this.actualPhase.options || this.actualPhase.options.length === 0)) {
                setTimeout(() => {
                    this.manageChoice({ next_node: this.actualPhase.next_node });
                }, 3000); 
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
    case 'banchetto':
    
      break;
    
    case 'dormitorio':
    
      break;
    case 'lesson':
      
      break;
    case 'posta': 
       
      break;
    default:
      setTimeout(() => {
        this.manageChoice({ next_node: this.actualPhase.next_node });
      }, 2000);
      break;
  }
  }
}
