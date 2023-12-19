import {Modal} from "react-bootstrap";
import {FileUpload} from "./FileUpload";
import {useState} from "react";

type Props = {
    modalFlag: boolean,
    modalClose: ()=>void,

}

export default function ExportUploadModal(props:Props) {

    const [files, setFiles] = useState<File[]>([])

    return (
        <Modal show={props.modalFlag} onHide={props.modalClose}>

            <Modal.Header closeButton={true}>
                <h1>Export Batch</h1>
            </Modal.Header>


            <Modal.Body>

                <FileUpload files={files} setFiles={setFiles} maxSize={1024*1024*10} accept={{"":["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]}} />

            </Modal.Body>


        </Modal>
    )
}