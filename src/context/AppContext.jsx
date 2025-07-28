import { createContext, useContext ,useEffect,useState} from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const AppContextProvider=({children})=>{

    const currency = import.meta.VITE_CURRENCY;
    const navigate = useNavigate();
    const [user,setUser] = useState(null) //true,false,null
    const [isSeller,setIsSeller] = useState(false)
    const [showUserLogin,setShowUserLogin] = useState(false);
    const [products,setProducts] = useState([])
    const [cartItems,setCartItems] = useState({})

    //Fetch All products
    const fetchProducts = async () => {
        setProducts(dummyProducts)
    }
    //Add product to cart
    const addToCart =(itemId) => {
        let cartData = structuredClone(cartItems);

        if(cartData[itemId]){
            cartData[itemId] += 1;
        }else{
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        toast.success("Added to Cart")
    }
    //update cart item quantity
    const updateCartItem = (itemId,quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId] = quantity;
        setCartItems(cartData);
        toast.success("Cart Updated")
    }
    //remove product from cart
    const removeFromCart = (itemId) => {
        let cartData = structuredClone(cartItems);
        if(cartData[itemId]){
            cartData[itemId] -= 1;
            if(cartData[itemId] === 0){
                delete cartData[itemId];
            }
        }
        toast.success("Removed from Cart")
        setCartItems(cartData);
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    const value = {navigate, user, setUser, setIsSeller,isSeller,showUserLogin,setShowUserLogin,products,
        currency,addToCart,updateCartItem,removeFromCart,cartItems}

    return <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    
}

export const useAppContext = () => {
    return useContext(AppContext);
}

