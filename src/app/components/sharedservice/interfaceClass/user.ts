import {marker} from './marker';

export namespace user {

  export interface Summary {
    total_count: number;
  }

  export interface Friend {
    summary?: Summary;
    data?: any[];
  }

  export interface UserProfile {
    displayName: string;
    picture: string;
    bigPicture: string;
    facebook: string;
    email: string;
    link: string;
    firstName: string;
    lastName: string;
    friends?: Friend[];
    __v?: number;
    userEvents?: marker.MapMarker[];
  }

}
