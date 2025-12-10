import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import BasketModal from './BasketModal';
import { BasketProvider, useBasket } from '../../context/BasketContext';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom';

const mockProduct = {
    id: 1,
    name: 'Test Product - 1kg',
    image: 'test-image-url',
    price: 100,
};

const BasketAddTestProduct = ({ onAddProduct }: { onAddProduct?: () => void }) => {
    const { addToBasket } = useBasket();
    
    const addTestProduct = () => {
        addToBasket(mockProduct);
        onAddProduct?.();
    };

    return (
        <button onClick={addTestProduct}>Add Test Product</button>
    );
};

describe('Компонент BasketModal', () => {
    const mockOnClose = vi.fn();
    
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    describe('когда корзина пустая', () => {
        beforeEach(() => {
            render(
                <BasketProvider>
                    <BasketModal onClose={mockOnClose} />
                </BasketProvider>
            );
        });

        it('должен показывать сообщение о пустой корзине', () => {
            expect(screen.getByText('Your cart is empty!')).toBeInTheDocument();
            expect(screen.getByAltText('Cart is empty')).toBeInTheDocument();
        });

        it('не должен показывать список продуктов при пустой корзине', () => {
            expect(screen.queryByRole('list')).not.toBeInTheDocument();
            expect(screen.queryByText('Test Product')).not.toBeInTheDocument();
        });
    });

    describe('когда в корзине есть продукты', () => {
        beforeEach(() => {
            render(
                <BasketProvider>
                    <BasketAddTestProduct />
                    <BasketModal onClose={mockOnClose} />
                </BasketProvider>
            );
            
            fireEvent.click(screen.getByText('Add Test Product'));
        });

        it('должен увеличивать количество товара при нажатии на кнопку плюс', () => {
            const increaseButton = screen.getByRole('button', { name: /increase/i });
            
            fireEvent.click(increaseButton);

            expect(screen.getByText('2')).toBeInTheDocument();
            expect(screen.getByText('$ 200')).toBeInTheDocument();
        });

        it('должен удалять товар при уменьшении количества до нуля', () => {
            const decreaseButton = screen.getByRole('button', { name: /decrease/i });
            
            fireEvent.click(decreaseButton);
            
            expect(screen.getByText('Your cart is empty!')).toBeInTheDocument();
            expect(screen.queryByText('Test Product')).not.toBeInTheDocument();
        });
    });

    describe('взаимодействие пользователя', () => {
        it('должен вызывать onClose при клике вне модального окна', () => {
            render(
                <BasketProvider>
                    <BasketModal onClose={mockOnClose} />
                </BasketProvider>
            );

            fireEvent.mouseDown(document);
            
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });

        it('должен корректно рассчитывать общую стоимость при нескольких товарах', () => {
            render(
                <BasketProvider>
                    <BasketAddTestProduct />
                    <BasketModal onClose={mockOnClose} />
                </BasketProvider>
            );

            fireEvent.click(screen.getByText('Add Test Product'));
            fireEvent.click(screen.getByText('Add Test Product'));
            
            expect(screen.getByText('$ 200')).toBeInTheDocument();
        });
    });
});