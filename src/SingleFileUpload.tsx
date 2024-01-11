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
        <div className={`${styles.file} ${!!props.file || props.isLoading ? styles.dragDisabled : ''} ${dragFlag?styles.dragFlag : ''}`} {...getRootProps()}>
            {
                props.isLoading ?
                    <Spinner/>
                    :
                    <div>
                        <input {...getInputProps()}/>
                        {dragMessage === "base" ?
                            <p style={{userSelect: "none", msUserSelect: "none"}}><FaCloudUploadAlt size={30}
                                                                                                    style={{marginRight: 5}}/><span>Drag File & Select File</span>
                            </p>
                            : dragMessage === "size" ? <p><span className={styles.fileError}>File size should be less than {props.maxSize} B</span>
                                </p>
                                : dragMessage === "type" ?
                                    <p><span className={styles.fileError}>This is not valid file</span></p>
                                    : dragMessage === "count" ? <p><span className={styles.fileError}>Maximum attachment file count exceeds</span>
                                        </p>
                                        : <p>Drop</p>
                        }
                    </div>
            }
        </div>
    );

}
