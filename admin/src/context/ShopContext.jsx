
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const currency = "$";
  const delivery_fee = 100;

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://toyshop-sooty.vercel.app/api/products"
      );
      setProducts(response.data); // Assuming response is an array of products
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const value = {
    products,
    setProducts,
    currency,
    delivery_fee,
    fetchProducts,
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
