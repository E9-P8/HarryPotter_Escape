import { Component, OnInit , Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-enigma-broom',
  templateUrl: './enigma-broom.component.html',
  styleUrls: ['./enigma-broom.component.css']
})
export class EnigmaBroomComponent implements OnInit {

  currentBroomImage: string = '/assets/img/Part5/volo_enigmaScopa.png'; 
  solvedBroomImage: string = '/assets/img/Part5/solvedBroom.png';

  currentStep: number = 0;
  targetSequence: string[] = ['tail', 'center', 'tail', 'tip']; 
  feedbackMessage: string = "Il legno è rigido. Trova il punto di leva per sbloccarlo.";
  isError: boolean = false;
  isSolved: boolean = false;
  isAnimating: boolean = false;
  showNewBackground: boolean = false;

  @Output() quizSolved = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

 handleBroomPart(part: 'tail' | 'center' | 'tip') {
  if (this.isSolved || this.isAnimating) return;

  if (part === this.targetSequence[this.currentStep]) {
    this.currentStep++;
    this.isError = false;

    if (this.currentStep === this.targetSequence.length) {
      this.solvedBroomPuzzle();
    } else {
        const progressMessages = [
          "Una leggera resistenza cede. Il manico freme.",
          "La pressione si propongo lungo le fibre...",
          "Quasi ci siamo, il legno riconosce il comando."
        ];
        this.feedbackMessage = progressMessages[this.currentStep - 1] || "Continua a insistere...";}
  } else {
      this.currentStep = 0;
      this.isAnimating = true;
      this.isError = true;
      this.feedbackMessage = "Il manico si irrigidisce di nuovo. L'energia svanisce!";
      
      setTimeout(() => {
        this.isError = false;
        this.isAnimating = false;
        this.feedbackMessage = "Il legno vibra debolmente sotto la polvere. Trova il punto di tensione.";
      }, 600);
  }
}

  solvedBroomPuzzle() {
    this.isSolved = true;
    this.isAnimating = true;
    this.feedbackMessage = "Il manico risponde! La scopa si stacca da terra!";
  //  this.currentBroomImage = this.solvedBroomImage;

  setTimeout(() => {
      
     this.showNewBackground = true;
     setTimeout(() => {
        this.quizSolved.emit('malfoy');
      }, 1000);

    }, 1000); 
  }

}
