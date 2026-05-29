import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IntroComponent } from './components/intro/intro.component';
import { MenuComponent } from './components/menu/menu.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { Part1Component } from './components/Film1/part1/part1.component';
import { Part2Component } from './components/Film1/part2/part2.component';


const routes: Routes = [
  { path: '', component: MenuComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'intro', component: IntroComponent },
  { path: 'part1',  component: Part1Component },
  { path: 'part2',  component: Part2Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
