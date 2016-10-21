import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'searchArray'})
export class SearchArray implements PipeTransform {
  transform(v:any, [searchEvent]: any):any {
            return v.title.search(searchEvent);
        }
  }
