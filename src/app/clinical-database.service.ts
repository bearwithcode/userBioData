import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { User } from './model/user';
import { UserBloodPressure } from './model/user-blood-pressure';

/**
 * fake backend and database, but it's acctually frontend!
 */
@Injectable({
  providedIn: 'root',
})
export class ClinicalDatabaseService implements InMemoryDbService {
  private userData: User[] = [
    {
      id: 1,
      email: 'victor@gmail.com',
      password: '123b',
      token: 'iasgosdjaoifgo',
    },
    { id: 2, email: 'tove@gmail.com', password: '345a', token: 'fgdfgdfg' },
  ];

  createDb() {
    const login: User[] = this.userData;
    const users: UserBloodPressure[] =
      this.generateUserBloodPressure();
    return { login, users };
  }

  generateUserBloodPressure(): UserBloodPressure[] {
    return this.userData.map((each) => {
      let result: UserBloodPressure = {
        id: null,
        token: each.token,
        bloodPressure: [],
      };
      let randomPressure = [];
      for (let i = 0; i < 200; i++) {//generate 200 random blood pressure to datebase
        randomPressure.push(Math.floor(Math.random() * 100) + 80);//from 80 to 180
      }
      result.bloodPressure = randomPressure;
      return result;
    });
  }
}
