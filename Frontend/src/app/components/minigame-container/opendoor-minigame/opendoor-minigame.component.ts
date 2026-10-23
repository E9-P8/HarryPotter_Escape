import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

export interface Fragment {
  id: string;
  house: string;
  text: string;
}
@Component({
  selector: 'app-opendoor-minigame',
  templateUrl: './opendoor-minigame.component.html',
  styleUrls: ['./opendoor-minigame.component.css']
})
export class OpendoorMinigameComponent implements OnInit {

  @Output() minigameSolved = new EventEmitter<string>();

  attemptsLeft: number = 3;
  isCompleted: boolean = false;
  selectedFragment: Fragment | null = null;
  feedbackMessage: string = '';

  // Dati dei 12 frammenti magici
  fragmentsData: Fragment[] = [
    { id: 'f1', house: 'grifondoro', text: 'Affrontare il pericolo.' },
    { id: 'f2', house: 'grifondoro', text: 'Agire nonostante la paura.' },
    { id: 'f3', house: 'grifondoro', text: 'Difendere chi è in difficoltà.' },
    { id: 'f4', house: 'corvonero', text: 'Studiare prima di agire.' },
    { id: 'f5', house: 'corvonero', text: 'Cercare la conoscenza.' },
    { id: 'f6', house: 'corvonero', text: 'Risolvere un mistero.' },
    { id: 'f7', house: 'tassorosso', text: 'Aiutare senza ricompense.' },
    { id: 'f8', house: 'tassorosso', text: 'Restare fedeli agli amici.' },
    { id: 'f9', house: 'tassorosso', text: 'Proteggere un compagno.' },
    { id: 'f10', house: 'serpeverde', text: 'Voler lasciare il segno.' },
    { id: 'f11', house: 'serpeverde', text: 'Perseguire il successo.' },
    { id: 'f12', house: 'serpeverde', text: 'Prendere l\'iniziativa.' }
  ];

  constructor() { }

  // tracciare dove il giocatore sposta i frammenti
  poolFragments: Fragment[] = [];
  placedFragments: { [houseKey: string]: Fragment[] } = {
    grifondoro: [],
    corvonero: [],
    tassorosso: [],
    serpeverde: []
  };

  ngOnInit(): void {
    this.poolFragments = [...this.fragmentsData].sort(() => Math.random() - 0.5);

    console.log("avviato componente porta");
  }

  selectFragment(fragment: Fragment): void {
    if (this.isCompleted) return;

    if (this.selectedFragment?.id === fragment.id) {
      this.selectedFragment = null;
    } else {
      this.selectedFragment = fragment;
    }
  }

  placeInHouse(houseKey: string): void {
    if (!this.selectedFragment || this.isCompleted) return;

    this.removeFragmentFromAll(this.selectedFragment);

    this.placedFragments[houseKey].push(this.selectedFragment);
    this.selectedFragment = null;

  }
  returnToPool(fragment: Fragment): void {
    if (this.isCompleted) return;

    this.removeFragmentFromAll(fragment);
    this.poolFragments.push(fragment);
    this.selectedFragment = null;
  }


  resetAllToPool(): void {
    if (this.isCompleted) return;

    this.poolFragments = [...this.fragmentsData].sort(() => Math.random() - 0.5);
    this.placedFragments = {
      grifondoro: [],
      corvonero: [],
      tassorosso: [],
      serpeverde: []
    };
    this.selectedFragment = null;
  }

  isPoolFull(): boolean {
    return this.poolFragments.length === this.fragmentsData.length;
  }



  private removeFragmentFromAll(fragment: Fragment): void {
    this.poolFragments = this.poolFragments.filter(f => f.id !== fragment.id);
    Object.keys(this.placedFragments).forEach(key => {
      this.placedFragments[key] = this.placedFragments[key].filter(f => f.id !== fragment.id);
    });
  }

  verifySolution(): void {
    if (this.isCompleted || this.attemptsLeft <= 0) return;

    const totalPlaced = Object.values(this.placedFragments).reduce((acc, list) => acc + list.length, 0);
    if (totalPlaced < 12) {
      this.feedbackMessage = 'Posiziona tutti i frammenti prima di verificare.';
      return;
    }

    let isCorrect = true;

    Object.keys(this.placedFragments).forEach(houseKey => {
      const houseList = this.placedFragments[houseKey];
      if (houseList.length !== 3) {
        isCorrect = false;
      } else {
        houseList.forEach(frag => {
          if (frag.house !== houseKey) {
            isCorrect = false;
          }
        });
      }
    });

    if (isCorrect) {
      this.onSuccess();
    } else {
      this.onError();
    }
  }

  private onError(): void {
    this.attemptsLeft--;
    this.feedbackMessage = '"Non hai ancora compreso l\'equilibrio di Hogwarts."';

    if (this.attemptsLeft <= 0) {
      setTimeout(() => {
        this.minigameSolved.emit("dormitory");
      }, 1500);
      } else {
      setTimeout(() => {
        this.resetAllToPool();
        this.feedbackMessage = ''; 
      }, 1800);
    }
  }

  private onSuccess(): void {
    this.isCompleted = true;
    this.feedbackMessage = 'L\'equilibrio è stato trovato!';

    setTimeout(() => {
      this.minigameSolved.emit("enter_fuffy");
    }, 2500);
  }

}
