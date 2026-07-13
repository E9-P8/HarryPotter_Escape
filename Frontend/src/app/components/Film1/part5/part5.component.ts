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
  wizardName: string = "Harry"; 

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

    const nextNodeId = option.next_node;
    const nextNode = this.Data.nodes.find((n: any) => n.id === nextNodeId);

if (nextNode) {
        this.actualPhase = nextNode; 

        if (this.actualPhase.type === 'enigma') {
            console.log("Nodo enigma caricato:", this.actualPhase.enigma_id);
            return; 
        }
        if (this.actualPhase.type === 'animation') {
            setTimeout(() => {
                this.manageChoice({ next_node: this.actualPhase.next_node });
            }, 2000);
        }
    }
  }

  openManual(){ 
    this.gameService.isManualOpen= true;
    this.gameService.openManual();
  }

  updateTextWithWizardName(text: string): string {
    if (!text) return "";
    return text.replace('*wizardName*', this.wizardName);
  }
  ManageEnigmaResult(successo: boolean) {
  const nextNodeId = successo ? this.actualPhase.success_node : this.actualPhase.fail_node;
  
  this.actualPhase = this.Data.nodes.find((n: any) => n.id === nextNodeId);
}


  closeManual() {
    this.gameService.closeManual();
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
