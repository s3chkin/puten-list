# Инструкции за публикуване в GitHub Pages

## Стъпка 1: Създаване на GitHub репозиторий

1. Отидете на https://github.com
2. Натиснете бутона **"+"** в горния десен ъгъл
3. Изберете **"New repository"**
4. Попълнете:
   - **Repository name**: `puten-list` (или друго име)
   - **Description**: "Мобилно уеб приложение за попълване на пътен лист"
   - Изберете **Public** (за да работи GitHub Pages безплатно)
   - **НЕ** маркирайте "Add a README file" (вече имаме такъв)
5. Натиснете **"Create repository"**

## Стъпка 2: Качване на кода в GitHub

Изпълнете следните команди в терминала (заменете `your-username` с вашето GitHub потребителско име):

```bash
cd "/Users/sechkin/Documents/пътен лист - приложение"

# Добавете remote репозиторий (заменете your-username с вашето име)
git remote add origin https://github.com/your-username/puten-list.git

# Променете името на branch на main (ако е необходимо)
git branch -M main

# Качете кода
git push -u origin main
```

**Алтернативно** - ако предпочитате да използвате SSH:

```bash
git remote add origin git@github.com:your-username/puten-list.git
git branch -M main
git push -u origin main
```

## Стъпка 3: Активиране на GitHub Pages

1. Отидете в вашия GitHub репозиторий
2. Кликнете на **Settings** (в горното меню)
3. В лявото меню кликнете на **Pages**
4. Под **Source**:
   - Изберете **Branch: main**
   - Изберете папка **/ (root)**
5. Натиснете **Save**

## Стъпка 4: Достъп до приложението

След няколко минути вашето приложение ще бъде достъпно на:

**https://your-username.github.io/puten-list**

(Заменете `your-username` с вашето GitHub потребителско име и `puten-list` с името на репозитория)

## Обновяване на приложението

Когато направите промени:

```bash
cd "/Users/sechkin/Documents/пътен лист - приложение"
git add .
git commit -m "Описание на промените"
git push
```

GitHub Pages автоматично ще обнови сайта след няколко минути.

## Важни бележки

- Първото публикуване може да отнеме до 10 минути
- След всяка промяна, обновяването отнема 1-2 минути
- URL адресът винаги ще бъде: `https://your-username.github.io/repository-name`
- Приложението работи напълно в браузъра, без нужда от сървър

