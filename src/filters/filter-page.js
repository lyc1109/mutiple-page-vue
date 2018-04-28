/**
 * 表格每页显示的条数(例:显示第n页到第n+1页)
 *
 * @param data 表格数据
 * @param page 表格分页对象
 *
 * @author  luoyc
 * @created 2018-03-16
 */

export default {
  showPage (data,page) {
    if (data.length < page.pageSize) {
      if (data.length === 0) {
        page.first = 0
        page.last = 0
      } else {
        page.first = page.total - data.length + 1
        page.last = page.total
      }
    } else if (data.length === page.pageSize) {
      page.first = page.curPage * data.length - (page.pageSize - 1)
      page.last = page.curPage * data.length
    }
  }
}
