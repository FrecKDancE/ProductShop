import Card from '../Card/Card';
import style from './Main.module.scss';
import { useBasket } from '../../context/BasketContext';

const Main:React.FC = () => {
    const { productCounts, increaseCount, decreaseCount, addToBasket } = useBasket();

    return (
        <main className={style.main}>
            <div className={style.main__container}>
                <h2 className={style.main__title}>Catalog</h2>
                <Card
                    productCounts={productCounts}
                    increaseCount={increaseCount}
                    decreaseCount={decreaseCount}
                    addToBasket={addToBasket}
                />
            </div>
        </main>
    );
};

export default Main;
