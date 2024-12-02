const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Данные: соответствие ключевых слов и URL
const keywords = {
  technology: ['https://techcrunch.com', 'https://www.wired.com'],
  science: ['https://www.nature.com', 'https://www.sciencemag.org'],
  sports: ['https://www.espn.com', 'https://www.sportsnews.com']
};

// Middleware для обработки JSON-запросов
app.use(express.json());

// Папка для статики (файлы клиента)
app.use(express.static(path.join(__dirname, 'public')));

// Корневой маршрут для отдачи index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Маршрут для получения URL по ключевому слову
app.get('/api/urls', (req, res) => {
  const keyword = req.query.keyword?.toLowerCase(); // Приведение ключевого слова к нижнему регистру
  console.log('Получено ключевое слово:', keyword);

  if (!keyword || !keywords[keyword]) {
    console.log('Ключевое слово не найдено:', keyword);
    return res.status(404).json({ error: 'Keyword not found.' });
  }

  console.log('Найдены URL:', keywords[keyword]);
  res.json({ urls: keywords[keyword] });
});

// Маршрут для загрузки содержимого по URL
app.post('/api/download', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    console.error('URL не указан');
    return res.status(400).json({ error: 'URL не указан' });
  }

  try {
    console.log('Загрузка содержимого с URL:', url);
    const response = await axios.get(url);
    res.json({ content: response.data });
  } catch (error) {
    console.error('Ошибка при загрузке URL:', error.message);
    res.status(500).json({ error: 'Не удалось загрузить содержимое' });
  }
});

// Обработка ошибок для неизвестных маршрутов
app.use((req, res) => {
  res.status(404).send('Маршрут не найден');
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
