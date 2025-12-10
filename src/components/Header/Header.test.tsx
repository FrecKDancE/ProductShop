import { render, screen } from '@testing-library/react';
import Header from './Header';
import { BasketProvider } from '../../context/BasketContext';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';

describe('Компонент Header', () =>{
    beforeEach(()=> {
        render(
            <BasketProvider>
                <Header />
            </BasketProvider>
        )
    })
    it('рендерится лого', () => {
        expect(screen.getByText('Vegetable')).toBeInTheDocument();
        expect(screen.getByText('SHOP')).toBeInTheDocument();
    })

    it('рендерится корзина', () => {
        expect(screen.getByText('Cart')).toBeInTheDocument();
    })
    it('рендерится иконка корзины', () => {
        expect(screen.getByAltText('Cart')).toBeInTheDocument()
    })
})