import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {RootState, AppDispatch} from "../../store";
import { closeConfirmationModal } from "../../actions";
import {useRef, useEffect} from "react";
import Progress from "../Progress/Progress";


const ConfirmationModalLayout: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const modalRef = useRef<HTMLDivElement | null>(null);
    const name= useSelector((state: RootState) => state.confirmationModal.name);
    
    const handleClose = () => {
        dispatch(closeConfirmationModal());
    };

    useEffect(() => {
        const modal= modalRef.current;
        if(modal){
            const $modal= window.$(modal);
            $modal.modal(name? 'show': 'hide');
            $modal.on('hidden.bs.modal', handleClose);
            return () => {
                $modal.modal('hide');
            };
        }
    }, [name, handleClose]);

    return (
        <div ref={modalRef} className="modal fade" id={name} tabIndex={-1} aria-labelledby={`${name}-label`} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}><i className="fa-solid fa-xmark"></i></button>    
                    </div>
                    <div className="modal-body px-5 pb-5">
                        <Progress className="mb-4" />
                            {children}
                            <button className="close-modal btn btn-primary" onClick={handleClose}>Close</button>

                   
                    </div>
                </div>
            </div>
        </div>
    );

}



export default ConfirmationModalLayout;
