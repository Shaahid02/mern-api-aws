const multer = require('multer')
const multerS3 = require('multer-s3')
const aws = require('aws-sdk')
const uuid = require('uuid').v4;

aws.config.update({
    secretAccessKey: "SGcd6WhIMAvDtiSEEstyD1ESfQGlgVIzLi9xudhK",
    secretKeyId: "AKIAZSTN5C5MF3UHLHWX",
    region: process.env.AWS_REGION
})

const s3 = new aws.S3()

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
}

const fileUpload = multer({
    limits: 500000,
    storage: multerS3({
        s3:s3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: 'public-read',
        metadata: function(req, file, cb) {
            cb(null, {fieldName: file.fieldname})
        },
        key: function (req, file, cb) {
            const ext = MIME_TYPE_MAP[file.mimetype]
            cb(null, uuid() + '.'  + ext)
        }
    }),
    fileFilter: (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype]
        let error = isValid ? null : new Error('Invalid mime type')
        cb(error, isValid)
    }

})

module.exports = fileUpload