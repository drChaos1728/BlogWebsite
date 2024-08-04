// import multer from 'multer';
// import { GridFsStorage } from 'multer-gridfs-storage';

// const storage = new GridFsStorage({
//     url: `mongodb://user:1234@ac-fd7jhke-shard-00-00.u1cqkca.mongodb.net:27017,ac-fd7jhke-shard-00-01.u1cqkca.mongodb.net:27017,ac-fd7jhke-shard-00-02.u1cqkca.mongodb.net:27017/?ssl=true&replicaSet=atlas-s5r4gq-shard-0&authSource=admin&retryWrites=true&w=majority&appName=blop`,
//     options: { useNewUrlParser: true },
//     file: (request, file) => {
//         const match = ["image/png", "image/jpg"];

//         if(match.indexOf(file.mimeType) === -1) 
//             return`${Date.now()}-blog-${file.originalname}`;

//         return {
//             bucketName: "photos",
//             filename: `${Date.now()}-blog-${file.originalname}`
//         }
//     }
// });

// export default multer({storage});

import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';

const storage = new GridFsStorage({
    url: `mongodb://user:123@ac-htce0lu-shard-00-00.gcj8st5.mongodb.net:27017,ac-htce0lu-shard-00-01.gcj8st5.mongodb.net:27017,ac-htce0lu-shard-00-02.gcj8st5.mongodb.net:27017/?ssl=true&replicaSet=atlas-1060ge-shard-0&authSource=admin&retryWrites=true&w=majority&appName=blo`,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: ( request, file) => {
        const match = ["image/png", "image/jpg", "image/jpeg"];

        if (match.indexOf(file.memetype) === -1) {
            return `${Date.now()}-blog-${file.originalname}`;
        }

        return {
            bucketName: "photos",
            filename: `${Date.now()}-blog-${file.originalname}`
        };
    }
      
});

export default multer({ storage });
