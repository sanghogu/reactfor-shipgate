import {Button, Modal} from "react-bootstrap";
import {SingleFileUpload} from "./SingleFileUpload";
import {useEffect, useState} from "react";

import styles from './ExportUploadModal.module.scss'
import {FaCloudDownloadAlt} from "react-icons/fa";
type Props = {
    modalFlag: boolean,
    modalClose: ()=>void,

}

type STATUS_CODE = "LOADING" | "COMPLETE" | "WAIT"

export default function ExportUploadModal(props:Props) {

    const [file, setFile] = useState<File>()
    const [status, setStatus] = useState<STATUS_CODE>("WAIT");

    useEffect( () => {
        file && setStatus("LOADING")
    }, [file]);

    return (
        <Modal show={props.modalFlag} onHide={props.modalClose} dialogClassName={styles.width} >

            <Modal.Header closeButton={true}>
                <h1>Export Batch</h1>
            </Modal.Header>


            <Modal.Body>

               <div style={{display:"flex"}}>
                   <SingleFileUpload file={file} setFile={setFile} isLoading={status === 'LOADING'} isComplete={status === 'COMPLETE'}
                                     maxSize={1024*1024*10} accept={{"":["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]}} />
                   <UploadDescription/>
               </div>

            </Modal.Body>


        </Modal>
    )
}

function UploadDescription() {

    return <div className={styles.sampleDescription}>
        <ol style={{listStyleType: 'decimal'}}>
            <li>
                <div>Download .XLSM sample to upload.</div>
                <Button className={styles.downloadSampleBtn} variant={"primary"}><FaCloudDownloadAlt size={25}/> Download .XLSM sample</Button>
            </li>
            <li>
                After filling out the form, Drag File on the left the file box or Select the file box
            </li>
            <li>
                Make sure that the uploaded file's column and system upload column are the same and click the Upload button.
            </li>
        </ol>
    </div>
}