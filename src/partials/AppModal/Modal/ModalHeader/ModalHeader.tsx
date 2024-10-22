import React from 'react';

const ModalHeader: React.FC = ({ children }) => {
  return (
    <div className="modal-header align-items-center">
      {children}
      <button className="close" data-dismiss="modal" aria-label="close demo guide">
        <i className="fa fa-times"></i>
      </button>
    </div>
  );
};

export default ModalHeader;
