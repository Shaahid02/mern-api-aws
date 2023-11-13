const aws = require('aws-sdk')

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    secretKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_REGION
})

const s3 = new aws.S3()

const deleteFile = async (imagePath) => {
    const fileName = imagePath.split('/').pop()
    const params = { Bucket: process.env.AWS_BUCKET_NAME, Key: fileName}

    s3.headObject(params)
        .promise()
        .then((data) => {
            console.log('File found in s3')
            s3.deleteObject(params)
                .promise()
                .then(
                    () => console.log('File deleted successfully'),
                    () => console.log('Error while deleting file: ' + JSON.stringify(err))
                )
            },
            (err) => console.log('File not found in s3: ' + err.code)
        )
}

module.exports = deleteFile
