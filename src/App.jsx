import React from 'react'
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import AllProducts from './pages/AllProducts'
import ProductCategory from './pages/ProductCategory'
import ProductDetails from './pages/ProductDetails'
import LoginPage from './pages/LoginPage'
import Cart from './pages/Cart'
import { Toaster } from 'react-hot-toast';
import { useAppContext } from './context/AppContext';

const App = () => {
    const isSellerPath = useLocation().pathname.includes('seller');
    const isLoginPage = useLocation().pathname === '/login';
    const { showUserLogin } = useAppContext();
    
    return (
        <div>
            {isSellerPath ? null : <Navbar/>}

            <Toaster/>
            <div className={`${isSellerPath || isLoginPage ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
                <Routes>
                    <Route path='/' element={<Home/>} />
                    <Route path='/products' element={<AllProducts/>} />
                    <Route path='/products/:category' element={<ProductCategory/>} />
                    <Route path='/product/:id' element={<ProductDetails/>} />
                    <Route path='/cart' element={<Cart/>} />
                    <Route path='/login' element={<LoginPage/>} />
                    <Route path='*' element={<div>Page Not Found</div>} />
                </Routes>
            </div>
            
            {/* Footer - always show except on seller and login pages */}
            {!isSellerPath && !isLoginPage && <Footer />}
            
            {/* Login Modal - show when showUserLogin is true */}
            {showUserLogin && <Login />}
        </div>
    )
}

export default App