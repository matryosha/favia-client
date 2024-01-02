import Alpine from 'alpinejs'

import hiddenInput from './hiddenInput.html'
import { MediaUploader } from './uploader';

const uploader = new MediaUploader()

const mediaSection = document.getElementById('media-section')
const mediaUploadImageEl = document.getElementById('image-drop-area')
// const mediaHintEl = mediaSection.getElementsByClassName('drag-area-icon')[0]
const mediaMainImgEl = mediaSection.getElementsByTagName('img')[0]
const imagePreviewEls = document.querySelectorAll('.slider-items-container .slider-item')

mediaSection.insertAdjacentHTML('beforeend', hiddenInput)
const mediaUploadInputEl = document.getElementById('media-upload-input')


const mediaSectionXData = () => ({
    mediaFiles: [],
    mediaFilesUrls: [],
    imageLoadStatus: {},

    get hasSomeFiles() {
        return this.mediaFiles.length !== 0
    },

    getImageUrl(index) {
        const urlImg = this.mediaFilesUrls[index]
        return urlImg ?? ''
    },

    isImageLoaded(index) {
        const isLoaded = this.imageLoadStatus[index]

        return isLoaded ?? false
    },

    openFilePicker() {
        mediaUploadInputEl.click()
    },

    selectedFileUpdated() {
        const selectedFiles = mediaUploadInputEl.files;

        this.mediaFiles.push(...selectedFiles)

        for (let index = 0; index < selectedFiles.length; index++) {
            const file = selectedFiles[index];
            const url = URL.createObjectURL(file)
            this.mediaFilesUrls.push(url)

            let fileIndex = this.mediaFilesUrls.length - 1
            if (fileIndex < 0) fileIndex = 0
            uploader.queueFile(file, () => this.imageLoadStatus[fileIndex] = true)
        }
    },

    onDropHandler(e) {
        const items = e.dataTransfer.items;
        if (! items) return

        [...items].forEach(i => {
            if (i.kind !== 'file') return
            if (i.type !== 'image/jpeg') return

            // todo: smells. duplicate from selectedFileUpdated
            const file = i.getAsFile()
            this.mediaFiles.push(file)
            const url = URL.createObjectURL(file)
            this.mediaFilesUrls.push(url)

            let fileIndex = this.mediaFilesUrls.length - 1
            if (fileIndex < 0) fileIndex = 0
            uploader.queueFile(file, () => this.imageLoadStatus[fileIndex] = true)
        })
    }
})



mediaUploadInputEl.setAttribute('x-on:change', 'selectedFileUpdated')

// mediaHintEl.setAttribute('x-show', '! hasSomeFiles')

mediaUploadImageEl.setAttribute('x-on:click', 'openFilePicker')
mediaUploadImageEl.setAttribute('x-on:drop.prevent', 'onDropHandler')
mediaUploadImageEl.setAttribute('x-on:dragover.prevent', '')

// mediaMainImgEl.setAttribute('x-bind:src', 'getImageUrl(0)')

Alpine.data('media', mediaSectionXData)
mediaSection.setAttribute('x-data', 'media')

const overlayAlpineData = (imageIndex = 0) => ({
    imageIndex: imageIndex,

    overlayBind: {
        [':class']() {
             if (this.getImageUrl(this.imageIndex) !== '' && ! this.isImageLoaded(this.imageIndex)) {
                return 'slider-item-loading-overlay-visible'
             }

             return ''
        }
    }
})

Alpine.data('imagePreviewOverlay', overlayAlpineData)
Alpine.data('imagePreviewShadow', (imageIndex = 0) => ({
    imageIndex: imageIndex,

    shadowBind: {
        [':class']() {
             if (this.getImageUrl(this.imageIndex) !== '') {
                return 'slider-item-shadow-visible'
             }

             return ''
        }
    }
}))

for (let index = 0; index < imagePreviewEls.length; index++) {
    const previewEl = imagePreviewEls[index];
    const imageEl = previewEl.querySelector('img')
    imageEl.setAttribute('x-bind:src', `getImageUrl(${index})`)
    imageEl.setAttribute('x-show', `getImageUrl(${index}) !== ''`)

    // как я ебал такую хуйню. hack
    const shadowEl = previewEl.querySelector('.slider-item-shadow')
    // shadowEl.style['boxShadow'] = imagePreviewElStyles.getPropertyValue('box-shadow')
    // shadowEl.style['borderRadius'] = imagePreviewElStyles.getPropertyValue('border-radius')
    // shadowEl.style['width'] = '100%'
    // shadowEl.style['height'] = '100%imagePreviewOverlay'
    // shadowEl.style['position'] = 'absolute'

    shadowEl.setAttribute('x-data', `imagePreviewShadow(${index})`)
    shadowEl.setAttribute('x-bind', 'shadowBind')

    const loadingOverlayEl = previewEl.querySelector('.slider-item-loading-overlay');

    // loadingOverlayEl.setAttribute('x-show', `isImageLoaded(${index})`)
    loadingOverlayEl.setAttribute('x-data', `imagePreviewOverlay(${index})`)
    loadingOverlayEl.setAttribute('x-bind', 'overlayBind')

    const controlsOverlayEl = previewEl.querySelector('.slider-item-controls-overlay-container')
    controlsOverlayEl.setAttribute('x-show', `getImageUrl(${index}) !== ''`)
}

Alpine.start()