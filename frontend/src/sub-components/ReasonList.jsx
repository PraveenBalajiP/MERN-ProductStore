import "../css/reason-list.css";

function ReasonList({title,description}){
    return(
        <div className="reason-card">
            <h2>{title}</h2>
            <p>{description}</p>
        </div>
    );
}

export default ReasonList;