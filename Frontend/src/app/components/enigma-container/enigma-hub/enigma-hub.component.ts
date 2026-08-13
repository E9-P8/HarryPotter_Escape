import { Component, OnInit, Input, Type, Output, EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { SortingHatComponent } from '../sorting-hat/sorting-hat.component';
import { PuzzleFrameComponent } from '../puzzle-frame/puzzle-frame.component';
import { EnigmaBroomComponent } from '../enigma-broom/enigma-broom.component';
import { EnigmaDoorComponent } from '../enigma-door/enigma-door.component';
import { FeatherEnigmaComponent } from '../feather-enigma/feather-enigma.component';

@Component({
  selector: 'app-enigma-hub',
  templateUrl: './enigma-hub.component.html',
  styleUrls: ['./enigma-hub.component.css']
})
export class EnigmaHubComponent implements OnInit {

  @Input() enigmaId: string = '';
  @Output() quizSolved = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
    console.log("ID ricevuto dall'Hub:", this.enigmaId);
  }

  get componentToLoad(): Type<any> | null {
    switch (this.enigmaId) {
      case 'QUIZ_CASA': return SortingHatComponent;
      case 'QUIZ_FRAME': return PuzzleFrameComponent;
      case 'ENIGMA_SCOPA': return EnigmaBroomComponent;
      case 'DOOR_QUIZ': return EnigmaDoorComponent;
      case 'FEATHER_QUIZ': return FeatherEnigmaComponent;
      default: return null;
    }
  }
  onQuizSolved(nextNode: string) {
    this.quizSolved.emit(nextNode);
  }

}
