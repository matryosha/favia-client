import { UPLOAD_MEDIA_URL } from "serverEndpoints";

export class MediaUploader {
    isUploadingNow = false
    uploadId = null
    filesToUpload = []

    queueFile(file, resultCb) {
        return new Promise((res, rej) => {
            this.filesToUpload.push({file, resultCb, res, rej})
            this.dequeue()
        })
    }

    async dequeue() {
        if (this.isUploadingNow) return
        if (this.filesToUpload.length === 0) return

        const {file, resultCb, res, rej} = this.filesToUpload.shift()

        if(!file) return

        try {
            this.isUploadingNow = true

            const uploadResponse = await this.#uploadFile(file)
            if (!uploadResponse.ok) {
                throw new Error('Error uploading media')
            }

            if (! this.uploadId) {
                const uploadResult = await uploadResponse.json()
                const uploadId = uploadResult.uploadId

                if (!uploadId) {
                    throw new Error('Was expecting upload id from server response but got none')
                }

                this.uploadId = uploadId
            }

            this.isUploadingNow = false

            resultCb()
            res()
        }
        catch {
            this.isUploadingNow = false
            resultCb({error: true})
            rej()
        }
        finally {
            this.dequeue()
        }

        return
    }

    async #uploadFile(file) {
        const formData = new FormData()

        if (this.uploadId) {
            formData.append('uploadId', this.uploadId)
        }
        formData.append('media', file)

        return fetch(UPLOAD_MEDIA_URL, {
            method: "POST",
            body: formData,
        });

    }
}