import React, {Dispatch, SetStateAction, useCallback, useEffect, useState} from 'react';
import {Accept, FileRejection, useDropzone} from "react-dropzone";
import {FaCloudUploadAlt, FaTimes} from "react-icons/fa";
import styles from './SingleFileUpload.module.scss'
import {Spinner} from "react-bootstrap";
//------------------------------------
interface FileUploadDTO {
    file?:File,
    setFile:Dispatch<SetStateAction<File|undefined>>,
    maxSize:number,         // 첨부 파일 개별 파일 최대 크기 (byte)
    accept:Accept,          // mime type
    isLoading: boolean,
    isComplete: boolean
}

//------------------------------------
export function SingleFileUpload(props:FileUploadDTO){

    const [dragMessage, setDragMessage] = useState("base");
    const [dragFlag, setDragFlag] = useState(false);


    const onDrop = useCallback(( acceptedFiles:File[], fileRejections:FileRejection[]) => {
        let isError = false;

        onDragLeave()
        if ( acceptedFiles.length === 1) {
            props.setFile(acceptedFiles[0]);
            setDragMessage("base");
        } else if( acceptedFiles.length > 1) {
            setDragMessage("count");
        } else {
            isError = true;
            if ( fileRejections.length > 0 && fileRejections[0].errors[0]?.code === "file-too-large" ) {
                setDragMessage("size");
            } else {
                setDragMessage("type");
            }
        }

        if (isError) {
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
        disabled: !!props.file || props.isLoading,
        maxFiles: 1,
        multiple: false,
    });

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
        <div
            className={`${styles.file} ${!!props.file || props.isLoading ? styles.dragDisabled : ''} ${dragFlag ? styles.dragFlag : ''}`} {...getRootProps()}>
            <div className={styles.uploadWrapper}>
                <div style={{position: "relative", top: "50%", transform: "translate(0, -50%)"}}>

                    {
                        props.isLoading ?
                            <Spinner/>
                            :
                            <div>
                                <input {...getInputProps()}/>
                                {dragMessage === "base" ?
                                    <>
                                        <div><FaCloudUploadAlt size={30} style={{marginRight: 5}}/></div>
                                        <div>Drag File & Select File</div>
                                    </>
                                    : dragMessage === "size" ? <div className={styles.fileError}>File size should be less than {props.maxSize} B</div>
                                        : dragMessage === "type" ? <div className={styles.fileError}>This is not valid file</div>
                                            : dragMessage === "count" ? <div className={styles.fileError}>Maximum attachment file count exceeds</div>
                                                : <div>Drop</div>
                                }
                            </div>
                    }

                </div>
            </div>
        </div>
    );

}
