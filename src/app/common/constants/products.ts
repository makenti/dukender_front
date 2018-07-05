export const EMPTY_PRODUCT = {
    id: '',
    category_id: 0,
    subcategory_id: '',
    name: '',
    article: '',
    nomenclature: '',
    made_in: '',
    price: 0,
    description: '',
    id_1c: '',
    part_1c: 0,
    active: true,
    image: '',
    resize: 'false',
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    barcode: '',
    min_left: 0,
};
export const dataURLtoFile = (dataurl, filename):any => {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}