import "../css/about-list.css";

function AboutList({title,content}){
    return(
        <div className="about-card">
            <h2>{title}</h2>
            <p>{content}</p>
        </div>
    );
}

export default AboutList;