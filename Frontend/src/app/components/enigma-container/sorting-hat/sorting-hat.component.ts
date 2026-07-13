import { Component, OnInit } from '@angular/core';
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
    }, 500);
  }
  /*
    if (this.hatState !== state) {
      this.hatState = state;
      this.hatImageSource = `assets/img/Part5/cappello_${state}.png`;
    }*/
  }

  handleAnswer(option: any) {
    this.setHatState('speaking');
    // Logica per passare alla prossima domanda...
  }
}
