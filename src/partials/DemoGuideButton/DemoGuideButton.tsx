import React from 'react';
import { useDispatch } from 'react-redux';
import { openModal } from '@/store/actions'; // Adjust this import according to your project structure
import { Modals } from '../AppModal/config';
// import './DemoGuideButton.css';

const DemoGuideButton: React.FC = () => {
    const dispatch = useDispatch();

    const openDemoGuide = () => {
        dispatch(openModal(Modals.DemoGuide));
    };

    return (
        <button className="button btn btn-primary" onClick={openDemoGuide}>
            <div className="demo-guide">DEMO GUIDE</div>
            <div className="learn-more">Learn more about this demo</div>
        </button>
    );
};

export default DemoGuideButton;
