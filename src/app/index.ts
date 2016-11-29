/**
* Main module for the app
* Uses only one route right now(routes.ts)
*
* Components:
* map component: does the map, child of menu
* menu component: parent component makes menu, passes data to map and modals
* make component: pop up modal for events making
* event component: pop up modal for showing events results of marker clicks
* pipes: not active yet,
*
* Shared services: contains the services for app: map service, auth.user,
* authlogin service
*
* Interface: where types are stored aside from out global typings loaded via
* configs such as marker(handles map events) and user(for user profiles).
*
* 
*/

import {NgModule} from '@angular/core';
// Form Builder
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpModule } from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
// Angular 2 Bootstrap
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
//import {Ng2ArrayPipesModule, Ng2StringPipesModule } from 'angular-pipes';
// google maps angular2
import {AgmCoreModule } from 'angular2-google-maps/core';
// Pagination
import {Ng2PaginationModule} from 'ng2-pagination';
// mobile device detection
import {ResponsiveModule } from 'ng2-responsive';
//  Satellizer Angular 2 - used for user authentication with AuthUser containing
//  OAuth configuration
import {AuthService, Ng2UiAuthModule} from 'ng2-ui-auth';
// dynamic event modal
import {EventComponent} from './components/event.modal/event';
// dynamic make new event modal
import {MakeComponent} from './components/make.modal/make';
// Map component for making the google map
import {MapComponent} from './components/map/map';
// parent component: handles state for all other child components
import {MenuComponent} from './components/menu/menu';
// un-used pipe for search results
import {SearchArray} from './components/pipes/searchField';
// Login Service
import {AuthLogin} from './components/sharedservice/authlogin.service';
// AuthUser service is what Login Service uses for User Authentication via
// Sattelizer
import {AuthUser} from './components/sharedservice/auth.user';
// Handles our google map data and event API communication
import {MapService} from './components/sharedservice/map.service';
// Routing and our Root Component
import {RootComponent, routing} from './routes';



@NgModule({
  imports: [
    BrowserModule,
    routing,
    NgbModule.forRoot(),
    Ng2UiAuthModule.getWithConfig(AuthUser),
    ReactiveFormsModule,
    ResponsiveModule,
    Ng2PaginationModule,
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
