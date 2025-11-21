import ky from 'https://esm.sh/ky';

export default class API {
  async getProducts() {
    try {
      const products = await ky(
        `https://res.cloudinary.com/sivadass/raw/upload/v1535817394/json/products.json`
      ).json();
      return products;
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
      return [];
    }
  }
}
