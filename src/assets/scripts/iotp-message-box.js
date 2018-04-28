/**
 * message-box消息框
 *
 * @author luoyc
 * @create 2018-03-15
 */

export default {
  // 消息提示
  alert (self,message,title = '',confirmText = '确定',center = true) {
    return self.$alert(message,title, {
      confirmButtonText: confirmText,
      center: center
    })
  },
  // 确认消息
  confirm (self,message,title = '',confirmText = '确定',cancelText = '取消',type = 'warning',center = true) {
    return self.$confirm(message, title, {
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      type: type,
      center: center
    })
  },
  // 提交内容
  prompt (self,message,title = '',confirmText = '确定',cancelText = '取消',center = true,inputPattern,inputErrorMessage) {
    return self.$prompt(message,title, {
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      center: center,
      inputPattern: inputPattern,
      inputErrorMessage: inputErrorMessage
    })
  }
}
