import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import multer from 'multer';
import pinataSDK from '@pinata/sdk';
import { Readable } from 'stream';
import toUint8 from 'to-uint8array';
const fs = require('fs');


const pinata = pinataSDK(String(process.env.NEXT_PUBLIC_PINATA_KEY), String(process.env.NEXT_PUBLIC_PINATA_SECRET));


interface NextConnectApiRequest extends NextApiRequest {
    files: any;
}
  
export type SuccessfulResponse<T> = { data: T; error?: never; statusCode?: number };
export type UnsuccessfulResponse<E> = { data?: never; error: E; statusCode?: number };
  
export type ApiResponse<T, E = unknown> = SuccessfulResponse<T> | UnsuccessfulResponse<E>;
  
type ResponseData = ApiResponse<string[], string>;
  
const oneMegabyteInBytes = 1000000;


const upload = multer({
    limits: { fileSize: oneMegabyteInBytes * 2 },
    storage: multer.memoryStorage(),
    fileFilter: (req: any, file: any, cb: any) => {
      const acceptFile: boolean = ['image/jpeg', 'image/png'].includes(file.mimetype);
      cb(null, acceptFile);
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
  
apiRoute.post( async (req: any, res: NextApiResponse<any>) => {

    try {

        const stream = Readable.from(req.files[0].buffer);

        console.log(req.files)

        const options = {
            pinataMetadata: {
                name: "MyCustomName",
                keyvalues: {
                    customKey: 'customValue',
                    customKey2: 'customValue2'
                }
            },
            pinataOptions: {
                cidVersion: 0
            }
        };

        const readableStreamForFile = fs.createReadStream('public/upload.png');

        console.log(toUint8(req.files[0].buffer))

        const readableStreamForFile1 = fs.createReadStream(toUint8(req.files[0].buffer));

        //console.log(readableStreamForFile)

       // console.log(readableStreamForFile1)

        // const response = await pinata.pinFileToIPFS(readableStreamForFile, options)

        // console.log(response)

        res.send({ msg: "send"})


    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }


});


export default apiRoute;

export const config = {
    api: {
      bodyParser: false, // Disallow body parsing, consume as stream
    },
};

// export default function handler(req: any, res: any) {

//     const data = new FormData();
    
//     data.append('file', file);

//     const metadata = JSON.stringify({
//         name: 'testname',
//         keyvalues: {
//             exampleKey: 'exampleValue'
//         }
//     });

//     data.append('pinataMetadata', metadata);



//     res.status(200).json({ name: 'John Doe' })
// }




// // export const uploadFileToIPFS = async(file) => {
// //     const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
// //     //making axios POST request to Pinata ⬇️
    
// //     let data = new FormData();

// //     data.append('file', file);

// //     const metadata = JSON.stringify({
// //         name: 'testname',
// //         keyvalues: {
// //             exampleKey: 'exampleValue'
// //         }
// //     });

// //     data.append('pinataMetadata', metadata);

// //     //pinataOptions are optional
// //     const pinataOptions = JSON.stringify({
// //         cidVersion: 0,
// //         customPinPolicy: {
// //             regions: [
// //                 {
// //                     id: 'FRA1',
// //                     desiredReplicationCount: 1
// //                 },
// //                 {
// //                     id: 'NYC1',
// //                     desiredReplicationCount: 2
// //                 }
// //             ]
// //         }
// //     });
// //     data.append('pinataOptions', pinataOptions);

// //     return axios 
// //         .post(url, data, {
// //             maxBodyLength: 'Infinity',
// //             headers: {
// //                 'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
// //                 pinata_api_key: key,
// //                 pinata_secret_api_key: secret,
// //             }
// //         })
// //         .then(function (response) {
// //             console.log("image uploaded", response.data.IpfsHash)
// //             return {
// //                success: true,
// //                pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
// //            };
// //         })
// //         .catch(function (error) {
// //             console.log(error)
// //             return {
// //                 success: false,
// //                 message: error.message,
// //             }

// //     });
// // };