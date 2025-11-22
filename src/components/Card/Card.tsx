import API from '../../api/api';
import { useState, useEffect } from 'react';
import style from './Card.module.scss';
import cartGreen from '../../assets/cartGreen.svg';
import minusButton from '../../assets/minusButton.svg';
import plusButton from '../../assets/plusButton.svg';
import { useBasket } from '../../context/BasketContext';
import loaderImg from '../../assets/loader.png'

type Product = {
    id: number;
    name: string;
    image: string;
    price: number;
}

const Card: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const api = new API();
    const { productCounts, increaseCount, decreaseCount, addToBasket } = useBasket();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                await new Promise((resolve) => setTimeout(resolve, 2000));
                const data = await api.getProducts();
                setProducts(data);
            } catch (error) {
                console.log(error);
                console.log('Не удалось загрузить список продуктов.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <ul className={style.productsList}>
            {loading ? (
                Array.from({ length: 20 }).map((_, index) => (
                    <li key={index} className={`${style.productsList__card} ${style.card__loader}`}>
                        <img className={style.card__image} src={loaderImg}/>
                    </li>

                ))
            ) : (
                products.map((product) => {
                    const [name, weight = ''] = product.name.split(' - ');
                    const lowerWeight = weight.toLowerCase();
                    return (
                        <li className={style.productsList__card} key={product.id}>
                            <img className={style.card__image} src={product.image} alt={name} />
                            <div className={style.card__title}>
                                <div className={style.card__productName}>
                                    <h4>{name}</h4>
                                    <p>{lowerWeight}</p>
                                </div>
                                <div className={style.card__counter}>
                                    <button className={style['counter__button-minus']} onClick={() => decreaseCount(product.id)}>
                                        <img src={minusButton} alt="Decrease" />
                                    </button>
                                    <span className={style['counter__button-value']}>{productCounts[product.id] || 0}</span>
                                    <button className={style['counter__button-plus']} onClick={() => increaseCount(product.id)}>
                                        <img src={plusButton} alt="Increase" />
                                    </button>
                                </div>
                            </div>
                            <div className={style.card__price}>
                                <h3>${product.price}</h3>
                                <button className={style.card__buttonAddBasket} onClick={() => addToBasket(product)}>
                                    Add to cart <img src={cartGreen} alt="Cart" />
                                </button>
                            </div>
                        </li>
                    );
                })
            )}
        </ul>
    );
};

export default Card;
