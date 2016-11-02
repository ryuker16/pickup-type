import {Injectable} from "@Angular/core";
import {AuthService} from 'ng2-ui-auth';
import { Http, Response } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';
import {user} from './interfaceClass/user';

/**

Auth login service handles user/server authentication

I use ng-ui-auth which is basically a bad copy and paste job of Satttelizer. So
authentication is modified a bit. Login will automatically detect if your logged
into facebook either via local storage or via another browser tab so loging in
is automatic usually.

We get the user data from database. Events made my user can be determined by
group.id which will match the user's facebook id(as opposed to a meetup group ID)


*/
@Injectable()
export class AuthLogin {
  constructor(private auth: AuthService, private http: Http) { }


  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

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
    return this.http.get(`http://52.11.14.57:4000/api/me/?id=${facebookId}`)
      .map(this.extractData)
      .catch((err: any) => { console.log('error with http request getuser'); return err });
  }

  logout() {

    this.auth.logout()
      .subscribe({
        error: (err: any) => console.log(err),
        complete: () => console.log('logged out')
      });
  }


};
