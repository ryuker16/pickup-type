import {Component, Input, ElementRef, OnInit, ViewChild} from '@angular/core';
import {user} from '../sharedservice/interfaceClass/user';
import {marker} from '../sharedservice/interfaceClass/marker';
import {NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {MapService} from '../sharedservice/map.service';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'make-event',
  template: require('./make.html'),
})
export class MakeComponent implements OnInit {

  @Input() userInfo: user.UserProfile;

  searchLocation: FormControl;

  @ViewChild("searchPlace")
  public searchElementRef: ElementRef;

  sports: string[] = this.mapService.listSports.sort();



  constructor(private mapService: MapService,
    private mapsAPILoader: MapsAPILoader,
    public activeModal: NgbActiveModal) { }

  //adding the google map search bar to angular2-google-map
  ngOnInit() {


    this.searchLocation = new FormControl();

    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });

      autocomplete.addListener("place_changed", () => {
        //get the place result
        let place: google.maps.places.PlaceResult = autocomplete.getPlace();
        console.log(place);

      })
    })

  }

}
