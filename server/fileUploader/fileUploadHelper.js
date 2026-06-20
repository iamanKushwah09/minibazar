const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const fileUploadHelper = {
    /**
     * Upload a single base64 encoded file
     * @param {string} folder - The folder path where the file will be stored
     * @param {string} filename - The name of the file with extension
     * @param {string} base64File - The base64 encoded file content
     * @param {boolean} returnObject - If true, returns { path, image_url } instead of string
     * @returns {Promise<string|Object>} - The relative path or an object containing local path and cloudinary URL
     */
    uploadSingleFile: (folder, filename, base64File, returnObject = false) => {
        return new Promise((resolve, reject) => {
            const dir = path.join(__dirname, process.env.FILE_UPLOAD_FOLDER || '../uploadFile_masale', folder);

            // Upload Locally
            const uploadLocal = () => {
                return new Promise((res, rej) => {
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir, { recursive: true });
                    }
                    const extension = path.extname(filename);
                    const basename = path.basename(filename, extension);
                    const timestamp = Date.now();
                    const fpath = `${basename}_${timestamp}${extension}`;
                    fs.writeFile(`${dir}/${fpath}`, base64File, { encoding: 'base64' }, (err) => {
                        if (err) rej(err);
                        else res(`/${folder}/${fpath}`);
                    });
                });
            };

            // Upload to Cloudinary
            const uploadCloudinary = () => {
                return new Promise((res, rej) => {
                    if (process.env.CLOUDINARY_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
                        let base64Data = base64File;
                        if (!base64Data.startsWith('data:')) {
                            const ext = path.extname(filename).toLowerCase().replace('.', '') || 'jpeg';
                            const mimeType = ext === 'png' ? 'image/png' : (ext === 'webp' ? 'image/webp' : (ext === 'gif' ? 'image/gif' : 'image/jpeg'));
                            base64Data = `data:${mimeType};base64,${base64File}`;
                        }
                        cloudinary.uploader.upload(base64Data, { folder: folder }, (error, result) => {
                            if (error) rej(error);
                            else res(result.secure_url);
                        });
                    } else {
                        res(null);
                    }
                });
            };

            Promise.allSettled([uploadLocal(), uploadCloudinary()])
                .then(([localResult, cloudResult]) => {
                    if (localResult.status === 'rejected') {
                        return reject(localResult.reason);
                    }
                    const localPath = localResult.value;
                    const cloudUrl = cloudResult.status === 'fulfilled' && cloudResult.value ? cloudResult.value : null;

                    if (returnObject) {
                        resolve({
                            path: localPath,
                            image_url: cloudUrl || ''
                        });
                    } else {
                        resolve(cloudUrl || localPath);
                    }
                });
        });
    },

    /**
     * Upload multiple base64 encoded files
     * @param {string} folder - The folder path where the files will be stored
     * @param {Array<{filename: string, base64File: string}>} files - Array of objects with filename and base64File properties
     * @param {boolean} returnObject - If true, returns array of objects { path, image_url }
     * @returns {Promise<string[]|Object[]>} - An array of relative paths or objects for each uploaded file
     */
    uploadMultipleFiles: (folder, files, returnObject = false) => {
        return Promise.all(
            files.map((file) => {
                const { fileName, base64File } = file;
                return fileUploadHelper.uploadSingleFile(folder, fileName, base64File, returnObject);
            })
        );
    }
};

module.exports = fileUploadHelper;