import Header from '../Header/Header';
import Main from '../Main/Main';
import { BasketProvider } from '../../context/BasketContext'; // Импортируйте провайдер

const App:React.FC = () => {
    return (
        <BasketProvider>
            <Header />
            <Main />
        </BasketProvider>
    );
}

export default App;
