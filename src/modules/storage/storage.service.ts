import { Injectable } from '@nestjs/common';
import stream from 'stream';
import * as firebaseAdmin from "firebase-admin";
import { CONSTANTS } from 'src/shared/constants';

@Injectable()
export class StorageService {
    /**
    * Upload files to storage and returns the path
    * @param filePath file path
    * @param contentType Content-type
    * @param fileBase64 base64 file
    * @returns filePath
    */
    async uploadFileForUser(filePath: string, contentType: string, fileBase64: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const imageBuffer = new Buffer(fileBase64, 'base64');

                let bucket = firebaseAdmin.storage(firebaseAdmin.app()).bucket();
                let file = bucket.file(filePath);
                file.save(imageBuffer,{
                    metadata: CONSTANTS.STORAGE_IMAGE_MIMETYPE_PNG
                })
                resolve(file.getSignedUrl({
                    action: 'read',
                    expires: CONSTANTS.STORAGE_URL_EXPIRES
                }))
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Returns the file URL
     * @param path storage path
     * @returns file URL
     */
    getFireUrl(path: string, timestamp: Date): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                if (path == null || path == 'null' || !path || path.trim().length == 0) {
                    resolve(null);
                }
                if (path.indexOf('http') >= 0) {
                    resolve(`${path}${timestamp ? ('&decache=' + timestamp.getTime()) : ''}`);
                } else {
                    let bucket = firebaseAdmin.storage(firebaseAdmin.app()).bucket(process.env.FIREBASE_BUCKET);

                    const exists = await bucket.file(this.parsePath(path)).exists();
                    if (exists[0]) {
                        const url = await bucket.file(this.parsePath(path)).getSignedUrl({
                            action: 'read',
                            expires: '03-09-2491'
                        });

                        resolve(`${url[0]}${timestamp ? ('&decache=' + timestamp.getTime()) : ''}`);
                    } else {
                        resolve(null);
                    }
                    resolve(null);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    private parsePath(path: string) {
        if (path.indexOf('/') == 0) {
            return path.substr(1, path.length - 1);
        }
    }
}
