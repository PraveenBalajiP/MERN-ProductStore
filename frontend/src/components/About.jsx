import AboutList from "../sub-components/AboutList"
import '../css/about.css';

function About(){
    const about=[
        {
            "title": "Who We Are",
            "content": "We are a simple, modern product discovery platform built as a prototype to explore how people can connect through products. Our focus is on helping users find items easily and reach out to the right people without unnecessary complexity."
        },
        {
            "title": "What We Do",
            "content": "Our platform allows users to list products, search through available items, and connect directly with others who are interested. Its designed to make discovery fast and communication effortless, keeping the experience straightforward and user-friendly."
        },
        {
            "title": "Our Vision",
            "content": "This prototype aims to demonstrate how a clean interface and smart search can bring buyers and sellers together. We believe that connecting people around products should be intuitive, transparent, and accessible to everyone."
        },
        {
            "title": "Why This Platform",
            "content": "We prioritize simplicity, speed, and clarity. By removing extra steps, the platform lets users focus on what matters most—finding products and connecting with people who have them."
        }
    ]
    return(
        <div className="about-page">
            <div className="about">
                {about.map(indi_about=>{
                    return(<AboutList key={indi_about.title} title={indi_about.title} content={indi_about.content}/>);
                })}
            </div>
            <div className="images">
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f" alt="About Image 1" className="about-image"/>
                <img src="https://images.unsplash.com/photo-1525182008055-f88b95ff7980" alt="About Image 2" className="about-image"/>
            </div>
        </div>
    );
}

export default About;