import React from 'react';
import Card from '../Card/Card';
import style from './Main.module.scss';

const Main: React.FC = () => {
    return (
        <main className={style.main}>
            <div className={style.main__container}>
                <h2 className={style.main__title}>Catalog</h2>
                <Card />
            </div>
        </main>
    );
};

export default Main;
