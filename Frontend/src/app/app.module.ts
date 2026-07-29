import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { IntroComponent } from './components/intro/intro.component';
import { Part1Component } from './components/Film1/part1/part1.component';
import { Part2Component } from './components/Film1/part2/part2.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

import { FormsModule } from '@angular/forms';
import { Part3Component } from './components/Film1/part3/part3.component';
import { Part4Component } from './components/Film1/part4/part4.component';
import { Part5Component } from './components/Film1/part5/part5.component';
import { Part6Component } from './components/Film1/part6/part6.component';
import { Part7Component } from './components/Film1/part7/part7.component';

import { HttpClientModule } from '@angular/common/http';
import { ManualComponent } from './components/manual/manual.component';
import { EnigmaHubComponent } from './components/enigma-container/enigma-hub/enigma-hub.component';
import { SortingHatComponent } from './components/enigma-container/sorting-hat/sorting-hat.component';
import { PuzzleFrameComponent } from './components/enigma-container/puzzle-frame/puzzle-frame.component';
import { EnigmaBroomComponent } from './components/enigma-container/enigma-broom/enigma-broom.component';
import { MinigameHubComponent } from './components/minigame-container/minigame-hub/minigame-hub.component';
import { SphereMinigameComponent } from './components/minigame-container/sphere-minigame/sphere-minigame.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    IntroComponent,
    Part1Component,
    Part2Component,
    WelcomeComponent,
    Part3Component,
    Part4Component,
    Part5Component,
    Part6Component,
    Part7Component,
    ManualComponent,
    EnigmaHubComponent,
    SortingHatComponent,
    PuzzleFrameComponent,
    EnigmaBroomComponent,
    MinigameHubComponent,
    SphereMinigameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
