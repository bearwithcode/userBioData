import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-histogram-diagram',
  templateUrl: './histogram-diagram.component.html',
  styleUrls: ['./histogram-diagram.component.scss']
})
export class HistogramDiagramComponent {
  @Input() frequencyNumber!: number[];
  @Input() bloodPressureRange!: number[];
  @Input() frequency:number[] = [];
  
  //frequency = [0,11,34,40,60,20,88,0,7,0,0];

  caculateBarHeight(num:number){
    return {
      height: `${this.getFrequency(num) * 0.4}vh`
    }
  }

  getFrequency(num: number){
    let index = this.calculateInterval(num);

    return this.frequency[index]
  }

  calculateInterval(num: number){
    let index = 0;
    for(let i = 0; i < this.bloodPressureRange.length - 1;i ++){
      if(num >= this.bloodPressureRange[i] && num < this.bloodPressureRange[i + 1]){
        index = i;
      }
    }
    return index;
  }
}
