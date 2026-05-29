import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameDataService {
  
  wizardName: string = '';
  currentWelcomeStep: number = 1;

  constructor() { }
}
