import { Injectable } from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {marker} from '../sharedservice/interfaceClass/marker';
import {Observable} from 'rxjs/Observable';

/**
Map Service

grabs event data from server and holds master list of sports.

**/

@Injectable()
export class MapService {

  // list of sports to export
  listSports: string[] = ['baseball', 'football', 'paddle', 'soccer', 'boxing',
    'golf', 'hockey', 'fencing', 'rugby', 'bowling', 'powerlifting', 'darts', 'fitness',
    'tennis', 'volleyball', 'skateboard', 'kickball', 'bowling', 'billiard',
    'offroad', 'diving', 'ballet', 'chess', 'curling', 'pingpong', 'skiing', 'iceskating', 'skydiving',
    'running', 'hiking', 'skating', 'dance', 'hockey', 'yoga', 'wrestling',
    'squash', 'swimming', 'horseriding', 'fishing', 'billards',
    'softball', 'sailing', 'skiing', 'shooting', 'bike', 'hunting', 'archery',
    'karting', 'kayak', 'climbing', 'snowboarding', 'cricket', 'motorcycle', 'rugby', 'judo', 'scuba', 'barre', 'atv', 'basketball',
    'rowing', 'karate', 'mma', 'equestrian', 'gymnastics'
  ];

  constructor(private http: Http) { }

  //used to grab user data
  getEvent(eventId: string): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    console.log(eventId + ' retrieval started');
    return this.http.get('http://52.11.14.57:4000/api/events/' + eventId, options)
      .map((res: Response) => res.json());
  }

  deleteEvent(eventId: string): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    console.log('event' + eventId + 'deleted event');
    return this.http.delete('http://52.11.14.57:4000/api/events/' + eventId, options)
      .map((res: Response) => res.json());
  }

  leaveEvent(event: any, eventId: string): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    console.log('event' + eventId + 'updated');
    return this.http.put('http://52.11.14.57:4000/api/leave/' + eventId, JSON.stringify(event), options)
      .map((res: Response) => res.json());
  }

  joinEvent(member: marker.RsvpSample, eventId: string): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    console.log('event' + eventId + 'updated');
    return this.http.put('http://52.11.14.57:4000/api/events/' + eventId, JSON.stringify(member), options)
      .map((res: Response) => res.json());
  }

  postEvent(event: marker.MapMarker): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    console.log(event.name + ' creation started');
    return this.http.post('http://52.11.14.57:4000/api/events', JSON.stringify(event), options)
      .map((res: Response) => res.json());
  }

  //return event map data from server
  getMapData(chosen?: string[]): Observable<marker.MapMarker[]> {

    let sports: string[] = ['baseball', 'football', 'paddle', 'soccer', 'boxing',
      'golf', 'hockey', 'fencing', 'rugby', 'bowling', 'powerlifting', 'darts', 'fitness',
      'tennis', 'volleyball', 'skateboard', 'kickball', 'bowling', 'billiard',
      'offroad', 'diving', 'ballet', 'chess', 'curling', 'pingpong', 'skiing', 'iceskating', 'skydiving',
      'running', 'hiking', 'skating', 'dance', 'hockey', 'yoga', 'wrestling',
      'squash', 'swimming', 'horseriding', 'fishing', 'billards',
      'softball', 'sailing', 'skiing', 'shooting', 'bike', 'hunting', 'archery',
      'karting', 'kayak', 'climbing', 'snowboarding',
      'cricket', 'motorcycle', 'rugby', 'judo', 'scuba', 'barre', 'atv', 'basketball',
      'rowing', 'karate', 'mma', 'equestrian', 'gymnastics'
    ];

    let sportChoices: string[] = chosen !== undefined ? chosen : sports;

    // returns all we need to to make googe map markers and populate out menus
    return this.http.get('http://52.11.14.57:4000/api/events')
      .map((result: Response) => {
        let finalArray = result.json();
        // this looks od but makes sense; RxJS map
        finalArray.map((response: marker.MapMarker) => {
          //introduce random offset to give icons space from each other
          if (response.venue !== undefined) {
            response.venue.lon += Math.random() * 0.001;
            response.venue.lat += Math.random() * 0.001;
          }

          // get sport choice match to identify sport
          for (let i = 0; i < sportChoices.length; i++) {
            //add description if not existing or empty string
            if (response.description === undefined) {
              response.description = 'No Description Provided';
            }
            // set yes_rsvp_count
            response.yes_rsvp_count = response.rsvp_sample.length;
            //set default visibility
            response.options = {
              visible: true
            };

            let search1 = response.group.name.toLowerCase().search(sportChoices[i].toLowerCase());

            let search2 = response.description.toLowerCase().search(sportChoices[i].toLowerCase());

            //find match to identify sports
            if (!response.sport) {

              if (search1 !=
                -1 || search2 != -1) {
                //console.log(sportChoices[i]);
                response.sport = sportChoices[i];
              }
            }
          }
          return response;
        })

        //console.log(finalArray);
        let lastArray = finalArray.filter(function(ele) {
          //console.log(ele.name);
          if (ele.venue !== undefined && ele.venue !== null)
            return true
        });
        return lastArray

      })

  }
}
