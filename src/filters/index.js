/**
 * 过滤器定义
 *
 * @author  hucw
 * @created 2017-06-23
 */


import imgFilter from './filter-img';
import datetimeFilter from './filter-datetime';
import numberFilter from './filter-number';
import stringFilter from './filter-string';
import pageFilter from './filter-page';

let filters = {};
Object.assign(filters, imgFilter);
Object.assign(filters, datetimeFilter);
Object.assign(filters, numberFilter);
Object.assign(filters, stringFilter);
Object.assign(filters, pageFilter);

export default filters;
