import fs from "fs";

export const removeFile = async (filePath): Promise<any> => {
    return new Promise((resolve, reject) => {
        // Check if the file exists
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                reject();
                return;
            }

            // File exists, proceed to remove it
            fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) {
                    reject();
                    return;
                }
                resolve('File has been successfully removed');
            });
        });
    });
}