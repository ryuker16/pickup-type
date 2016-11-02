/**
Main module for the app
Uses only one route right now(routes.ts)

Components:
map component: does the map, child of menu
menu component: parent component makes menu, passes data to map

pipes: not active yet,

shared services: contains the services for app: map serivce, auth.user,
auth login serviceand interfaces(interfaceClass).
 I was lazy on implementing interfaceClasses so not many are used yet.



*/


import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {routing, RootComponent} from './routes';
import {AgmCoreModule } from 'angular2-google-maps/core';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MapComponent} from './components/map/map';
import {MakeComponent} from './components/make.modal/make';
import {EventComponent} from './components/event.modal/event';
import {HttpModule, JsonpModule } from '@angular/http';
import {MapService} from './components/sharedservice/map.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MenuComponent} from './components/menu/menu';
import {Ng2ArrayPipesModule, Ng2StringPipesModule } from 'angular-pipes';
import {SearchArray} from './components/pipes/searchField';
import {AuthUser} from './components/sharedservice/auth.user';
import {AuthLogin} from './components/sharedservice/auth.login';
import {Ng2UiAuthModule, AuthService} from 'ng2-ui-auth';


@NgModule({
  imports: [
    BrowserModule,
    routing,
    NgbModule.forRoot(),
    Ng2UiAuthModule.getWithConfig(AuthUser),
    Ng2ArrayPipesModule,
    Ng2StringPipesModule,
    ReactiveFormsModule,
    FormsModule,
    HttpModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDxUvPi28pVIgpZyYmjpH3YAZWa6VqMPQY',
      libraries: ["places"]
    })
  ],
  declarations: [
    RootComponent,
    MapComponent,
    MenuComponent,
    SearchArray,
    MakeComponent,
    EventComponent
  ],
  providers: [
    MapService, AuthUser, AuthLogin, AuthService
  ],
  entryComponents: [MakeComponent, EventComponent],
  bootstrap: [RootComponent]
})
export class AppModule { }
