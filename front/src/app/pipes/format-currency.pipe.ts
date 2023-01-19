import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCurrency'
})
export class FormatCurrencyPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    return (value / 100).toFixed(2);
  }

}
