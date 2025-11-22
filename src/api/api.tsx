export default class API {
    async getProducts() {
        try {
            const response = await fetch(
                `https://res.cloudinary.com/sivadass/raw/upload/v1535817394/json/products.json`
            );
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            const products = await response.json();
            return products;
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
            return [];
        }
    }
}
