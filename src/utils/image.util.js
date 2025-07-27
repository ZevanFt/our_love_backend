const path = require('path');
const fs = require('fs');
const { fileUploadError, unSupportedFileType } = require('../constant/err.type')

class ImagesUtil {
    /**
     * 异步上传图片的方法
     * @param {object} ctx - Koa 上下文对象，包含请求和响应信息
     */
    async uploadImage(ctx) {
        // 打印上传的文件信息，用于调试
        console.log(ctx.request.files.file, '1111111')
        // 从请求中解构出上传的文件，若没有则默认为空数组
        const { file } = ctx.request.files || []
        // 定义支持的图片文件类型数组
        const fileTypes = ['image/jpeg', 'image/jpg', 'image/png']
        // 检查是否有文件上传
        if (file) {
            // 检查上传文件的类型是否在支持的类型列表中
            if (!fileTypes.includes(file.mimetype)) {
                // 若文件类型不支持，触发错误事件并返回
                return ctx.app.emit('error', unSupportedFileType, ctx)
            }

            // 从请求 URL 中提取前缀，用于构建上传目录
            const urlPrefix = ctx.request.url.split('/')[2]
            // 打印提取的 URL 前缀，用于调试
            console.log(urlPrefix, '6666666')

            // 构建上传目录的完整路径
            const uploadDir = path.join(__dirname, `../upload/${urlPrefix}`)
            // 打印上传目录路径，用于调试
            console.log(uploadDir, 'uploadDir', '2222222')

            // 构建文件最终存储的完整路径
            const filePath = path.join(uploadDir, path.basename(file.filepath))
            // 打印文件最终存储路径，用于调试
            console.log(filePath, 'filePath', '3333333')

            // 检查上传目录是否存在
            if (!fs.existsSync(uploadDir)) {
                // 若目录不存在，打印创建文件夹信息
                console.log('——创建文件夹——')
                // 递归创建上传目录
                fs.mkdirSync(uploadDir, { recursive: true })
            }

            // 打印移动文件信息，用于调试
            console.log('——移动文件——', '4444444')
            // 将临时文件移动到最终存储路径
            fs.renameSync(file.filepath, filePath)
            // 打印请求 URL，用于调试
            console.log(ctx.request.url, '5555555')

            // 构建成功响应体
            ctx.body = {
                code: 0,
                message: '——图片上传成功——',
                result: {
                    // 返回图片的访问 URL
                    imgUrl: `/${urlPrefix}/${path.basename(filePath)}`
                }
            }
        } else {
            // 若没有文件上传，触发文件上传错误事件并返回
            return ctx.app.emit('error', fileUploadError, ctx)
        }
    }
}

module.exports = new ImagesUtil();