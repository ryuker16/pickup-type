import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {marker} from '../interface/marker';
import {user} from '../interface/user';
import {MapService} from '../sharedservice/map.service';

/**
 *  Event modal - displays user or meetup.com events in popup modal
 *
 *  created when passed into menu component, it's a dynamicly created
 *  outputs login and reload/reset map markers to Menu Component
 *
 */

@Component({
  selector: 'modal-event',
  template: require('./event.html'),
  styles: [`
    .modal-dialog {
    max-width: 700px !important;
  }
  .infoText  {
    display: inline;
  }

    div.btn-group {
    margin: 0 auto;
    text-align: center;
    width: inherit;
    display: inline-block;
  }

  div.btn-group-wrap {
    margin-top: 2%;
    text-align: center;
  }

    :host >>>   div.innerContent img {
      width: 100%;
      height: auto;
    }
    `
  ]
})
export class EventComponent {
  constructor(public activeModal: NgbActiveModal, private mapService: MapService) {
  }
  @Input() model: marker.MapMarker;
  @Input() userInfo: user.UserProfile;
  @Input() status: boolean;
  @Output() login: EventEmitter<any> = new EventEmitter();
  @Output() resetMarkers: EventEmitter<any> = new EventEmitter();

  /**
   * [deleted determines if delete button is present if user created event]
   * @type {Boolean}
   */
  deleted: Boolean = false;

  /**
   * [logMeIn output request to log in user; status is updated locally when fired ]
   */
  logMeIn(): void {
    this.login.emit();
    this.status = true;
  }


  makeMember(maybe?: boolean): marker.RsvpSample {

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
    };
    return member;
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
        error: (err: any) => {
          console.log(err)
        },
        complete: () => {
          this.model.yes_rsvp_count++;
          this.model.rsvp_sample.push(update);
          this.resetMarkers.emit();
          console.log("event joined");
        }
      });
  }

  leaveEvent(maybe: boolean, eventId: string, userEvent: marker.MapMarker): void {

    let attending: marker.RsvpSample[] = [];
    let filteredEvent: marker.RsvpSample[] = [];

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
            console.log("user left event");
          }
        });
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
          console.log("event destroyed");
        }
      });
  }



}
