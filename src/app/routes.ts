/// <reference path="../../typings/index.d.ts"/>

import {Component} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
// import {HelloComponent} from './hello';
import {MenuComponent} from './components/menu/menu';


@Component({
  selector: 'fountain-root',
  template: '<router-outlet></router-outlet>'
})
export class RootComponent {}

export const routes: Routes = [
  {
    path: '',
    component: MenuComponent
  }
];

export const routing = RouterModule.forRoot(routes);
