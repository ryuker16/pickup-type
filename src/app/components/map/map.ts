import {
  Component, OnInit, Input
} from '@angular/core';

import {NgbPopoverConfig} from '@ng-bootstrap/ng-bootstrap';

/**
map component

pretty bare now until I add the custom marker overlay. Recieves markers for map
via Input from it's parent(menu). The map service it uses relies on the module
ng2-ui-maps that's still pretty limited compared to the angular 1 version. Hence
all the extra work I have to do. For example, there are no options to modify
an info window shows up or css....only click. So customer overlay it is.

Default map configuration settings should go here(like latitude) more about map
module here: https://ng2map.github.io/#/google-map


*/


@Component({
  selector: 'fountain-map',
  styleUrls: ['app/css/bootstrap.min.css'],
  styles: [`.map-container {
  position: absolute;
  height: 100vh;
  width: 100vw;
  z-index: -1000;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}`],
  template: require('./map.html')

})
export class MapComponent {

  constructor() { }

  //@Input() sports: string[];
  @Input() markers: [{}];

  // default map settings - there are many more options availible
  //https://ng2map.github.io/#/google-map
  lat: number = 36.160338;
  lng: number = -86.778780;
  zoom: number = 12;
  zoomIn: boolean = true;



  //test click - delete later
  // mapClicked($event: any) {
  //   this.markers.push({
  //     latitude: $event.coords.lat,
  //     longitude: $event.coords.lng,
  //     title: 'A',
  //     date: 10,
  //     going: 10,
  //     maybeGoing: 19,
  //     sport: 'make new events',
  //     options: {
  //       visibile: true
  //     }
  //   });
  // }

}
