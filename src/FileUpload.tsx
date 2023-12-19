import React, {Dispatch, SetStateAction, useCallback, useEffect, useState} from 'react';
import {Accept, FileRejection, useDropzone} from "react-dropzone";
import {FaCloudUploadAlt, FaTimes} from "react-icons/fa";
import styles from './FileUpload.module.scss'
//------------------------------------
interface FileUploadDTO {
    files:File[],
    setFiles:Dispatch<SetStateAction<File[]>>,
    maxSize:number,         // 첨부 파일 개별 파일 최대 크기 (byte)
    accept:Accept,          // mime type
}

//------------------------------------
export function FileUpload(props:FileUploadDTO){

    const [dragMessage, setDragMessage] = useState("base");
    const [dragFlag, setDragFlag] = useState(false);

    useEffect( () => {
    }, []);

    const onDrop = useCallback(( acceptedFiles:File[], fileRejections:FileRejection[]) => {
        let flag = false;

        onDragLeave()
        if ( acceptedFiles.length > 0 ) {
            props.setFiles( prev => {
                flag = ( prev.length + acceptedFiles.length ) > 1;
                setDragMessage( flag ? "count" : "base");

                const arr = prev.concat(acceptedFiles);
                return arr.slice(0, 1);
            });
        } else {
            flag = true;
            if ( fileRejections.length > 0 && fileRejections[0].errors[0]?.code === "file-too-large" ) {
                setDragMessage("size");
            } else {
                setDragMessage("type");
            }
        }

        if ( flag ) {
            setTimeout(() => {
                setDragMessage("base");
            }, 1200);
        }
    }, []);

    const { isDragActive, getRootProps, getInputProps, isDragReject, acceptedFiles, fileRejections} = useDropzone({
        onDrop,
        accept:props.accept,
        minSize: 0,
        maxSize:props.maxSize,
        onDragEnter: onDragEnter,
        onDragOver: onDragOver,
        onDragLeave: onDragLeave,
        disabled: props.files.length > 0,
    });

    const removeFile = (idx:number) => {
        props.setFiles( prev => {
            const arr = [...prev];
            arr.splice(idx, 1);
            return arr;
        });
    }

    function onDragEnter(){
        setDragFlag(true);
        console.log("Drag Enter");
    }

    function onDragOver(){
        setDragFlag(true);
        console.log("Drag Over");
    }

    function onDragLeave(){
        setDragFlag(false);
        console.log("Drag Leave");
    }

    return (
        <div className={`${styles.file} ${props.files.length > 0 ? styles.exists : ''} ${dragFlag?styles.dragFlag : ''}`} {...getRootProps()}>
            <div style={{display: props.files.length > 0 ? "none" : "block"}}>
                <input {...getInputProps()} />
                {dragMessage === "base" ? <p><FaCloudUploadAlt size={30} style={{marginRight: 5}} />Drag File & Select File</p>
                    : dragMessage === "size" ? <p><span className={styles.fileError}>File size should be less than {props.maxSize} B</span></p>
                        : dragMessage === "type" ? <p><span className={styles.fileError}>This is not valid file</span></p>
                            : dragMessage === "count" ? <p><span className={styles.fileError}>Maximum attachment file count exceeds</span></p>
                                : <p>Drop</p>
                }
            </div>
            {
                props.files.length > 0 &&
                <div style={{padding:0, height:60}}>
                    {
                        props.files.map((file, idx) =>  (
                            <li key={idx}>
                                {file?.name}
                                <FaTimes className={styles.removeFileIcon} size={26} color={"red"} onClick={() => removeFile(idx)}/>
                            </li>
                        ))
                    }
                </div>
            }
        </div>
    );

}
