import Modal from "react-bootstrap/Modal";
import {config} from "./Config";
import Button from "react-bootstrap/Button";
import React from "react";


export default function ModalTest(props) {
    return (
        <Modal
            show={true}
            keyboard={false}
            animation={false}
            centered
        >

            <Modal.Header closeButton>
                <Modal.Title>
                    <div style={{marginBottom: "20px"}}>
                        <span style={{color: config.COLOR_GREEN}}>Kiwizzle</span>
                        <br/>
                        <span style={{fontSize: 20}}>Kiwizzle에서 다양한 개발 정보를 체험하세요!</span>
                    </div>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary">
                    {"닫기"}
                </Button>

            </Modal.Footer>
        </Modal>
    )
}
