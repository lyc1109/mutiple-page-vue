<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .v-editor {
    line-height: normal;
    background-color: $white;
  }

  .v-editor /deep/ {
    .ql-toolbar,
    .ql-container {
      border-color: #dcdfe6;
    }
    .ql-container {
      border-bottom-left-radius: $border-radius;
      border-bottom-right-radius: $border-radius;
    }
    .ql-toolbar {
      border-top-left-radius: $border-radius;
      border-top-right-radius: $border-radius;
      background-color: $gray-light-1;
      padding: 10px 8px 5px 8px;
    }

    .ql-toolbar .ql-formats {
      background-color: $white;
      border: 1px solid $border;
    }

    .ql-fullscreen {
      text-align: center;
      padding-left: 7px;
      font-size: 15px;
    }
  }

  .v-editor.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1800;
  }
  .v-editor.fullscreen /deep/ {
    .ql-editor{
      height: 100% !important;
      max-height: none !important;
      min-height: auto !important;
      overflow-y: auto;
    }
  }
</style>

<template>
  <div :id="editorId">
    <quill-editor class="v-editor"
                  v-model="value"
                  ref="veditor"
                  @blur="onEditorBlur($event)"
                  @focus="onEditorFocus($event)"
                  @ready="onEditorReady($event)"
                  :options="editorOptions"
                  :class="{fullscreen: isFullscreen}">
    </quill-editor>

    <div class="hidden">
      <button type="button" id="btnQillUploadImg" @click="selectImg">上传图片</button>
      <button type="button" id="btnQillFullScreen" @click="toggleFullScreen">全屏</button>
    </div>

    <v-mediapicker v-model="isShowMediaPicker" :multiple="multiple" @onOk="onSelectedMedia"></v-mediapicker>
  </div>
</template>

<script>
  // vue富文本编辑器封装
  // 基于插件：https://github.com/surmon-china/vue-quill-editor
  // 插件API: https://quilljs.com/docs/quickstart/
  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import 'quill/dist/quill.bubble.css';
  import {quillEditor} from 'vue-quill-editor';

  // 引入图片缩放模块
  import Quill from 'quill';
  import ImageResize from 'quill-image-resize-module';
  Quill.register('modules/imageResize', ImageResize);

  import VMediapicker from "@/components/v-mediapicker";

  import _ from "lodash";

  export default {
    name: "v-editor",
    components: {
      quillEditor,
      VMediapicker
    },
    props: {
      // 父组件通过v-model双向绑定默认内容
      value: String,
      // 默认显示内容
      placeholder: {
        type: String,
        default: ""
      },
      // 默认高度
      height: {
        type: Number,
        default: 300
      },
      // 最大高度
      maxHeight: {
        type: Number,
        default: 600
      },
      // 选择图片时是否支持多选
      multiple: {
        type: Boolean,
        default: true
      }
    },
    data: function () {
      return {
        $editor: null,
        editorId: "",
        editorBoxEle: null,
        editorOptions: {
          theme: 'snow',
          placeholder: this.placeholder,
          modules: {
            toolbar: {
              container: [
                [{'header': [1, 2, 3, 4, 5, 6, false]}],
                ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                [{'color': []}, {'background': []}],          // dropdown with defaults from theme
                [{'list': 'ordered'}, {'list': 'bullet'}, {'align': []}],
                ['image'],
                /*['fullscreen'],*/
                ['font'],
              ],
            },
            imageResize: {
              modules: ['Resize', 'DisplaySize', 'Toolbar']
            }
          },
        },
        isFullscreen: false,
        isShowMediaPicker: false
      };
    },
    methods: {
      onEditorBlur(e) {
        // do nothing
      },
      onEditorFocus(e) {
        // do nothing
      },
      onEditorReady(quill) {
        this.$editor = quill;
        // 随机设置外部容器ID
        this.editorId = "veditor" + Math.floor(Math.random()*1000+1);
        setTimeout(() => {
          this.editorBoxEle = document.getElementById(this.editorId);

          // 设置编辑器高度
          let qlEditor = this.getElementByClassName("ql-editor");
          if (qlEditor) {
            qlEditor.style.minHeight = this.height + 'px';
            qlEditor.style.maxHeight = this.maxHeight + 'px';
          }

          // 使用字体图标font替换为全屏按钮
          let qlFullscreen = this.getElementByClassName("ql-font");
          qlFullscreen.setAttribute('class','ql-font ql-fullscreen');
          if (qlFullscreen) {
            qlFullscreen.innerHTML = '<i class="fas fa-expand"></i>';
          }

          // 增加handlers
          let toolbar = quill.getModule('toolbar');
          let that = this;
          // 接管图片按钮触发事件
          toolbar.addHandler('image', () => {
            that.selectImg();
          });
          // 接管全屏按钮触发事件
          toolbar.addHandler('font', () => {
            that.toggleFullScreen();
          });
        }, 300)
      },

      // 触发input事件，将编辑器内容回传到父组件v-model
      emitInputEvent: _.debounce(function () {
        this.$emit("input", this.value);
      }, 600),

      // 切换全屏处理
      toggleFullScreen: function () {
        this.isFullscreen = !this.isFullscreen;
        let qlFullscreen = this.getElementByClassName("ql-fullscreen");
        if (qlFullscreen) {
          qlFullscreen.innerHTML = this.isFullscreen ? '<i class="fas fa-compress"></i>' : '<i class="fas fa-expand"></i>';
        }
      },

      // 接管图片选择处理
      selectImg: function () {
        this.isShowMediaPicker = true;
      },

      // 选择图片
      onSelectedMedia: function (medias) {
        let range = this.$editor.getSelection(true);
        let index = range.index;
        for(let item of medias) {
          // 增加oss处理标识，用于展示时
          let imgPath = item.path;
          if (imgPath.indexOf("?") > -1) {
            imgPath += "&"
          } else {
            imgPath += "?"
          }
          imgPath += "oss-process";
          this.$editor.insertEmbed(index, 'image', imgPath);
          index ++;
        }
      },

      // 在当前编辑器内部查询dom元素
      getElementByClassName: function (className) {
        return this.editorBoxEle.getElementsByClassName(className)[0];
      },
      getElementById: function (eleId) {
        return this.editorBoxEle.getElementById(eleId);
      }
    },
    watch: {
      value() {
        this.emitInputEvent();
      }
    }
  }
</script>
