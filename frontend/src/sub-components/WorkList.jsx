import "../css/work-list.css";

function WorkList({title,description}){
    return(
        <div className="work-card">
            <h2>{title}</h2>
            <p>{description}</p>
        </div>
    );
}

export default WorkList;