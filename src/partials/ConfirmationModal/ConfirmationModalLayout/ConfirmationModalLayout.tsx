import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {RootState, } from "../../../store/store";
// AppDispatch
import { closeConfirmationModal } from "../../../store/store";
import {useRef, useEffect} from "react";
import Progress from "../Progress/Progress";


const ConfirmationModalLayout: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const modalRef = useRef<HTMLDivElement | null>(null);
    const name= useSelector((state: RootState) => state.confirmationModal);
    
    const handleClose = () => {
        // dispatch(closeConfirmationModal());
        console.log('closeConfirmationModal');
    };

    useEffect(() => {
        const modal = modalRef.current;
        if (modal) {
            if (typeof window.bootstrap !== 'undefined') {
                const bsModal = new window.bootstrap.Modal(modal);
                if (name) {
                    bsModal.show();
                } else {
                    bsModal.hide();
                }
                modal.addEventListener('hidden.bs.modal', handleClose);
                return () => {
                    bsModal.hide();
                    modal.removeEventListener('hidden.bs.modal', handleClose);
            };
        }
    }
    
  
    }, [name, handleClose]);

    return (
        <div ref={modalRef} className="modal fade"  tabIndex={-1} aria-labelledby={`${name}-label`} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}><i className="fa-solid fa-xmark"></i></button>    
                    </div>
                    <div className="modal-body px-5 pb-5">
                        <Progress />
                            {/* {children} */}
                            <button className="close-modal btn btn-primary" onClick={handleClose}>Close</button>

                   
                    </div>
                </div>
            </div>
        </div>
    );

}



export default ConfirmationModalLayout;
