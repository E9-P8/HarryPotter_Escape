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
    Part7Component
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
