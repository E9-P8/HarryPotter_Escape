import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IntroComponent } from './components/intro/intro.component';
import { MenuComponent } from './components/menu/menu.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { Part1Component } from './components/Film1/part1/part1.component';
import { Part2Component } from './components/Film1/part2/part2.component';
import { Part3Component } from './components/Film1/part3/part3.component';
import { Part4Component } from './components/Film1/part4/part4.component';
import { Part5Component } from './components/Film1/part5/part5.component';
import { Part6Component } from './components/Film1/part6/part6.component';
import { Part7Component } from './components/Film1/part7/part7.component';


const routes: Routes = [
  { path: '', component: MenuComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'intro', component: IntroComponent },
  { path: 'part1',  component: Part1Component },
  { path: 'part2',  component: Part2Component },
  { path: 'part3',  component: Part3Component },
  { path: 'part4',  component: Part4Component },
  { path: 'part5',  component: Part5Component },
  { path: 'part6',  component: Part6Component },
  { path: 'part7',  component: Part7Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
