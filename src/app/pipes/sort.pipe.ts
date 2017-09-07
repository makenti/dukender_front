import { Pipe } from "@angular/core";

@Pipe({
  name: "sortBy"
})
export class SortPipe {
  transform(array: any[], field: string, order: string): any[] {
    array.sort((a: any, b: any) => {
      if (a[field] < b[field]) {
        if(order === "asc")
          return -1;
        else 
          return 1;
      } else if (a[field] > b[field]) {
        if(order === "asc")
          return 1;
        else 
          return -1;
      } else {
        return 0;
      }
    });
    return array;
  }
}