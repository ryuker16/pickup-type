import {Component, Input, Output, EventEmitter} from '@angular/core';
import {marker} from '../sharedservice/interfaceClass/marker';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {user} from '../sharedservice/interfaceClass/user';
import {MapService} from '../sharedservice/map.service';



@Component({
  selector: 'modal-event',
  template: require('./event.html')
})
export class EventComponent {
  constructor(public activeModal: NgbActiveModal, private mapService: MapService) {
  }
  @Input() model: marker.MapMarker;
  @Input() userInfo: user.UserProfile;
  @Input() status: boolean;
  @Input() setMarkersFirst;
  @Input() login;
  @Output() resetMarkers: EventEmitter<any> = new EventEmitter();

  deleted: Boolean = false;



  makeMember(maybe?: boolean) {

    let member: marker.RsvpSample = {
      //mtime: Date.now(),
      member_photo: {
        thumb_link: this.userInfo.picture,
        //photo_link: this.userInfo.bigPicture,
        type: 'facebook',
        base_url: this.userInfo.link,
      },
      member: {
        name: this.userInfo.displayName,
        member_id: +this.userInfo.facebook,
        facebookId: this.userInfo.facebook,
        maybe_going: maybe == true ? maybe : false
      }
    }
    return member
  };


  joinEvent(maybe: boolean, eventId: string) {

    let update = maybe ? this.makeMember(maybe) : this.makeMember();

    if (maybe) {
      this.model.maybe_rsvp_count++;
    }



    this.mapService.joinEvent(update, eventId)
      .subscribe({
        next: (value) => {
          console.log(value);
        },
        error: (err: any) => console.log(err),
        complete: () => {

          this.model.yes_rsvp_count++;
          this.model.rsvp_sample.push(update);
          this.resetMarkers.emit();
          console.log("event joined")
        }
      })
  }

  leaveEvent(maybe: boolean, eventId: string, userEvent: marker.MapMarker): void {

    let attending: Array<marker.RsvpSample> = [];
    let filteredEvent: Array<marker.RsvpSample> = [];

    userEvent.rsvp_sample.map((value) => {
      if (value.member.facebookId !== this.userInfo.facebook) {
        filteredEvent.push(value);
      } else {
        attending.push(value);
      }
    });
    //let update = maybe ? this.makeMember(maybe) : this.makeMember();
    if (attending.length === 0) {
      console.log('you had enough of pressing that button!');
    } else {
      this.mapService.leaveEvent(filteredEvent, eventId)
        .subscribe({
          next: (value) => {
            console.log(value);
          },
          error: (err: any) => console.log(err),
          complete: () => {

            this.model.yes_rsvp_count--;
            this.model.rsvp_sample = filteredEvent;
            //this.setMarkersFirst();
            this.resetMarkers.emit();
            console.log("user left event ")
          }
        })
    }
  }

  deleteEvent(eventId: string) {

    this.mapService.deleteEvent(eventId)
      .subscribe({
        next: (value) => {
          console.log(value);
        },
        error: (err: any) => console.log(err),
        complete: () => {
          this.deleted = true;
          //this.setMarkersFirst();
          this.resetMarkers.emit();
          console.log("event destroyed")
        }
      })
  }



}
