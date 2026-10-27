import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AudioService } from '../../../services/audio.service';
import { GameDataService } from '../../../services/game-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-final-part',
  templateUrl: './final-part.component.html',
  styleUrls: ['./final-part.component.css']
})
export class FinalPartComponent implements OnInit, OnDestroy {

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

  bgAnimationClass: string = ''; 

  isFloatingKeysActive: boolean = false;
  isKeysAttackingActive: boolean = false;

  assets = {
  keySingle: 'assets/img/final_part/key.png',   
  keysBunch: 'assets/img/final_part/keys_attack.png',
  keysCloud: 'assets/img/final_part/keys_cloud.png'
  };



loadPart() {
    this.http.get('assets/data/final_part.json').subscribe(data => {
      this.Data = data;

      if (this.Data && this.Data.nodes && this.Data.nodes.length > 0) {
        const savedNodeId = this.gameService.getCurrentNodeId();
        const savedNode = this.Data.nodes.find((n: any) => n.id === savedNodeId);

        if (savedNode) {
          this.actualPhase = JSON.parse(JSON.stringify(savedNode));
        } else {
          this.actualPhase = JSON.parse(JSON.stringify(this.Data.nodes[0]));
        }

        if (this.actualPhase.type === 'animation') {
          this.handleAnimation(this.actualPhase.id);
        } else if (this.actualPhase.next_node && (!this.actualPhase.options || this.actualPhase.options.length === 0)) {
          const t = setTimeout(() => {
            this.manageChoice({ next_node: this.actualPhase.next_node });
          }, 4000);
          this.timeouts.push(t);
        }
      }
    });
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
      else if (this.actualPhase.type === 'animation') {
        this.handleAnimation(this.actualPhase.id);
      } 
      else {
        console.log("Nodo di testo caricato:", this.actualPhase.id);

        if (this.actualPhase.next_node && (!this.actualPhase.options || this.actualPhase.options.length === 0)) {
          const t = setTimeout(() => {
            this.manageChoice({ next_node: this.actualPhase.next_node });
          }, 4000);
          this.timeouts.push(t);
        }
      }
    }
  }
  updateTextWithWizardName(text: string): string {
    if (!text) return "";
    return text.replace('*wizardName*', this.wizardName);
  }
  checkCondition(condition?: string): boolean {
    if (!condition) return true;
    const isSeeker = this.gameService.getFlag('isSeeker');

    return true;
  }


  openManual(){ 
    this.gameService.isManualOpen= true;
    this.gameService.openManual();
  }
  closeManual() {
    this.gameService.closeManual();
  }

  
  handleAnimation(animationId: string) {
    this.isFloatingKeysActive = false;
    this.isKeysAttackingActive = false;

    switch (animationId) {
      case 'flying_keys':
        this.playEmptyRoomAnimation();
      break;
      case 'keys_attacking':
        this.playKeysAttackingAnimation();
      break;

      default:
        setTimeout(() => {
          this.manageChoice({ next_node: this.actualPhase.next_node });
        }, 4000);
        break;
    }
  }

    private playEmptyRoomAnimation() {
      this.isFloatingKeysActive = true;

      if (this.actualPhase.next_node) {
        const t = setTimeout(() => {
          this.manageChoice({ next_node: this.actualPhase.next_node });
          
        this.isFloatingKeysActive = false;
        }, 4000); 
        this.timeouts.push(t);
      }
    }

    private playKeysAttackingAnimation() {
      this.isKeysAttackingActive = true;

      if (this.actualPhase.next_node) {
        const t = setTimeout(() => {
          this.manageChoice({ next_node: this.actualPhase.next_node });
          this.isKeysAttackingActive = false;
        }, 4000); 
        this.timeouts.push(t);
      }
    }
}
