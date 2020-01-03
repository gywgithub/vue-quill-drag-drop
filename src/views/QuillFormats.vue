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
    <md-button @click.native="imageBase64ToLink">ImageBase64ToLink</md-button>&nbsp;&nbsp;&nbsp;&nbsp;
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
    async imageBase64ToLink () {
      let outputHTML = this.quill.root.innerHTML
      console.log(typeof outputHTML)

      let doc = new DOMParser().parseFromString(outputHTML, 'text/html').body
      let imgList = doc.getElementsByTagName('img')
      console.log(imgList)

      for (let index = 0; index < imgList.length; index++) {
        let imgUrl = imgList[index].src

        let bytes = window.atob(imgUrl.split(',')[1])
        let arrayBuffer = new ArrayBuffer(bytes.length)
        let intArray = new Uint8Array(arrayBuffer)
        for (let i = 0; i < bytes.length; i++) {
          intArray[i] = bytes.charCodeAt(i)
        }
        let blob = new Blob([intArray], { type: 'image/png' })
        console.log('blob: ', blob)
        let fileName = new Date().getTime() + '.png'
        let file = new window.File([blob], fileName, { type: 'image/png' })
        console.log('file ', file)

        // upload file
        let formData = new FormData()
        formData.append('file', file)
        // File Server -> https://github.com/gywgithub/FileServer
        await fetch('http://127.0.0.1:3000/file_upload', {
          method: 'POST',
          body: formData
        }).then(res => {
          let imageSrcLink = 'http://127.0.0.1:3000/images/' + fileName
          console.log(imageSrcLink)
          imgList[index].src = imageSrcLink
          console.log('imgList: ', imgList)
          return res.json()
        }).then(result => {
          console.log('result: ', result)
          return true
        }).catch(err => {
          console.error('err: ', err)
        })
      }

      console.log(doc)
      let innerHTML = doc.innerHTML
      console.log('innerHTML: ', innerHTML)
    },
    download () {
      let outputHTML = this.quill.root.innerHTML
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
