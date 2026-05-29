import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
   
  script : introDialogue[] = [
    { 
      character : 'Silente',
      image : '',
      text : "Una notte fin troppo tranquilla per il mondo dei babbani..."
    },
    { 
      character : '',
      image : '',
      text : "... Spegni i 3 lampioni pr oscurare la via ... "
    },
    { 
      character : 'Prof.ssa McGranitt',
      image : '',
      text : "Buonasera, Professor Silente. Sono vere le voci? E il bambino?"
    },
    { 
      character : 'Silente',
      image : '',
      text : "Hagrid lo sta portando qui. È l'unico posto sicuro."
    },
    { 
      character : 'Prof.ssa McGranitt',
      image : '',
      text : "Albus, lo lasceremo davvero a queste persone? Li ho osservati tutto il giorno, sono la peggior specie di babbani possibili!"
    },
    { 
      character : 'Silente',
      image : '',
      text : "Sì. è meglio che cresca lontano da tutto questo, finché non sarà pronto. Questo non è un vedo addio dopotutto."
    },
    { 
      character : 'Silente',
      image : '',
      text : "Buona fortuna, harry potter."
    }
  ]

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  nextLine() {
  if (this.currentLine >= this.script.length - 1) {
    this.isDialogueEnd = true;
    this.router.navigate(['/part1']);
    return;
  }

  if (this.currentLine === 1) {
    this.isTransforming = true; 
    setTimeout(() => {
      this.currentLine++;
      this.isTransforming = false;
    }, 2000); 
  } 
  
  else if (this.currentLine === 3) {
    this.isHagridArriving = true; 
    setTimeout(() => {
      this.currentLine++;
      this.isHagridArriving = false;
    }, 3000); 
  } 
  
  else {
    this.currentLine++;
  }
}

  prevLine(){
    if(this.currentLine > 0){
       this.currentLine--;
     }
   }
}
