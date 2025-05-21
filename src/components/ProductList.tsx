import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/cart";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart, isAuthenticated } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*');
        
        if (error) {
          throw error;
        }

        if (data) {
          setProducts(data);
        }
        
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onAddToCart={addToCart}
          isAuthenticated={isAuthenticated}
        />
      ))}
    </div>
  );
};

const ProductCard = ({ 
  product, 
  onAddToCart,
  isAuthenticated
}: { 
  product: Product; 
  onAddToCart: (product: Product, quantity: number) => Promise<void>;
  isAuthenticated: boolean;
}) => {
  const [quantity, setQuantity] = useState(1);

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // Get all available product images
  const getProductImages = () => {
    const images = [];
    
    if (product.image_url) images.push(product.image_url);
    if (product.image_url_2) images.push(product.image_url_2);
    if (product.image_url_3) images.push(product.image_url_3);
    if (product.image_url_4) images.push(product.image_url_4);
    if (product.image_url_5) images.push(product.image_url_5);
    
    if (images.length === 0) {
      return ['https://images.unsplash.com/photo-1558002038-bb4237b9074f?q=80&w=1000'];
    }
    
    return images;
  };

  const images = getProductImages();

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setQuantity(1);
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full bg-card text-card-foreground">
      <div className="relative overflow-hidden bg-muted">
        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="aspect-square relative">
                  <img
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background" />
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background" />
        </Carousel>
      </div>
      <CardContent className="flex-grow p-3 sm:p-4">
        <h3 className="font-medium text-sm sm:text-base text-foreground">{product.name}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
          {product.description}
        </p>
        <div className="font-bold mt-2 text-sm sm:text-base text-primary">₱{product.price.toFixed(2)}</div>
      </CardContent>
      <CardFooter className="p-3 sm:p-4 pt-0">
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center border rounded bg-background">
              <Button 
                type="button" 
                size="icon" 
                variant="ghost"
                onClick={decrementQuantity}
                className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-muted"
              >
                <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <span className="w-6 sm:w-8 text-center text-sm text-foreground">{quantity}</span>
              <Button 
                type="button" 
                size="icon" 
                variant="ghost"
                onClick={incrementQuantity}
                className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-muted"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
          
          <Button 
            className="w-full h-8 sm:h-10 text-xs sm:text-sm bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleAddToCart}
            disabled={!isAuthenticated}
          >
            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            Add to Cart
          </Button>
          
          {!isAuthenticated && (
            <p className="text-xs text-muted-foreground text-center">
              Please sign in to add items to your cart
            </p>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductList;