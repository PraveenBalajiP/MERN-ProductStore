import ReasonList from "../sub-components/ReasonList";
import WorkList from "../sub-components/WorkList";
import "../css/home.css";

function Home(){
  const reasons=[
    {
      "title":"Easy Product Listing",
      "description":"Add, update, and manage products effortlessly."
    },
    {
      "title":"Direct Buyer-Seller Interaction",
      "description":"Connect and trade without intermediaries."
    },
    {
      "title":"Centralized marketplace",
      "description":"Safe payment options for peace of mind."
    },
    {
      "title":"Transparent product details",
      "description":"Comprehensive product information for informed decisions."
    },
    {
      "title":"User-friendly interface",
      "description":"Intuitive design for seamless navigation."
    },
    {
      "title":"Scalable and flexible",
      "description":"Adaptable to your growing business needs."
    }
  ]

  const works=[
    {
      "title":"Explore",
      "description":"Browse available products or use search and filters to find exactly what you need."
    },
    {
      "title":"Add Products",
      "description":"Upload product details, images, and pricing to list items for sale instantly."
    },
    {
      "title":"Connect",
      "description":"Interact with buyers or sellers directly through your account and manage inquiries."
    },
    {
      "title":"Complete",
      "description":"Finalize transactions securely and keep track of your activity in one place."
    }
  ]

  return(
    <div className="home">
      <div className="home-caption">
          <p className="para-1"> Explore a wide range of products in one place.</p>
          <p className="para-2"> List your own and reach the right buyers.</p>
      </div>
      <div className="start-section">
        <div className="start-border">
          <button className="start-btn">Get Started</button>
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
  );
}

export default Home;