import {useState,useEffect} from 'react';
import {Routes,Route} from 'react-router-dom';
import NavBar from './common_components/navbar';
import Footer from "./common_components/footer";
import Home from './components/Home';
/*
import About from './components/About';
import Register from './components/Register';
import Login from './components/Login';
import Contact from './components/Contact';
import AddProduct from './components/AddProduct';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import Feedback from './components/Feedback';
*/

function App(){
  const [theme,setTheme]=useState("light");
  
  useEffect(()=>{
    document.documentElement.setAttribute("data-theme", theme);
  },[theme])
  return(
    <>
      <NavBar theme={theme} setTheme={setTheme}/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          {/*
          <Route path="/about" element={<About/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/add-product" element={<AddProduct/>}/>
          <Route path="/product/:id" element={<ProductDetails/>}/>
          <Route path="/cart" element={<Cart/>}/>
          <Route path="/feedback" element={<Feedback/>}/>
          */}
        </Routes>
        <Footer/>
    </>
    
  );
}

export default App;