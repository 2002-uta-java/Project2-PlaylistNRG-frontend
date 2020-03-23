import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shorten'
})
export class ShortenPipe implements PipeTransform {

  transform(value: string, ...args: number[]): string {
    if(typeof value !== 'undefined'){
      if(value.length >= args[0]){
        let result:string = value.substring(0, args[0]);
        return result + "...";
      } else{
        return value;
      }
    } else{
      return "";
    }
  }

}
