import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

/**
Map Service

grabs event data from server and holds master list of sports.

*/

@Injectable()
export class MapService {

  // list of sports to export
  listSports: string[] = ["baseball", "football", "paddle", "soccer", "boxing", "golf", "hockey",
    "tennis", "volleyball", "skateboard", "kickball", "bowling", "pool", "offroad",
    "running", "hiking", "skating", "dance", "yoga", "wrestling", "squash", "swimming", "horseriding", "fishing",
    "handball", "sailing", "shooting", "bike", "hunting", 'archery', 'karting', 'atv', "karting", "kayaking", 'climbing',
    'cricket', 'motorcycle', 'judo', 'barre', 'atv', 'basketball', 'rowing', 'karate', 'mma', 'equestrian', 'gymnastics'
  ];

  constructor(private http: Http) { }

  // uses promises instead of RxJS observables....will probaly convert later and
  // add interfaces
  getMapData(chosen?: string[]): any {

    let sports: string[] = ["baseball", "football", "paddle", "soccer", "boxing", "golf", "hockey",
      "tennis", "volleyball", "skateboard", "kickball", "bowling", "pool", "offroad",
      "running", "hiking", "skating", "dance", "yoga", "wrestling", "squash", "swimming", "horseriding", "fishing",
      "handball", "sailing", "shooting", "bike", "hunting", 'archery', 'karting', 'atv', "karting", "kayaking", 'climbing',
      'cricket', 'motorcycle', 'judo', 'barre', 'atv', 'basketball', 'rowing', 'karate', 'mma', 'equestrian', 'gymnastics'
    ];
    // returns all we need to to make googe map markers and populate out menus
    return this.http.get('http://localhost:4000/api/events')
      .toPromise()
      .then((response: Response) => {
        let results: any = response.json();
        console.log(results);
        let finalArray: any = results.map(function(results) {
          let sportChoices: any = chosen !== undefined ? chosen : sports;
          if (results.venue) {
            for (var i = 0; i < sportChoices.length; i++) {
              if (results.description == undefined) {
                results.description = "No Description Provided";
              }

              if (results.group.name.toLowerCase().search(sportChoices[i].toLowerCase()) !=
                -1 || results.description.toLowerCase().search(sportChoices[i].toLowerCase()) != -1) {

                return {
                  allData: results,
                  latitude: results.venue.lat,
                  longitude: results.venue.lon,
                  sport: sportChoices[i],
                  address: results.venue.address_1,
                  title: results.name,
                  time: results.time,
                  duration: results.duration,
                  lastUpdated: results.updated,
                  description: results.description,
                  id: results.created,
                  venue: results.venue,
                  eventHosts: results.event_hosts,
                  group: results.group,
                  url: results.event_url,
                  rsvp: results.rsvp_sample,
                  groupPhoto: results.group.group_photo.thumb_link,
                  howFind: results.how_to_find_us,
                  going: results.yes_rsvp_count,
                  maybeGoing: results.maybe_rsvp_count,
                  options: {
                    visible: true
                  }
                }
              }
            }
          }

        });
        //filter out undefined elements
        let markers: any = finalArray.filter(function(ele) {
          return ele !== undefined;
        });

        return markers;

      })
      .catch(this.handleError);


  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error getting event data';
    console.error(errMsg); // log to console instead
    return Promise.reject(errMsg);
  }

}
