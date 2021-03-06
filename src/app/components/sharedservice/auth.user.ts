import {Injectable} from "@angular/core";
import {CustomConfig} from 'ng2-ui-auth';

/**
 * AuthUser Service
 *
 *   Custom config for Sattelizer OAuth service which AuthLogin uses
 *
 *
 */
@Injectable()
export class AuthUser extends CustomConfig {
  baseUrl = 'http://52.11.14.57:4000/';
  tokenRoot = null;
  unlinkUrl = '/auth/unlink/';
  tokenName = 'token';
  httpInterceptor = true;
  withCredentials = false;
  tokenPrefix = 'satellizer';
  tokenHeader = 'Authorization';
  storageType = 'localStorage';
  tokenType = 'Bearer';
  defaultHeaders: { [name: string]: string; } = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': '*'
  };
  providers = <any>
  {
    facebook: {
      name: 'facebook',
      clientId: '164197200662441',
      responseType: 'code',
      url: '/auth/facebook',
      authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
      redirectUri: window.location.origin + '/',
      requiredUrlParams: ['display', 'scope'],
      scope: ['email', 'public_profile'],
      scopeDelimiter: ',',
      display: 'popup',
      oauthType: '2.0',
      popupOptions: {
        width: 580,
        height: 400
      }
    }
  };


}
