import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import Card from './Card';
import { BasketProvider } from '../../context/BasketContext';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';

const mockGetProducts = vi.fn();

vi.mock('../../api/api', () => ({
  default: class MockAPI {
    getProducts = mockGetProducts;
  }
}));

describe('Компонент Card', () => {
  beforeEach(() => {
    mockGetProducts.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it('отображает скелетоны при загрузке', () => {
    mockGetProducts.mockReturnValue(new Promise(() => {}));

    render(
      <BasketProvider>
        <Card />
      </BasketProvider>
    );

    const skeletonCards = screen.getAllByRole('listitem');
    expect(skeletonCards).toHaveLength(20);

    const loaderImages = screen.getAllByAltText('LoaderSkeleton');
    expect(loaderImages).toHaveLength(20);
  });

  describe('взаимодействие с кнопками', () => {
    const mockProducts = [
      {
        id: 1,
        name: 'Apple - 1kg',
        image: 'apple.jpg',
        price: 100
      },
      {
        id: 2,
        name: 'Banana - 500g',
        image: 'banana.jpg',
        price: 50
      }
    ];

    beforeEach(() => {
      mockGetProducts.mockResolvedValue(mockProducts);
    });

    it('увеличивает счетчик при клике на кнопку "+"', async () => {
      render(
        <BasketProvider>
          <Card />
        </BasketProvider>
      );

      await screen.findByText('Apple');

      const increaseButtons = screen.getAllByRole('button', { name: /increase/i });
      expect(increaseButtons).toHaveLength(2);

      const initialCounters = screen.getAllByText('1');
      expect(initialCounters).toHaveLength(2);

      fireEvent.click(increaseButtons[0]);

      const updatedCounter = await screen.findByText('2');
      expect(updatedCounter).toBeInTheDocument();

      expect(screen.getAllByText('1')).toHaveLength(1);
    });

    it('уменьшает счетчик при клике на кнопку "-"', async () => {
      render(
        <BasketProvider>
          <Card />
        </BasketProvider>
      );

      await screen.findByText('Apple');

      const increaseButtons = screen.getAllByRole('button', { name: /increase/i });
      fireEvent.click(increaseButtons[0]);

      await screen.findByText('2');

      const decreaseButtons = screen.getAllByRole('button', { name: /decrease/i });
      fireEvent.click(decreaseButtons[0]);

      const counters = await screen.findAllByText('1');
      expect(counters).toHaveLength(2);
    });

    it('не позволяет счетчику опуститься ниже 1 при уменьшении', async () => {
      render(
        <BasketProvider>
          <Card />
        </BasketProvider>
      );

      await screen.findByText('Apple');

      const decreaseButtons = screen.getAllByRole('button', { name: /decrease/i });

      fireEvent.click(decreaseButtons[0]);

      const counters = screen.getAllByText('1');
      expect(counters).toHaveLength(2);
    });

    it('обрабатывает увеличение счетчика для разных товаров независимо', async () => {
      render(
        <BasketProvider>
          <Card />
        </BasketProvider>
      );

      await screen.findByText('Apple');

      const increaseButtons = screen.getAllByRole('button', { name: /increase/i });

      fireEvent.click(increaseButtons[0]);
      fireEvent.click(increaseButtons[0]);

      fireEvent.click(increaseButtons[1]);

      const counter3 = await screen.findByText('3');
      const counter2 = await screen.findByText('2');

      expect(counter3).toBeInTheDocument();
      expect(counter2).toBeInTheDocument();
    });

    it('добавляет товар в корзину с правильным количеством', async () => {
      render(
        <BasketProvider>
          <Card />
        </BasketProvider>
      );

      await screen.findByText('Apple');

      const increaseButtons = screen.getAllByRole('button', { name: /increase/i });
      const addToCartButtons = screen.getAllByRole('button', { name: /add to cart/i });

      fireEvent.click(increaseButtons[0]);
      fireEvent.click(increaseButtons[0]);

      fireEvent.click(addToCartButtons[0]);

      await new Promise(resolve => setTimeout(resolve, 0));
      const counterAfterAdd = screen.getAllByText('1');
      expect(counterAfterAdd).toHaveLength(2);
    });

    it('проверяет отображение кнопок с правильными иконками', async () => {
      render(
        <BasketProvider>
          <Card />
        </BasketProvider>
      );

      await screen.findByText('Apple');

      const decreaseIcons = screen.getAllByAltText('Decrease');
      const increaseIcons = screen.getAllByAltText('Increase');
      const cartIcons = screen.getAllByAltText('Cart');

      expect(decreaseIcons).toHaveLength(2);
      expect(increaseIcons).toHaveLength(2);
      expect(cartIcons).toHaveLength(2);

      const addButtons = screen.getAllByText('Add to cart');
      expect(addButtons).toHaveLength(2);
    });

    it('корректно обрабатывает несколько кликов подряд', async () => {
      render(
        <BasketProvider>
          <Card />
        </BasketProvider>
      );

      await screen.findByText('Apple');

      const increaseButtons = screen.getAllByRole('button', { name: /increase/i });
      const decreaseButtons = screen.getAllByRole('button', { name: /decrease/i });

      fireEvent.click(increaseButtons[0]);
      fireEvent.click(increaseButtons[0]);
      fireEvent.click(decreaseButtons[0]);
      fireEvent.click(increaseButtons[0]);

      const finalCounter = await screen.findByText('3');
      expect(finalCounter).toBeInTheDocument();
    });
  });
});