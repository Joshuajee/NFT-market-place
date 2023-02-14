import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import multer from 'multer';
import pinataSDK from '@pinata/sdk';
import fs from 'fs';

const pinata = pinataSDK(String(process.env.PINATA_KEY), String(process.env.PINATA_SECRET));


interface NextConnectApiRequest extends NextApiRequest {
    files: any;
}
  
export type SuccessfulResponse<T> = { data: T; error?: never; statusCode?: number };
export type UnsuccessfulResponse<E> = { data?: never; error: E; statusCode?: number };
  
export type ApiResponse<T, E = unknown> = SuccessfulResponse<T> | UnsuccessfulResponse<E>;
  
type ResponseData = ApiResponse<string[], string>;
  
const oneMegabyteInBytes = 1000000;


// const upload = multer({
//     limits: { fileSize: oneMegabyteInBytes * 2 },
//     storage: multer.memoryStorage(),
//     fileFilter: (req: any, file: any, cb: any) => {
//       const acceptFile: boolean = ['image/jpeg', 'image/png'].includes(file.mimetype);
//       cb(null, acceptFile);
//     }
// });
  
const upload = multer({
    dest:'public/uploads/',
    limits: { fileSize: oneMegabyteInBytes * 2 },
    fileFilter: (req: any, file: any, cb: any) => {
        const acceptFile: boolean = ['image/jpeg', 'image/png'].includes(file.mimetype);
        cb(null, acceptFile);
    },
    filename: function (req: any, file: any, cb: any) {
        cb(null , file.originalname);
    }
});

const apiRoute = nextConnect({
    onError(error, req: NextConnectApiRequest, res: NextApiResponse<ResponseData>) {
        res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
    },
    onNoMatch(req: any, res: NextApiResponse<ResponseData>) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});
  
apiRoute.use(upload.array('image'));
  
apiRoute.post(async (req: any, res: NextApiResponse<any>) => {

    try {

        const filePath = req.files[0].path;

        const readableStreamForFile = fs.createReadStream(filePath);

        const data = await pinata.pinFileToIPFS(readableStreamForFile);

        fs.unlinkSync(filePath);

        console.log(data)

        res.send(data)

    } catch (e) {
        res.status(500).send(e)
    }

});


export default apiRoute;

export const config = {
    api: {
      bodyParser: false, // Disallow body parsing, consume as stream
    },
};
