import {v2 as cloudinary} from 'cloudinary';

const ConnectCloud = async () =>{
        cloudinary.config({
            cloud_name : process.env.CLOUD_NAME,
            api_key : process.env.CLOUD_API_KEY,
            api_secret : process.env.CLOUD_SEC_KEY,
            
        })
       
};

export default ConnectCloud;