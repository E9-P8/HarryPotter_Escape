import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameDataService } from '../../services/game-data.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {


  wizardName = "";
  showInsertName = false; 

  constructor(private router: Router, private gameData: GameDataService) { }

  ngOnInit(): void {}

  registration(){
    this.showInsertName = true;
  }

  startGame(){
    this.gameData.wizardName = this.wizardName;
    console.log(this.wizardName);
    this.router.navigate(['/welcome']);
   }

}
