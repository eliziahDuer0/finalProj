import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Product } from "@/types";
import { CartItem } from "./types";

export const fetchCartItems = async (userId: string) => {
  try {
    // Get cart items with product details using joins
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        products(*)
      `)
      .eq('user_id', userId);

    if (error) throw error;
    
    // Transform the data to match our CartItem type
    const cartItems = data?.map(item => ({
      ...item,
      product: item.products
    })) || [];
    
    return cartItems;
  } catch (error: any) {
    console.error("Error fetching cart:", error.message);
    toast.error("Failed to load your cart");
    return [];
  }
};

export const addItemToCart = async (userId: string, product: Product, quantity: number) => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .insert({
        user_id: userId,
        product_id: product.id,
        quantity
      });

    if (error) throw error;
    toast.success("Added to cart");
    return true;
  } catch (error: any) {
    console.error("Error adding to cart:", error.message);
    toast.error("Failed to add to cart");
    return false;
  }
};

export const removeItemFromCart = async (itemId: string) => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;
    toast.success("Removed from cart");
    return true;
  } catch (error: any) {
    console.error("Error removing from cart:", error.message);
    toast.error("Failed to remove from cart");
    return false;
  }
};

export const updateItemQuantity = async (itemId: string, quantity: number) => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId);

    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error("Error updating quantity:", error.message);
    toast.error("Failed to update quantity");
    return false;
  }
};

export const clearAllCartItems = async () => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (error) throw error;
    toast.success("Cart cleared");
    return true;
  } catch (error: any) {
    console.error("Error clearing cart:", error.message);
    toast.error("Failed to clear cart");
    return false;
  }
};

export const calculateTotals = (cartItems: CartItem[]) => {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  return { totalItems, totalPrice };
};
