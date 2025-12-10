import style from './BasketModal.module.scss';
import cartEmpty from '../../assets/CartEmpty.svg';
import { useBasket } from '../../context/BasketContext';
import { useEffect, useRef } from 'react';
import minusButton from '../../assets/minusButton.svg';
import plusButton from '../../assets/plusButton.svg';
import type { BasketItem } from '../../context/BasketContext';

interface BasketModalProps {
    onClose: () => void;
}

const BasketModal: React.FC<BasketModalProps> = ({ onClose }) => {
    const { basketItems, decreaseItemCount, increaseItemCount } = useBasket();
    const basketRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (basketRef.current && !basketRef.current.contains(event.target as Node)) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const calculateTotalPrice = (basketItems: BasketItem[]): number => {
        return basketItems.reduce((total: number, item: BasketItem) => {
            return total + (item.price * item.count);
        }, 0);
    };


    const totalPrice = calculateTotalPrice(basketItems);

    return (
        <div className={style.modal__container} ref={basketRef}>
            {basketItems.length === 0 ? (
                <div className={style['modal__container__productsList-empty']}>
                    <img src={cartEmpty} alt="Cart is empty" />
                    <p>Your cart is empty!</p>
                </div>
            ) : (
                <>
                    <ul className={style.modal__container__productsList}>
                        {basketItems.map((item) => {
                            const [name, weight = ''] = item.name.split(' - ');
                            const lowerWeight = weight.toLowerCase();
                            return (
                                <li className={style.productsList__item} key={item.id}>
                                    <img src={item.image} alt={name} />
                                    <div className={style.item__info}>
                                        <div className={style.item__title}>
                                            <h4>{name}</h4>
                                            <p>{lowerWeight}</p>
                                        </div>
                                        <div className={style.item__price}>
                                            <h3>$ {item.price}</h3>
                                            <div className={style.item__counter}>
                                                <button className={style['counter__button-minus']} onClick={() => decreaseItemCount(item.id)}>
                                                    <img src={minusButton} alt="Decrease" />
                                                </button>
                                                <span className={style['counter__button-value']}>{item.count}</span>
                                                <button className={style['counter__button-plus']} onClick={() => increaseItemCount(item.id)}>
                                                    <img src={plusButton} alt="Increase" />
                                                </button>
                                            </div>
                                        </div>  
                                    </div>   
                                </li>
                            );
                        })}
                    </ul>
                    <div className={style.productsList__total}>
                        <p>Total</p>
                        <p>$ {totalPrice.toFixed(0)}</p>
                    </div>
                </>
            )}
        </div>
    );
};

export default BasketModal;
