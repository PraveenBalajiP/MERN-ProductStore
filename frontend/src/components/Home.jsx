import ReasonList from "../sub-components/ReasonList";
import WorkList from "../sub-components/WorkList";
import {reasons,works} from "../content/home";
import "../css/home.css";

function Home(){
  return(
    <div className="home">
      <div className="home-bg" aria-hidden="true">
        <div className="home-dotgrid"></div>
      </div>
      <div className="home-content">
      <div className="main-sec">
        <div className="home-caption">
            <p className="para-1"> Explore a wide range of products in one place.</p>
            <p className="para-2"> List your own and reach the right buyers.</p>
        </div>
        <div className="start-section">
          <div className="start-border">
            <button className="start-btn"><a href="/login">Get Started</a></button>
          </div>
      </div>
      </div>
      <div className="home-reason">
        <p>Why choose Product Store?</p>
        <div className="reason-cards">
            {reasons.map(reason=>{
              return(<ReasonList title={reason.title} description={reason.description} key={reason.title}/>);
            })}
        </div>
      </div>
      <div className="home-how">
        <p>How it Works?</p>
        <div className="work-cards">
            {works.map(work=>{
              return(<WorkList title={work.title} description={work.description} key={work.title}/>);
            })}
        </div>
      </div>
      </div>
    </div>
  );
}

export default Home;