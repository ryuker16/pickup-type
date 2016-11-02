import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import {marker} from '../sharedservice/interfaceClass/marker';
import {Observable} from 'rxjs/Observable';

/**
Map Service

grabs event data from server and holds master list of sports.

*/

@Injectable()
export class MapService {

  // list of sports to export
  listSports: string[] = ["baseball", "football", "paddle", "soccer", "boxing", "golf", "hockey",
    "tennis", "volleyball", "skateboard", "kickball", "bowling", "pool", "offroad",
    "running", "hiking", "skating", "dance", "hockey", "yoga", "wrestling", "squash", "swimming", "horseriding", "fishing",
    "handball", "sailing", "skiing", "shooting", "bike", "hunting", 'archery', 'karting', 'atv', "karting", "kayaking", 'climbing',
    'cricket', 'motorcycle', 'rugby', 'judo', 'scuba', 'barre', 'atv', 'basketball', 'rowing', 'karate', 'mma', 'equestrian', 'gymnastics'
  ];

  constructor(private http: Http) { }
  //return event map data from server
  getMapData(chosen?: string[]): Observable<marker.MapMarker[]> {

    let sports: string[] = ["baseball", "football", "paddle", "soccer", "boxing", "golf", "hockey",
      "tennis", "volleyball", "skateboard", "kickball", "bowling", "pool", "offroad",
      "running", "hiking", "skiing", "skating", "dance", "hockey", "yoga", "wrestling", "squash", "swimming", "horseriding", "fishing",
      "handball", "sailing", "shooting", "bike", "hunting", 'archery', 'karting', 'atv', "karting", "kayaking", 'climbing',
      'cricket', 'motorcycle', 'scuba', 'judo', 'barre', 'atv', 'basketball', 'rowing', 'karate', 'mma', 'equestrian', 'gymnastics'
    ];

    let sportChoices: string[] = chosen !== undefined ? chosen : sports;

    // returns all we need to to make googe map markers and populate out menus
    return this.http.get('http://52.11.14.57:4000/api/events')
      .map((result) => {
        let finalArray = result.json();
        // this looks od but makes sense; RxJS map
        finalArray.map((response) => {
          //introduce random offset to give icons space from each other
          if (response.venue !== undefined) {
            response.venue.lon += Math.random() * 0.01;
            response.venue.lat += Math.random() * 0.01;
          }

          // get sport choice match to identify sport
          for (var i = 0; i < sportChoices.length; i++) {
            //add description if not existing or empty string
            if (response.description === undefined) {
              response.description = "No Description Provided";
            }
            //set default visibility
            response.options = {
              visible: true
            };

            let search1 = response.group.name.toLowerCase().search(sportChoices[i].toLowerCase());

            let search2 = response.description.toLowerCase().search(sportChoices[i].toLowerCase());

            //find match to identify sports
            if (search1 !=
              -1 || search2 != -1) {
              console.log(sportChoices[i]);
              response.sport = sportChoices[i];


            }

          }

          return response;
        })
        // console.log(finalArray.filter((ele) => { return ele.venue.lat !== undefined }));
        // return finalArray.filter((ele) => {
        //   if (ele.venue.lat !== undefined) {
        //     return true
        //   }
        console.log(finalArray);
        let lastArray = finalArray.filter(function(ele) {
          console.log(ele.name);
          if (ele.venue !== undefined && ele.venue !== null)
            return true
        });
        return lastArray

      })

  }
}
