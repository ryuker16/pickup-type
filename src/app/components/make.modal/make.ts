import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import {NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MapsAPILoader } from 'angular2-google-maps/core';
import {marker} from '../interface/marker';
import {user} from '../interface/user';
import {MapService} from '../sharedservice/map.service';



@Component({
  selector: 'make-event',
  template: require('./make.html'),
})
export class MakeComponent implements OnInit {

  // get user profiles
  @Input() userInfo: user.UserProfile;

  //find our search input to get google maps auto complete
  @ViewChild("searchPlace")
  public searchElementRef: ElementRef;
  // sports list
  sports: string[] = this.mapService.listSports.sort();
  //ngInit will use this to store place results
  place: google.maps.places.PlaceResult;
  // our form group
  eventForm: FormGroup;
  //form success
  formSubmitted: boolean = false;

  constructor(private mapService: MapService,
    private mapsAPILoader: MapsAPILoader,
    public activeModal: NgbActiveModal, private fb: FormBuilder) {

    this.eventForm = fb.group({
      title: [''],
      duration: [''],
      chooseSport: [''],
      description: [''],
      phone: [''],
      email: [''],
      locationHelp: [''],
      searchPlace: [''],
      startTime: ['']
    });

  }

  //adding the google map search bar to angular2-google-map
  ngOnInit() {

    this.formSubmitted = false;
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });

      autocomplete.addListener("place_changed", () => {
        //get/set the place result
        this.place = autocomplete.getPlace();
        console.log(this.place);

      });
    });

  }
  // used to create event & mapMarker combing form data with venue
  makeEvent(fv: any, ven: google.maps.places.PlaceResult): marker.MapMarker {

    return {
      venue: {
        lat: ven.geometry.location.lat(),
        lon: ven.geometry.location.lng(),
        address_1: ven.formatted_address,
        name: ven.name,
      },
      headcount: 0,

      id: this.userInfo.facebook + Date.now(),
      waitlist_count: 0,
      maybe_rsvp_count: 0,
      description: fv.description,
      how_to_find_us: fv.locationHelp,
      email: fv.email,
      phone: fv.phone,
      yes_rsvp_count: 1,
      name: fv.title,
      created: Date.now(),
      time: fv.startTime,
      sport: fv.chooseSport,
      group: {
        id: +this.userInfo.facebook,
        facebookId: this.userInfo.facebook,
        name: this.userInfo.displayName,
        who: 'facebook',
        group_photo: {
          thumb_link: this.userInfo.picture,
          //photo_link: this.userInfo.bigPicture,
          type: 'facebook',
          base_url: this.userInfo.link,
        }
      },
      status: 'user',
      rsvp_sample: [{
        member_photo: {
          thumb_link: this.userInfo.picture,
          //photo_link: this.userInfo.bigPicture,
          type: 'facebook',
          base_url: this.userInfo.link,
        },
        member: {
          name: this.userInfo.displayName,
          member_id: +this.userInfo.facebook,
          facebookId: this.userInfo.facebook
        }
      }],
      options: { visible: true }
    };
  }

  submitForm(formValues: any) {
    let newEvent = this.makeEvent(formValues, this.place);
    this.formSubmitted = true;
    this.mapService.postEvent(newEvent)
      .subscribe({
        next: (value) => {
          console.log(value);
        },
        error: (err: any) => console.log(err),
        complete: () => { console.log("event sent"); }
      });

    console.log(newEvent);
  }

}
