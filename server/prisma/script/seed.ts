const fs = require('fs');
const path = require('path');

const seed = async () => {};

// Вызываем функцию seed
seed()
  .then(() => {
    console.log('Посев завершен успешно');
  })
  .catch((error) => {
    console.error('Ошибка при посеве:', error);
  });

export default seed;
