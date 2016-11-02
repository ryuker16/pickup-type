import {Component, Input} from '@angular/core';
import {marker} from '../sharedservice/interfaceClass/marker';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'modal-event',
  template: require('./event.html')

})
export class EventComponent {
  constructor(public activeModal: NgbActiveModal) {
  }
  @Input() model: marker.MapMarker;

}
