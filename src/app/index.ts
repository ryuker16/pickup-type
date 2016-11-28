/**
Main module for the app
Uses only one route right now(routes.ts)

Components:
map component: does the map, child of menu
menu component: parent component makes menu, passes data to map
make component: make modal for events making
event component: pop up modal for showing events results of marker clicks
pipes: not active yet,

shared services: contains the services for app: map serivce, auth.user,
auth login, service and interfaces.

sharedclass(within sharedservices folder): ironically named, contains interfaces not included with typings
such as marker(handles map events) and user(for user profiles)
*/


import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpModule } from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {Ng2ArrayPipesModule, Ng2StringPipesModule } from 'angular-pipes';
import {AgmCoreModule } from 'angular2-google-maps/core';
import { LazyLoadImageModule } from 'ng2-lazyload-image';
import {Ng2PaginationModule} from 'ng2-pagination';
import { ResponsiveModule } from 'ng2-responsive';
import {AuthService, Ng2UiAuthModule} from 'ng2-ui-auth';
import {EventComponent} from './components/event.modal/event';
import {MakeComponent} from './components/make.modal/make';
import {MapComponent} from './components/map/map';
import {MenuComponent} from './components/menu/menu';
import {SearchArray} from './components/pipes/searchField';
import {AuthLogin} from './components/sharedservice/authlogin.service';
import {AuthUser} from './components/sharedservice/auth.user';
import {MapService} from './components/sharedservice/map.service';
import {RootComponent, routing} from './routes';



@NgModule({
  imports: [
    BrowserModule,
    routing,
    NgbModule.forRoot(),
    Ng2UiAuthModule.getWithConfig(AuthUser),
    Ng2ArrayPipesModule,
    Ng2StringPipesModule,
    ReactiveFormsModule,
    ResponsiveModule,
    Ng2PaginationModule,
    LazyLoadImageModule,
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
