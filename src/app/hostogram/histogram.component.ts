import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { GeneralApiService } from '../general-api.service';
import {
  BehaviorSubject,
  Observable,
  Subject,
  combineLatest,
  combineLatestWith,
  first,
  map,
  switchMap,
  timer,
} from 'rxjs';
import { UserBloodPressure } from '../model/user-blood-pressure';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hostogram',
  templateUrl: './histogram.component.html',
  styleUrls: ['./histogram.component.scss'],
})
export class HistogramComponent implements OnInit {
  token!: string;
  isRawDisplay = true;
  bloodPressureRangeRaw!: number[];
  bloodPressureRangeLogarithmic!: number[];
  frequencyNumber = [20, 40, 60, 80, 100].reverse();
  pollInterval = 5;
  bloodPressure$!: Observable<number[]>;
  bloodPressureBaseValues$!: Observable<number[]>;

  minValue = 80;
  maxValue = 180;
  private minMaxValueSub$ = new BehaviorSubject<number[]>([
    this.minValue,
    this.maxValue,
  ]);

  private pollIntervalSub$ = new BehaviorSubject<number>(5);

  constructor(
    private loginService: LoginService,
    private router: Router,
    private api: GeneralApiService
  ) {}

  ngOnInit(): void {
    this.bloodPressureRangeRaw = this.generateRawRange();
    this.bloodPressureRangeLogarithmic = this.generateLogarithmicRange();

    this.token = this.loginService.LoginToken;

    this.bloodPressureBaseValues$ = this.pollIntervalSub$.pipe(
      switchMap((val) =>
        timer(0, val * 1000).pipe(
          switchMap(() =>
            this.api.getUserBloodPressure(this.token).pipe(first())
          ),
          map((data) => data[0].bloodPressure)
        )
      )
    );

    this.bloodPressure$ = combineLatest([
      this.bloodPressureBaseValues$,
      this.minMaxValueSub$,
    ]).pipe(
      map(([baseBloodPressureValues, minMax]) =>
        baseBloodPressureValues.filter(
          (each) => each >= minMax[0] && each <= minMax[1]
        )
      )
    );
  }

  switchPanel(isRaw: boolean) {
    this.isRawDisplay = isRaw;
  }

  generateRawRange(): number[] {
    let result = [];
    let start = 80;
    while (start <= 200) {
      result.push(start);
      start += 10;
    }
    return result;
  }

  generateLogarithmicRange(): number[] {
    let result = [];
    let start = 4.0;
    while (start <= 5.4) {
      result.push(start);
      start += 0.2;
      start = parseFloat(start.toFixed(1));
    }
    return result;
  }

  calRawBucketValues(data: number[]): number[] {
    let result = new Array(11);
    result.fill(0);
    for (let each of data) {
      let index = this.calculateRawInterval(each);
      result[index] += 1;
    }
    return result;
  }

  calLogBucketValues(data: number[]): number[] {
    let result = new Array(8);
    result.fill(0);
    for (let each of data) {
      let index = this.calculateLogInterval(Math.log(each));
      result[index] += 1;
    }
    return result;
  }

  calculateRawInterval(num: number) {
    let index = 0;
    for (let i = 0; i < this.bloodPressureRangeRaw.length - 1; i++) {
      if (
        num >= this.bloodPressureRangeRaw[i] &&
        num < this.bloodPressureRangeRaw[i + 1]
      ) {
        index = i + 1;
      }
    }
    return index;
  }

  calculateLogInterval(num: number) {
    let index = 0;
    for (let i = 0; i < this.bloodPressureRangeLogarithmic.length - 1; i++) {
      if (
        num >= this.bloodPressureRangeLogarithmic[i] &&
        num < this.bloodPressureRangeLogarithmic[i + 1]
      ) {
        index = i + 1;
      }
    }
    return index;
  }

  pollIntervalChanged() {
    this.pollInterval = Math.abs(this.pollInterval);
    this.pollIntervalSub$.next(this.pollInterval);
  }

  minmaxChanged() {
    if (this.minValue > this.maxValue) {
      this.minValue = 80;
      this.maxValue = 180;
    }
    this.minMaxValueSub$.next([this.minValue, this.maxValue]);
  }

  logout() {
    this.loginService.LoginToken = '';
    this.router.navigateByUrl('');
  }
}
