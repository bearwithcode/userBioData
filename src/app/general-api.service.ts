import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './model/user';
import { Observable, catchError, first, map, tap, throwError } from 'rxjs';
import { UserBloodPressure } from './model/user-blood-pressure';

/**
 * this service includes all fake api call.
 * the technology I use is angular-in-memoery-web-api.
 * please be adviced! due to it's limitation it does not support all operations that real backend will support.
 * please take into account this is dummy backend calls, in real world will be different.
 */
@Injectable({
  providedIn: 'root'
})
export class GeneralApiService {

  private userUrl = 'api/login';
  private bloodPressureUrl = 'api/users';


  constructor(private http: HttpClient) { }

  login(user: User) : Observable<User[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    //due to the limitation of in memory mock api call, in real world I would not return all the users.
    //but here I will filter out the correct user.
    //in real world I will post the user email and password as body to backend with url /login.
    //but please understand this is just a mock api call, angular in memory web api does not support all operations.
    return this.http.get<User[]>(this.userUrl, {headers})
    .pipe(
      map(data => data.filter(each => each.email === user.email && each.password === user.password)),
      tap(data => console.log(JSON.stringify(data))),
      catchError(this.handleError)
    );
  }


  //since the in memory mockup api is fake backend, so here need to mockup random number generator.
  fakeMockupGenerateBloodPressure(): number[] {
    let randomPressure = [];
    for (let i = 0; i < 200; i++) {//generate 200 random blood pressure to datebase
      randomPressure.push(Math.floor(Math.random() * 100) + 80);//from 80 to 180
    }
    return randomPressure;
  }

  //due to the limitation of in memory mock api call, only query can be pass back.
  //by default if it's url path value, it will be consider as Id.
  //in real world I will GET /users/{token}/data.
  //but please understand this is just a mock api call, angular in memory web api does not support all operations.
  getUserBloodPressure(token: string): Observable<UserBloodPressure[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.bloodPressureUrl}?token=${token}`;

    return this.http.get<UserBloodPressure[]>(url, {headers})
    .pipe(
      tap(data => console.log(JSON.stringify(data))),
      tap(data => data[0].bloodPressure = this.fakeMockupGenerateBloodPressure()),
      catchError(this.handleError)
    )
  }

  private handleError(err: any) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }
}
