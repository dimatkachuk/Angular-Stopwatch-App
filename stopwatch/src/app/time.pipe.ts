import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertsToTime'
})
export class TimePipe implements PipeTransform {

  transform(value: number): string {
    var valueStr = value.toString();
    return (valueStr.length < 2) ? '0'.concat(valueStr) : valueStr;
  }

}
