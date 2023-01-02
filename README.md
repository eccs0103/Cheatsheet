# Cheatset (Шпаргалка)
Программа для решения тестов.  
© Adaptive Core 2022  
- - -
## Руководство
Для работы программы требуется база данных. База данных должен быть файл JSON со структурой:  
```lang-js
{
	title: String,
	date: Number,
	poles: Array<{
		question: String,
		answer: Number,
		cases: Array<String>,
	}>,
}
```
и может быть загружен с устройства или импортирован с помощью ссылки.
- - -
## Новости
### Обновление 1.1.0 (02.01.2023)
 - Изменен дизайн.  
 - Добавлена возможность загружать базу данных с устройства.  
 - Исправлены мелкие ошибки.  
 - Улучшена система обработки ошибок.  

### Обновление 1.0.2 (24.12.2022)
- Изменены метаданные․  
- Слегка обновлен дизайн․  

### Обновление 1.0.0 (21.12.2022)
- Адаптирован дизайн как и на мобильные устройства, так и для планшетов и компьютеров.  
- Добавлена возможность удаления базы данных.  
- Изменена полоса прокрутки.  