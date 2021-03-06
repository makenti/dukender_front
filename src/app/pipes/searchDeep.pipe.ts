import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchDeep'
})

export class SearchDeepPipe implements PipeTransform {
  transform(items: any[], key: any, filter: string): any {
    let filteredItems = items;
    if(filter !== '' && items.length > 0) {
      let filterArr = filter.split(' ');
      for(let i = 0; i < filterArr.length; i++) {
        filteredItems = filteredItems.filter(item => item.item[key].toLowerCase().indexOf(filterArr[i].toLowerCase()) !== -1);
      }
    }
    return filteredItems;
  }
}
