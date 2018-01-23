import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'readPipe'
})

export class ReadPipe implements PipeTransform {
  transform(items: any[], key: any, filter: number): any {
  	let filteredItems = items;
  	if(filter < 2 && items.length > 0) {
	  	filteredItems = filteredItems.filter(item => item[key] == filter);
  	}
  	return filteredItems;
  }
}
