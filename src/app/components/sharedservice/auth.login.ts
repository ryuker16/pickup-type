import {Injectable} from "@Angular/core";
import {AuthService} from 'ng2-ui-auth';
import { Http, Response } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';
import {User} from './interfaceClass/user';

@Injectable()
export class AuthLogin {
  constructor(private auth: AuthService, private http: Http) { }



  loginFacebook(): Observable<any> {
    return this.auth.authenticate('facebook')
      .map(this.extractData)
      .catch((err: any) => { console.log('error logging into facebook'); return err });
  }


  authorized() {
    return this.auth.isAuthenticated();
  }
  getPayload() {
    this.auth.getPayload();
  }

  getUser(facebookId: string): Observable<any> {
    return this.http.get(`http://localhost:4000/api/me/?id=${facebookId}`)
      .map(this.extractData)
      .catch((err: any) => { console.log('error with http request getuser'); return err });
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }


  logout() {

    this.auth.logout()
      .subscribe({
        error: (err: any) => console.log(err),
        complete: () => console.log('logged out')
      });
  }

  link() {
    this.auth.link('facebook')
      .subscribe({
        error: (err: any) => console.log(err),
        complete: () => {
          console.log(this.auth.getExpirationDate());
          console.log(this.auth.getPayload());
        }
      });
  }
};
