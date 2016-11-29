import {Injectable} from "@angular/core";
import {Http, Response } from '@angular/http';
import {AuthService} from 'ng2-ui-auth';
import {Observable} from 'rxjs/Observable';

/**
Auth login Service handles user/server authentication

** relies on AuthService(Sattelizer for Ng2) **
** Used heavily by our chief parent component "MenuComponent" in menu.ts **

I use ng-ui-auth which is basically a bad copy and paste job of Satttelizer. So
authentication is modified a bit. Login will automatically detect if your logged
into facebook either via local storage or via another browser tab so loging in
is automatic usual in browsers like chrome.

We get the user data for events from database. Events made my user can be determined by group.id which will match the user's facebook id(as opposed to a meetup group ID)

*/
@Injectable()
export class AuthLogin {

  constructor(private auth: AuthService, private http: Http) { }

  /**
   * [extractData  extracts response body]
   * @param  {Response} res [response data]
   * @return {[any]}
   */
  private extractData(res: Response): any {
    let body = res.json();
    return body || {};
  }

  /**
   * [loginFacebook  logs in to facebooks OAuth Service, will also place]
   * @return {Observable<any>}
   */
  loginFacebook(): Observable<any> {
    return this.auth.authenticate('facebook')
      .map(this.extractData)
      .catch((err: any) => { console.log('error logging into facebook'); return err; });
  }
  /**
   * [authorized  Sattelizer's service to check if user is already logged in]
   * @return {[boolean]} [if loggined in, returns true]
   */
  authorized(): boolean {
    return this.auth.isAuthenticated();
  }
  /**
   * [getPayload get addition facebook user details, not needed or used]
   * @return {[any]}
   */
  getPayload(): any {
    return this.auth.getPayload();
  }
  /**
   * [getUser get data and their events from our database]
   * @param  {string}          facebookId [user id string]
   * @return {Observable<any>}
   */
  getUser(facebookId: string): Observable<any> {
    return this.http.get(`http://52.11.14.57:4000/api/me/?id=${facebookId}`)
      .map(this.extractData)
      .catch((err: any) => { console.log('error with http request getuser'); return err; });
  }
  /**
   * [logout logs out user account ]
   */
  logout(): void {
    this.auth.logout()
      .subscribe({
        error: (err: any) => console.log(err),
        complete: () => console.log('logged out')
      });
  }


};
