import { render, screen } from '@testing-library/react';
import Main from './Main';
import { BasketProvider } from '../../context/BasketContext';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';

describe('Компонент Main', () => {
    beforeEach(()=> {
        render(
            <BasketProvider>
                <Main />
            </BasketProvider>
        )
    })
    it('рендерится заголовок', () => {
        expect(screen.getByText('Catalog')).toBeInTheDocument()
    })

    it('рендерит компонент Card внутри себя', () => {
        const cardComponent = screen.getByTestId('card-component');
        expect(cardComponent).toBeInTheDocument();
    });
})