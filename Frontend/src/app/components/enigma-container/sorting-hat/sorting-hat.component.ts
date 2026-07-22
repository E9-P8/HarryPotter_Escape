import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sorting-hat',
  templateUrl: './sorting-hat.component.html',
  styleUrls: ['./sorting-hat.component.css']
})
export class SortingHatComponent implements OnInit {

  hatState: 'neutral' | 'speaking' | 'thinking' = 'neutral';
  hatImageSource: string = 'assets/img/Part5/cappello_neutral.png';
  previousImageSource: string = '';
  isTransitioning: boolean = false;
  quizData: any;
  currentQuestionIndex = 0;
  isProcessingAnswer: boolean = false;

  userAnswers: string[] = [];
  showVideo: boolean = false;

  @Output() quizSolved = new EventEmitter<string>();

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get('assets/data/sorting-hat-data.json').subscribe(data => {
      this.quizData = data;
    });
  }

setHatState(state: 'neutral' | 'speaking' | 'thinking') {
  const nextPath = `assets/img/Part5/cappello_${state}.png`;

  if (this.hatImageSource !== nextPath) {
    this.previousImageSource = this.hatImageSource;
    this.hatImageSource = nextPath;
    this.isTransitioning = true;

    setTimeout(() => {
      this.isTransitioning = false;
      this.previousImageSource = '';
    }, 500);
  }
  }

  handleAnswer(option: any) {
    if (this.isProcessingAnswer) return;

    this.isProcessingAnswer = true;
    this.setHatState('speaking');

    this.userAnswers.push(option.casa);

    setTimeout(() => {
      if (this.quizData && this.currentQuestionIndex < this.quizData.questions.length - 1) {
        console.log(this.userAnswers);
        this.currentQuestionIndex++;
        this.setHatState('neutral');
      } else {
        console.log("Quiz terminato!");
        this.checkFinalResult(); 
      }
      
      this.isProcessingAnswer = false;
    }, 2000);
  }

  checkFinalResult() {
    const total = this.userAnswers.length;
    const griffindorCount = this.userAnswers.filter(casa => casa === 'GRIFONDORO').length;

    if (griffindorCount > (total / 2)) {
      console.log("Assegnato a Grifondoro! Avvio video...");
      this.quizSolved.emit('banchetto'); 
      //this.showVideo = true;
    } else {
      console.log("Non sei un Grifondoro... riprova!");
      this.resetQuiz();
    }
    
  }
  onVideoEnded() {
    this.showVideo = false;
    this.quizSolved.emit('banchetto'); 
  }

  skip(){
    console.log("skip")
  this.quizSolved.emit('banchetto'); 
  }
  resetQuiz() {
    this.currentQuestionIndex = 0;
    this.userAnswers = [];
    this.setHatState('neutral');
    this.isProcessingAnswer = false;
  }
}
