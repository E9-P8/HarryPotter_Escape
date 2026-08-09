import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AudioService } from '../../../services/audio.service';
import { GameDataService } from '../../../services/game-data.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-part5',
  templateUrl: './part5.component.html',
  styleUrls: ['./part5.component.css']
})
export class Part5Component implements OnInit {

  Data: any;     
  actualPhase: any;    
  wizardName: string = this.gameService.wizardName; 

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
  /*startIntroSequence() {
    this.audioService.startGlobalBackground('LetTheMysteryUnfold', 0.3); 
  }*/

  ngOnInit(): void {
    this.wizardName = this.gameService.wizardName;
    this.loadPart();
  }

  loadPart() {
    this.http.get('assets/data/part_5.json').subscribe(data => {
      this.Data = data;
     // this.actualPhase = this.Data.nodes[0];
        
      if (this.Data && this.Data.nodes && this.Data.nodes.length > 0) {

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

 manageChoice(option: any) {
  const nextNodeId = (typeof option === 'string') ? option : option?.next_node;
  const nextNode = this.Data.nodes.find((n: any) => n.id === nextNodeId);

  if (option && option.impact) {
    this.gameService.updateStats(option.impact);
  }

  if (option && option.next_node === 'manual') {
    this.gameService.openManual();
    return; 
  }

  if (option && option.set_flag && option.set_flag.isSeeker !== undefined) {
    this.gameService.setFlag('isSeeker', option.set_flag.isSeeker);
  }

  if (nextNodeId === 'part_6' || nextNodeId === '/part6') {
   // console.log(this.gameService.isSeeker);
    this.router.navigate(['/part6']);
    return;
  }

  if (nextNode) {
    //this.actualPhase = nextNode; 
    this.actualPhase = JSON.parse(JSON.stringify(nextNode));
    this.gameService.setCurrentNode(this.actualPhase.id, 5);

    if (this.actualPhase.text) {
      this.actualPhase.text = this.actualPhase.text.replace('*wizardName*', this.gameService.wizardName);
    }

    if (this.actualPhase.id === 'mcgranitt_baston') {
      this.gameService.setFlag('isSeeker', true);
    }
    const isSeeker = this.gameService.getFlag('isSeeker');

    if (this.actualPhase.id === 'QuidditchTrophy' && isSeeker) {
      this.actualPhase.options = [];
      setTimeout(() => {
        this.manageChoice({ next_node: 'part_6' });
      }, 3000);
      return;
    }

    if (this.actualPhase.type === 'animation') {
      this.handleAnimation(this.actualPhase.id);
      return;
    }

    const isQuidditchAutoAdvance = (this.actualPhase.id === 'QuidditchTrophy' && this.gameService.getFlag('isSeeker'));
    const hasNoOptions = !this.actualPhase.options || this.actualPhase.options.length === 0;

    if ((hasNoOptions || isQuidditchAutoAdvance) && this.actualPhase.next_node) {
      setTimeout(() => {
        this.manageChoice({ next_node: this.actualPhase.next_node });
      }, 3000); 
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
        this.actualPhase = nextNode;
      }
    }, 5000);
  }
  whistles(){ 
    setTimeout(() => {
      this.manageChoice(this.actualPhase.next_node);
    }, 800);
  }



isAlreadySeeker(): boolean {
  return this.gameService.getFlag("isSeeker");
}

} 
