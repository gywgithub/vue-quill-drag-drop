<template>
  <div>
    <br>
    <span class="md-display-1">Quill Formats</span>
    <br><br>
    <md-button @click.native="getContent">getContent</md-button>&nbsp;&nbsp;&nbsp;&nbsp;
    <md-button @click.native="setContent">setContent</md-button><br><br>
    <div class="container">
      <div id="toolbar-container">
        <span class="ql-formats">
          <select class="ql-font"></select>
          <select class="ql-size"></select>
        </span>
        <span class="ql-formats">
          <button class="ql-bold"></button>
          <button class="ql-italic"></button>
          <button class="ql-underline"></button>
          <button class="ql-strike"></button>
        </span>
        <span class="ql-formats">
          <select class="ql-color"></select>
          <select class="ql-background"></select>
        </span>
        <span class="ql-formats">
          <button class="ql-script" value="sub"></button>
          <button class="ql-script" value="super"></button>
        </span>
        <span class="ql-formats">
          <button class="ql-header" value="1"></button>
          <button class="ql-header" value="2"></button>
          <button class="ql-blockquote"></button>
          <button class="ql-code-block"></button>
        </span>
        <span class="ql-formats">
          <button class="ql-list" value="ordered"></button>
          <button class="ql-list" value="bullet"></button>
          <button class="ql-indent" value="-1"></button>
          <button class="ql-indent" value="+1"></button>
        </span>
        <span class="ql-formats">
          <button class="ql-direction" value="rtl"></button>
          <select class="ql-align"></select>
        </span>
        <span class="ql-formats">
          <button class="ql-link"></button>
          <button class="ql-image"></button>
          <button class="ql-video"></button>
          <button class="ql-formula"></button>
        </span>
        <span class="ql-formats">
          <button class="ql-clean"></button>
        </span>
      </div>
      <div id="editor" class="quill"></div>
    </div>
  </div>
</template>
<script>
import hljs from 'highlightjs'
import Quill from 'quill'
import 'highlightjs/styles/monokai-sublime.css'
import 'quill/dist/quill.snow.css'
import { ImageDrop } from 'quill-image-drop-module'
console.log(ImageDrop)
hljs.configure({
  languages: ['javascript', 'ruby', 'python']
})
export default {
  name: 'QuillFormats',
  data () {
    return {
      quill: null
    }
  },
  mounted () {
    Quill.register('modules/imageDrop', ImageDrop)
    this.quill = new Quill('#editor', {
      modules: {
        syntax: {
          highlight: text => hljs.highlightAuto(text).value
        },
        toolbar: '#toolbar-container',
        imageDrop: true
      },
      placeholder: 'Compose an epic...',
      theme: 'snow'
    })
    console.log(this.quill)
  },
  methods: {
    getContent () {
      let delta = this.quill.getContents()
      console.log(delta)
    },
    setContent () {
      this.quill.setContents([])
    }
  }
}
</script>
<style scoped="true">
.container {
  width: 60%;
  margin: auto;
}
.quill {
  min-height: 600px;
}
</style>
