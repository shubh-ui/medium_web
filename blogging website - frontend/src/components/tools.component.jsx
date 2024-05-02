import Embed from "@editorjs/embed";
import Header from "@editorjs/header";
import Image from "@editorjs/image";
import Link from "@editorjs/link";
import List from "@editorjs/list";
import Marker from "@editorjs/marker";
import Quote from "@editorjs/quote";
import InlineCode from "@editorjs/inline-code";
import axios from "axios";
// import { uploadImage } from "../common/uploadImage";

// const uploadImageByUrl = (e) => {
//     let link = new Promise((resolve, reject) => {
//         try {
//             resolve(e);
//         } catch (error) {
//             reject(error);
//         }
//     })
//     return link.then(url => {
//         return {
//             success:1,
//             file: { url }
//         }
//     }) 
// }

const uploadImageByUrl = (url) => {
    return Promise.resolve({
        success: 1,
        file: { url }
    });
};

const uploadImageByFile = (file) => {
    return uploadImage(file).then(url => {
        if (url) {
            return {
                success: 1,
                file: { url }
            };
        }
    });
};

const uploadImage = async (file) => {
    // Implement your image upload logic here
    // This could involve using a library or making an API call to upload the image file
    // For now, let's assume it simply returns a mock URL after some processing
    console.log(file);
    let imageUrl;

    if(file) {
        // const toastId = toast.loading('Loading...');
        const context = "/api";
        const urlCd = "/upload";
        const formData = new FormData();
        formData.append('image', file);
    
        try {
          const response = await axios.post(context + urlCd, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          console.log(response)
        //   toast.dismiss(toastId);
          if(response.data.imageUrl){

            // setBlog({ ...blog, banner:response.data.imageUrl})
            imageUrl = response.data.imageUrl;
            // blogBannerRef.current.src = response.data.imageUrl;
            return imageUrl;

          }
        } catch (error) {
          console.error('Error :', error);
        }
    // return new Promise((resolve, reject) => {
    //     // Simulating image upload process
    //     setTimeout(() => {
    //         // Replace this with actual URL
    //         resolve(imageUrl);
    //     }, 2000); // Simulating 2 seconds of upload time
    // });
}  
};


export const tools = {
    embed:Embed,
    header:{
        class:Header,
        config:{
            placeholder:"Type Heading...",
            levels:[2,3],
            defaultLevel:2
        }
    },
    image:{
        class:Image,
        config:{
            uploader: {
                uploadByUrl:uploadImageByUrl,
                uploadByFile:uploadImageByFile,
            }
        }
    },
    link:Link,
    list:{
        class:List,
        inlineToolbar:true
    },
    marker:Marker,
    quote:{
        class:Quote,
        inlineToolbar:true
    },
    inlineCode:InlineCode
}








