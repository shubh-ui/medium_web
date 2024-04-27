import Embed from "@editorjs/embed";
import Header from "@editorjs/header";
import Image from "@editorjs/image";
import Link from "@editorjs/link";
import List from "@editorjs/list";
import Marker from "@editorjs/marker";
import Quote from "@editorjs/quote";
import InlineCode from "@editorjs/inline-code";
import { uploadImage } from "../common/uploadImage";


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








