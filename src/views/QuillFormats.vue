<template>
  <div>
    <br>
    <span class="md-display-1">Quill Formats</span>
    <br>
    <br>
    <md-button @click.native="getContent">getContent</md-button>&nbsp;&nbsp;&nbsp;&nbsp;
    <md-button @click.native="setContent">setContent</md-button>&nbsp;&nbsp;&nbsp;&nbsp;
    <md-button @click.native="download">Download-HTML</md-button>&nbsp;&nbsp;&nbsp;&nbsp;
    <md-button @click.native="exportDoc">Export-Doc</md-button>&nbsp;&nbsp;&nbsp;&nbsp;
    <br>
    <br>
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
    this.outputHTML = this.quill.root.innerHTML
  },
  methods: {
    exportDoc () {
      let outputHTML = this.quill.root.innerHTML
      this.export2File(outputHTML, '', 'doc')
    },
    export2File (outputHTML, fileName = '', fileType) {
      let preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>"
      let postHtml = '</body></html>'

      if (fileType === 'doc') {
        let doc = new DOMParser().parseFromString(outputHTML, 'text/html').body
        let imgList = doc.getElementsByTagName('img')

        // 下面这个 newImgSrcList 需要程序动态生成,对应 imgList
        let newImgSrcList = ['https://www.google.com.hk/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png', 'https://www.baidu.com/img/bd_logo1.png']

        for (let index = 0; index < imgList.length; index++) {
          if (newImgSrcList[index]) {
            imgList[index].src = newImgSrcList[index]
          }
        }
        outputHTML = doc.innerHTML
      }

      let html = preHtml + outputHTML + postHtml

      let blob = new Blob(['\ufeff', html], {
        type: 'application/msword'
      })
      let url = 'data:application/vnd.ms-wordcharset=utf-8,' + encodeURIComponent(html)

      fileName = fileName ? fileName + '.' + fileType : 'document.' + fileType

      let downloadLink = document.createElement('a')

      document.body.appendChild(downloadLink)

      if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, fileName) // IE10-11
      } else {
        downloadLink.href = url

        downloadLink.download = fileName

        downloadLink.click()
      }
      document.body.removeChild(downloadLink)
    },
    download () {
      let outputHTML = this.quill.root.innerHTML
      console.log(typeof outputHTML)

      let doc = new DOMParser().parseFromString(outputHTML, 'text/html').body
      let imgs = doc.getElementsByTagName('img')
      // console.log(imgs)
      // 下面这个 newImgSrcList 需要程序动态生成,对应 imgList
      // let newImgSrcList = ['https://www.google.com.hk/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png', 'https://www.baidu.com/img/bd_logo1.png']

      // for (let index = 0; index < imgList.length; index++) {
      //   if (newImgSrcList[index]) {
      //     imgList[index].src = newImgSrcList[index]
      //   }
      // }

      // let imgs = outputHTML.getElementsByTagName('img')
      // let imgs = outputHTML.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'img')

      console.log(imgs)
      console.log('outputHTML: ', outputHTML)
      this.export2File(outputHTML, '', 'html')
    },
    getContent () {
      let delta = this.quill.getContents()
      console.log('content: ', delta)
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
