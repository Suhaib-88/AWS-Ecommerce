import React,{useEffect} from "react";
import Navigation from "../../partials/Navigation/Navigation";
import Notifications from "../../public/Notifications";
import LoadingFallback from "../LoadingFallback/LoadingFallback";
import TextAlerts from "../../partials/TextAlerts/TextAlerts";
import Footer from "../../partials/Footer/Footer";
import AppModal from "../../partials/AppModal/AppModal";
import ConfirmationModal from "../../partials/ConfirmationModal/ConfirmationModal";
import DemoGuideButton from "../../partials/DemoGuideButton/DemoGuideButton";
import PreviousPageLink, {PreviousPageLinkProps} from "./PreviousPageLink";


interface LayoutProps{
    showNav?:boolean;
    showTextAlert?:boolean;
    showFooter?:boolean;
    showDemoGuide?:boolean;
    backgroundColor?:string;
    isLoading?:boolean;
    previousPageLinkProps?:PreviousPageLinkProps;
    children:React.ReactNode;
}


const Layout:React.FC<LayoutProps>=({showNav=true,showTextAlert=true,showFooter=true,showDemoGuide=true,backgroundColor='var(--color-background)',isLoading=false,previousPageLinkProps,children})=>{

    const updateBackgroundColor=(color:string)=>{
        document.body.style.setProperty("background-color",color);
}

    useEffect(()=>{
        updateBackgroundColor(backgroundColor);

        return ()=>{
            document.body.style.removeProperty('--background-color');
        }
        
    },[backgroundColor]);

    return (
        <div className={`layout {${showNav?"layout--has-nav":""}} ${showDemoGuide? 'layout--has-demo-guide': ''}`}>
            {showNav && <Navigation/>}
            {/* <Notifications/> */}

            {isLoading && <LoadingFallback className="container mb-4"/>}
            {isLoading && previousPageLinkProps && (<PreviousPageLink to={previousPageLinkProps.to} text={previousPageLinkProps.text} className="container mb-2"/>)}
            {!isLoading && children}
            {/* {showTextAlert && <TextAlerts className="mt-5"/>} */}

            {showFooter && <Footer className="my-4 container"/>}
            <AppModal/>
            <ConfirmationModal/>
            {showDemoGuide && <DemoGuideButton className= "demo-guide-button"/>}
        </div>
    );

};

export default Layout;

