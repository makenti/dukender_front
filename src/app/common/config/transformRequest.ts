export function transformRequest(obj: any) {
  var str: string[] = [];
  console.log(obj);
  for(var key in obj) {
    if(obj[key] instanceof Array) {
      obj[key].map((x:any)=> {
        str.push(encodeURIComponent(key) + '[]=' + encodeURIComponent(x));
      });
      // str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }else {
      str.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
    }
  }
  return str.join('&');
}
