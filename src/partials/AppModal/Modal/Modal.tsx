// import React, { useEffect, useRef } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import RootState from '../../../store/store';
// import { closeModal } from '@/store/actions';
// import ModalHeader from './ModalHeader/ModalHeader';
// import { APP_MODAL_ID } from '../config';
// import $ from 'jquery'; // Assuming jQuery is used for Bootstrap modals

// interface ModalProps {
//   ariaLabelledBy?: string;
//   showHeader?: boolean;
//   children: React.ReactNode;
// }

// const Modal: React.FC<ModalProps> = ({ ariaLabelledBy, showHeader = true, children }) => {
//   const modalRef = useRef<HTMLDivElement>(null);
//   const isMobile = useSelector((state: RootState) => state.modal.isMobile);
//   const dispatch = useDispatch();

//   const handleMobileState = () => {
//     if (modalRef.current) {
//       modalRef.current.classList[isMobile ? 'add' : 'remove']('modal--mobile');
//     }
//   };

//   useEffect(() => {
//     handleMobileState();
//   }, [isMobile]);

//   useEffect(() => {
//     const handleModalClose = () => {
//       dispatch(closeModal());
//     };

//     // Sync Bootstrap modal visibility with React state
//     $(`#${APP_MODAL_ID}`).on('hidden.bs.modal', handleModalClose);

//     return () => {
//       $(`#${APP_MODAL_ID}`).off('hidden.bs.modal', handleModalClose);
//     };
//   }, [dispatch]);

//   return (
//     <div
//       className="modal fade text-left"
//       ref={modalRef}
//       id={APP_MODAL_ID}
//       tabIndex={-1}
//       role="dialog"
//       aria-labelledby={ariaLabelledBy}
//       aria-hidden="true"
//     >
//       <div className="modal-dialog" role="document">
//         <div className="modal-content">
//           {showHeader && (
//             <div className="modal-header">
//               <ModalHeader />
//             </div>
//           )}
//           <div className="modal-body">{children}</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Modal;
