import { useBasket } from '../../context/BasketContext'; // Импортируйте хук контекста
import cartWhite from '../../assets/cartWhite.svg';
import style from './Header.module.scss';
import BasketModal from '../BasketModal/BasketModal';
import { useState } from 'react';

const Header:React.FC = () => {
    const { basketCounter } = useBasket();
    const [showBasketModal, setShowBasketModal] = useState<boolean>(false);

    const handleBasketModal = () => {
        setShowBasketModal(true);
    };

    const closeModal = () => {
        setShowBasketModal(false);
    };

    return (
        <header className={style.header}>
            <div className={style.header__container}>
                <a className={style.header__logo} href='/'>
                    <span className={style['header__logo-vegetable']}>Vegetable</span>
                    <span className={style['header__logo-shop']}>SHOP</span>
                </a>
                <button className={basketCounter ? style['header__cart-notEmpty'] : style['header__cart-empty']} onClick={handleBasketModal}>
                    {basketCounter ? <span>{basketCounter}</span> : null} Cart <img src={cartWhite} alt="Cart" />
                </button>
            </div>
            {showBasketModal && (<BasketModal onClose={closeModal} />)}
        </header>
    );
};

export default Header;
