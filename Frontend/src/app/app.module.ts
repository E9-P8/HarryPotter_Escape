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

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    IntroComponent,
    Part1Component,
    Part2Component,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
