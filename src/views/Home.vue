<template>
  <div>
    <div
      style="border:1px solid red;height: 300px;width:150px; float:left;"
      @drop="drop"
      @dragover.prevent
    >
      <p style="color:#ccc;">{{this.dropData}}</p>
    </div>
    <div>
      <img src="../assets/logo.png" alt="logo.png" @dragstart="dragstart()"
      @dragend="dragend">
    </div>
    <div
      style="border:1px solid red;height: 200px;width:150px; float:left;margin-left: 200px;"
      draggable="true"
      @dragstart="dragstart($event, 'sdfsd')"
      @dragend="dragend"
    >
      <div style="margin:40px;">sdfsd</div>
    </div>
    <div style="width: 500px;height:500px; float:left;margin-left: 200px;">
      <quill-editor
        v-model="content"
        :options="editorOption"
        @blur="onEditorBlur($event)"
        @focus="onEditorFocus($event)"
        @change="onEditorChange($event)"
        id="editor"
        style="border:2px solid green;"
        @drop="drop"
        @dragover.prevent
      ></quill-editor>
    </div>
  </div>
</template>
<script>
import 'quill/dist/quill.snow.css'
import { quillEditor, Quill } from 'vue-quill-editor'
import { ImageDrop } from 'quill-image-drop-module'
export default {
  name: 'About',
  data () {
    return {
      content: '',
      editorOption: {},
      dropData: 'xxxxx',
      quill: null
    }
  },
  components: {
    quillEditor
  },
  mounted () {
    Quill.register('modules/imageDrop', ImageDrop)
    this.quill = new Quill('#editor', { // eslint-disable-line
      theme: 'snow',
      modules: {
        imageDrop: true
      }
    })
    console.log(this.quill.root)
    this.quill.root.addEventListener('drop', this.handleDrop, false)
    this.quill.root.addEventListener('dragover', this.handleDragover, false)
  },
  methods: {
    dragend (event) {
      event.dataTransfer.clearData()
    },
    handleDragover (evt) {
      evt.preventDefault()
      console.log('handle dragover')
      if (document.caretRangeFromPoint) {
        const selection = document.getSelection()
        const range = document.caretRangeFromPoint(evt.clientX, evt.clientY)
        if (selection && range) {
          selection.setBaseAndExtent(range.startContainer, range.startOffset, range.startContainer, range.startOffset)
        }
      }
    },
    handleDrop (evt) {
      console.log('Editor drop: ')
      console.log('evt 11: ', evt)
      evt.preventDefault()
      const index = (this.quill.getSelection() || {}).index || this.quill.getLength()
      this.quill.insertText(index, '123', {
        'color': '#a3a3a3',
        'italic': true
      })
    },
    drop (event) {
      console.log('drop')
      let data = event.dataTransfer.getData('item')
      this.dropData = data
      console.log('data: ', data)
    },
    dragstart (event, data) {
      console.log('drag')
      // console.log('event: ', event)
      // console.log('data: ', data)
      event.dataTransfer.setData('item', data)
    }
  }
}
</script>
