declare namespace marker {

  export interface Venue {
    repinned: boolean;
    lat: number;
    state: string;
    id: number;
    name: string;
    phone: string;
    lon: number;
    address_1: string;
    city: string;
    localized_country_name: string;
    country: string;
    zip: string;
  }

  export interface GroupPhoto {
    thumb_link: string;
    photo_link: string;
    type: string;
    base_url: string;
    photo_id: number;
    highres_link: string;
  }

  export interface Group {
    who: string;
    group_lat: number;
    group_photo: GroupPhoto;
    urlname: string;
    id: number;
    group_lon: number;
    name: string;
    created: number;
    join_mode: string;
  }

  export interface MemberPhoto {
    thumb_link: string;
    photo_link: string;
    type: string;
    base_url: string;
    photo_id: number;
    highres_link: string;
  }

  export interface Self {
    friend: boolean;
  }

  export interface Member {
    self: Self;
    name: string;
    member_id: number;
  }

  export interface RsvpSample {
    member_photo: MemberPhoto;
    created: number;
    mtime: number;
    rsvp_id: number;
    member: Member;
  }

  export interface Marker {
    utc_offset: number;
    venue: Venue;
    headcount: number;
    distance: number;
    visibility: string;
    waitlist_count: number;
    created: number;
    maybe_rsvp_count: number;
    description: string;
    how_to_find_us: string;
    event_url: string;
    yes_rsvp_count: number;
    name: string;
    id: string;
    time: number;
    updated: number;
    group: Group;
    status: string;
    rsvp_sample: RsvpSample[];
  }

}
