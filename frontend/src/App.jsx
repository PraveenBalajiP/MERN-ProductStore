import {Routes,Route} from 'react-router-dom';
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
  return(
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
  );
}

export default App;