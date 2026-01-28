import AboutList from "../sub-components/AboutList"
import about from '../content/about';
import '../css/about.css';

function About(){
    return(
        <div className="about-page">
            {about.map(indi_about=>{
                return(<AboutList key={indi_about.title} title={indi_about.title} content={indi_about.content}/>);
            })}
        </div>
    );
}

export default About;