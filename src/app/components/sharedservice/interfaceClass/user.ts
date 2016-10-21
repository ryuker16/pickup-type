
export interface User {
  _id: string;
  displayName: string;
  picture?: string;
  bigPicture?: string;
  facebook: string;
  email: string;
  link: string;
  first_name: string;
  last_name: string;
  friends: {
    data: any[],
    summary: {
      total_count: number
    }
  };
  __v: number;
}
