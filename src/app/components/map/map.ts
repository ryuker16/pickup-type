import {
  Component, OnInit, Input
} from '@angular/core';
//import {MapService} from './map.service';
// import archery from './images';
import {NgbPopoverConfig} from '@ng-bootstrap/ng-bootstrap';

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
  providers: [NgbPopoverConfig],
  template: require('./map.html')

})
export class MapComponent {

  constructor() { }

  //@Input() sports: string[];
  @Input() markers: [{}];

  // default map settings
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
