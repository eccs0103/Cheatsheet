# Cheatset (Шпаргалка)
Программа для решения тестов.  
© Adaptive Core 2023  
- - -
## Руководство
Для работы программы требуется лист. Лист должен быть файл JSON со структурой:  
```js
{
	"title": String,
	"poles": Array<{
		"question": String,
		"answer": Number,
		"cases": String | Array<String>,
	}>,
}
```
и может быть загружен с устройства или импортирован с помощью ссылки.
- - -
## Новости
### Обновление 1.1.10 (13.01.2023)
 - Ускорена работа поиска с помощью предзагрузки данных.  
 - Ускорена работа сканирования листов с помощью предзагрузки данных.  
 - Усовершенствована возможность группового управления.  
 - Изменена стиль всплывающих окон.  

### Обновление 1.1.7 (12.01.2023)
 - Исправлена ошибка показа найстроек.  
 - Улучшена показ листов. Исправлена ошибка при которой затруднялась возможность открыть лист.  
 - Добавлена возможность скачать локальные листы.  
 - Добавлено групповое управление.  
 - Теперь можно загрузить с устройства несколько листов сразу.  

### Обновление 1.1.4 (11.01.2023)
 - При единственном варианте в вопросе его можно сразу передать как строку в JSON лист. Номер правильного ответа должен ему соответствовать под индексом 0.  
 - Усовершенствован метод сканирования листов.  
 - При создании листа теперь не понадобиться вводить дату. Она будет создана автоматически при импортировании листа.  
 - Улучшен вид вопросов и ответов.  
 - Прекращена поддержка лист старых форматов. Они будут автоматички переобразованы в новый формат.  

### Обновление 1.1.0 (02.01.2023)
 - Изменен дизайн.  
 - Добавлена возможность загружать лист с устройства.  
 - Исправлены мелкие ошибки.  
 - Улучшена система обработки ошибок.  

### Обновление 1.0.2 (24.12.2022)
- Изменены метаданные․  
- Слегка обновлен дизайн․  

### Обновление 1.0.0 (21.12.2022)
- Адаптирован дизайн как и на мобильные устройства, так и для планшетов и компьютеров.  
- Добавлена возможность удаления листов.  
- Изменена полоса прокрутки.  
