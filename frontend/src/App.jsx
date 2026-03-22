import { useState,useEffect } from 'react';
import Lenis from "@studio-freight/lenis";
import { Routes,Route,useLocation } from 'react-router-dom';
import NavBar from './common_components/navbar';
import Footer from "./common_components/footer";
import Home from './components/Home';
import About from './components/About';
import Signup from './components/Signup';
import Login from './components/Login';
import User from './components/User';
import Orders from './components/Orders';
import Wishlist from './components/Wishlist';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Browse from './components/Browse';
import ProductDetail from './components/ProductDetail';
import AddProduct from './components/AddProduct';
import EditProduct from './components/EditProduct';
import { Toaster } from "react-hot-toast";
import './css/toast.css';

/*
import Contact from './components/Contact';
import AddProduct from './components/AddProduct';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import Feedback from './components/Feedback';
*/

function App() {
  const [theme,setTheme]=useState(localStorage.getItem('theme') || 'light');
  const location=useLocation();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  },[theme]);

  useEffect(() => {
    const lenis = new Lenis({
      duration:0.5,
      smoothWheel:true,
      smoothTouch:true,
      easing:(t)=>1-Math.pow(1-t,4),
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return()=>{
      lenis.destroy();
    };
  }, []);

  useEffect(()=>{
    window.scrollTo({top:0,left:0,behavior:'auto'});
  },[location.pathname]);

  return (
    <>
      <NavBar theme={theme} setTheme={setTheme} />
      <Toaster
        position="bottom-center"
        toastOptions={{
          className:"toast-default",
          duration:3000,
          success:{
            className:"toast-success"
          },
          error:{
            className:"toast-error",
            duration:3800
          },
          loading:{
            className:"toast-loading"
          }
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/users/:name" element={<User />}>
          <Route path="browse" element={<Browse/>}/>
          <Route path="profile" element={<Profile/>}/>
          <Route path="orders" element={<Orders/>}/>
          <Route path="wishlist" element={<Wishlist/>}/>
          <Route path="settings" element={<Settings/>}/>
          <Route path="products/:id" element={<ProductDetail/>}/>
          <Route path="addProduct" element={<AddProduct/>}/>
          <Route path="editProduct/:id" element={<EditProduct/>}/>
        </Route>
          {/*
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/feedback" element={<Feedback/>}/>
          */}
      </Routes>
      <Footer/>
    </>
  );
}

export default App;