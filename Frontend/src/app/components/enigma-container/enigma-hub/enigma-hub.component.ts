import { Component, OnInit, Input, Type} from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { SortingHatComponent } from '../sorting-hat/sorting-hat.component';
import { PuzzleFrameComponent } from '../puzzle-frame/puzzle-frame.component';
import { EnigmaBroomComponent } from '../enigma-broom/enigma-broom.component';

@Component({
  selector: 'app-enigma-hub',
  templateUrl: './enigma-hub.component.html',
  styleUrls: ['./enigma-hub.component.css']
})
export class EnigmaHubComponent implements OnInit {

  @Input() enigmaId: string = '';
  constructor() { }

  ngOnInit(): void {
    console.log("ID ricevuto dall'Hub:", this.enigmaId);
  }

  get componentToLoad(): Type<any> | null {
    switch (this.enigmaId) {
      case 'QUIZ_CASA': return SortingHatComponent;
      case 'QUIZ_FRAME': return PuzzleFrameComponent;
      case 'ENIGMA_SCOPA': return EnigmaBroomComponent;
      default: return null;
    }
  }

}
