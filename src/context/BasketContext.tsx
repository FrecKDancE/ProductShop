import React, { createContext, useContext, useState } from 'react';
import type {ReactNode } from 'react'

type ProductCount = {
    [key: number]: number;
};

export type BasketItem = {
    id: number;
    name: string;
    image: string;
    price: number;
    count: number;
};

type BasketContextType = {
    productCounts: ProductCount;
    increaseCount: (id: number) => void;
    decreaseCount: (id: number) => void;
    increaseItemCount: (id: number) => void;
    decreaseItemCount: (id: number) => void;
    setBasketItems: React.Dispatch<React.SetStateAction<BasketItem[]>>;
    addToBasket: (product: Omit<BasketItem, 'count'>) => void;
    basketItems: BasketItem[];
    basketCounter: number;
};

const BasketContext = createContext<BasketContextType | undefined>(undefined);

export const BasketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [productCounts, setProductCounts] = useState<ProductCount>({});
    const [basketItems, setBasketItems] = useState<BasketItem[]>([]);

    const increaseCount = (id: number) => {
        setProductCounts(prev => ({
            ...prev,
            [id]: (prev[id] || 1) + 1
        }));
    };


    const decreaseCount = (id: number) => {
        setProductCounts(prev => ({
            ...prev,
            [id]: Math.max((prev[id] || 1) - 1, 1)
        }));
    };

    const addToBasket = (product: Omit<BasketItem, 'count'>) => {
        const count = productCounts[product.id] || 1;
        if (count > 0){
            setBasketItems(prev => {
                const existingItem = prev.find(item => item.id === product.id);
                if (existingItem) {
                    return prev.map(item =>
                        item.id === product.id
                            ? { ...item, count: item.count + count }
                            : item
                    );
                } else {
                    return [...prev, { ...product, count }];
                }
            });
        }
        setProductCounts(prev => ({
            ...prev,
            [product.id]: 1,
        }));
    };


    const basketCounter = basketItems.reduce((sum, item) => sum + item.count, 0);


    const increaseItemCount = (id: number) => {
        setBasketItems(prev =>
            prev.map(item => 
                item.id === id ? { ...item, count: item.count + 1 } : item
            )
        );
    };

    const decreaseItemCount = (id: number) => {
        setBasketItems(prev => {
            const updatedItems = prev.map(item => 
                item.id === id ? { ...item, count: item.count - 1 } : item
            );
            return updatedItems.filter(item => item.count > 0);
        });
    };

    return (
        <BasketContext.Provider value={{
            productCounts,
            increaseCount,
            decreaseCount,
            increaseItemCount,
            decreaseItemCount,
            addToBasket,
            basketItems,
            basketCounter,
            setBasketItems
            
        }}>
            {children}
        </BasketContext.Provider>
    );
};

export const useBasket = (): BasketContextType => {
    const context = useContext(BasketContext);
    if (!context) {
        throw new Error('useBasket должен использоваться в BasketProvider');
    }
    return context;
};
