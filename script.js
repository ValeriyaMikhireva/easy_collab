// Глобальные переменные
let companies = [];
let filteredCompanies = [];
let activeDropdown = null;



// Проверка загрузки JavaScript
console.log('🚀 JavaScript загружен! Версия 2.0');

// DOM элементы
let searchInput;
let companiesGrid;
const resultsCount = document.getElementById('resultsCount');
const modal = document.getElementById('companyModal');

// Состояние фильтров
let filterState = {
    businessArea: [],
    cooperation: [],
    barter: null // null, true, false
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Скрипт загружен, версия 2.0');
    
    // Инициализация бургер-меню
    initBurgerMenu();
    
    // Загрузка данных компаний
    loadCompanies();
    
    // Инициализация поиска
    initSearch();
    
    // Инициализация фильтров
    initFilters();
    
    // Глобальный обработчик кликов для закрытия дропдаунов
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.dropdown-filter')) {
            closeAllDropdowns();
        }
    });
    
    // Закрытие модального окна по клику вне его
    const modal = document.getElementById('companyModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});

// Инициализация бургер-меню
function initBurgerMenu() {
    const burgerMenu = document.getElementById('burgerMenu');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavClose = document.getElementById('mobileNavClose');
    
    burgerMenu.addEventListener('click', function() {
        burgerMenu.classList.toggle('active');
        mobileNav.classList.toggle('show');
        document.body.style.overflow = mobileNav.classList.contains('show') ? 'hidden' : '';
    });
    
    mobileNavClose.addEventListener('click', function() {
        burgerMenu.classList.remove('active');
        mobileNav.classList.remove('show');
        document.body.style.overflow = '';
    });
    
    // Закрытие по клику вне меню
    mobileNav.addEventListener('click', function(event) {
        if (event.target === mobileNav) {
            burgerMenu.classList.remove('active');
            mobileNav.classList.remove('show');
            document.body.style.overflow = '';
        }
    });
}

// Загрузка данных компаний
function loadCompanies() {
    console.log('Загружаем данные компаний...');
    
    // Если открыт напрямую как файл (без сервера), загружаем тестовые данные
    if (location.protocol === 'file:') {
        console.log('Обнаружен file: протокол. Использую тестовые данные вместо fetch.');
        loadTestData();
        return;
    }
    
    // Загружаем данные из CSV файла
    fetch('kollab_data.csv')
        .then(response => {
            console.log('Ответ от сервера:', response.status, response.statusText);
            return response.text();
        })
        .then(data => {
            console.log('Данные получены, длина:', data.length);
            console.log('Первые 200 символов:', data.substring(0, 200));
            
            companies = parseCSV(data);
            console.log('Компаний распарсено:', companies.length);
            console.log('Первая компания:', companies[0]);
            
            filteredCompanies = [...companies];
            displayCompanies();
            updateResultsCount();
        })
        .catch(error => {
            console.error('Ошибка загрузки данных:', error);
            console.log('Загружаем тестовые данные...');
            // Загружаем тестовые данные
            loadTestData();
        });
}

// Парсинг CSV
function parseCSV(csv) {
    console.log('Парсим CSV...');
    const lines = csv.split('\n').filter(line => line.trim());
    console.log('Количество строк:', lines.length);
    
    if (lines.length < 2) {
        console.error('CSV файл слишком короткий');
        return [];
    }
    
    // Улучшенный парсинг CSV с учетом кавычек
    function parseCSVLine(text) {
        const result = [];
        let current = '';
        let inQuotes = false;
        let i = 0;
        
        while (i < text.length) {
            const char = text[i];
            const nextChar = text[i + 1];
            
            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    // Двойные кавычки внутри строки
                    current += '"';
                    i += 2;
                    continue;
                } else {
                    // Начало или конец кавычек
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                // Разделитель вне кавычек
                result.push(current.trim());
                current = '';
                i++;
                continue;
            } else {
                current += char;
            }
            i++;
        }
        
        result.push(current.trim());
        return result;
    }
    
    const headers = parseCSVLine(lines[0]);
    console.log('Заголовки:', headers);
    
    const companies = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
            const values = parseCSVLine(lines[i]);
            const company = {};
            headers.forEach((header, index) => {
                company[header] = values[index] || '';
            });
            companies.push(company);
        }
    }
    
    console.log('Компаний создано:', companies.length);
    console.log('Первая компания:', companies[0]);
    return companies;
}

// Загрузка тестовых данных
function loadTestData() {
    companies = [
        {
            'Название компании / Имя Эксперта': 'Лотос',
            'Направление деятельности': 'Фитнес и wellness',
            'Направление бизнеса': 'Фитнес и wellness',
            'Коротко о компании (2–3 предложения)': 'Магнитно-волновой массаж',
            'Расскажите подробнее о своей компании/экспертизе': 'Полный спектр услуг для здоровья и красоты. Профессиональные массажисты с многолетним опытом работы.',
            'Какие рекламные возможности у вас есть? (можно выбрать несколько) ': 'Digital реклама (Соц.сети, сайт и т.д.); Печатная реклама (флаера, визитки и т.д.)',
            'Расскажите про свою аудиторию в соцсетях, если есть': 'Аудитория не указана',
            'Поделитесь цифрами: сколько заказов/клиентов вы получаете ежемесячно?': 'Клиенты не указаны',
            'Бартер': '',
            'Ваш Ник в Telegram для связи': '',
            'С кем вы хотели бы сотрудничать?': '',
            'Лого компании': 'аватарки/lotos.jpg'
        },
        {
            'Название компании / Имя Эксперта': 'Игра "ПсихоМаркетинг"',
            'Направление деятельности': 'Образование',
            'Направление бизнеса': 'Образование',
            'Коротко о компании (2–3 предложения)': 'Игра «ПсихоМаркетинг» - маркетинговая игра нового времени! Не имеющая аналогом на мировом рынке.',
            'Расскажите подробнее о своей компании/экспертизе': 'Инновационная настольная игра для изучения психологии маркетинга. Помогает понять поведение потребителей и эффективные стратегии продаж.',
            'Какие рекламные возможности у вас есть? (можно выбрать несколько) ': 'Размещение печатных материалов (флаеры, визитки, стенды, витрины и т.д.); Публикация рекламы в соцсетях, на сайте, в подкастах и т.д.; Организация совместных мероприятий (вебинары, выступления, конференции и т.д.); Промоакции (реферальная система, розыгрыши ,конкурсы и т.д.)',
            'Расскажите про свою аудиторию в соцсетях, если есть': 'Telegram - 200 подписчиков',
            'Поделитесь цифрами: сколько заказов/клиентов вы получаете ежемесячно?': 'Более 50',
            'Бартер': 'Размещение печатных материалов (флаеры, визитки, стенды, витрины и т.д.); Публикация рекламы в соцсетях, на сайте, в подкастах и т.д.; Организация совместных мероприятий (вебинары, выступления, конференции и т.д.); Промоакции (реферальная система, розыгрыши ,конкурсы и т.д.)',
            'Ваш Ник в Telegram для связи': '@dora_hahamir',
            'С кем вы хотели бы сотрудничать?': 'бизнес-школами, коучами, маркетологами',
            'Лого компании': 'аватарки/psycho-marketing.jpg'
        }
    ];
    
    filteredCompanies = [...companies];
    displayCompanies();
    updateResultsCount();
}

// Инициализация поиска
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', debounce(function() {
        applyFilters();
    }, 300));
}

// Инициализация фильтров
function initFilters() {
    // Добавляем обработчики для всех чекбоксов
    document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            applyFilters();
        });
    });
}

// Переключение дропдауна
function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) {
        console.error('Дропдаун не найден:', dropdownId);
        return;
    }
    
    // Находим кнопку фильтра (родительский элемент дропдауна)
    const filterButton = dropdown.parentElement.querySelector('.filter-dropdown-btn');
    if (!filterButton) {
        console.error('Кнопка фильтра не найдена для:', dropdownId);
        return;
    }
    
    // Ищем иконку по ID
    const filterIcon = document.getElementById(dropdownId + 'Icon');
    if (!filterIcon) {
        console.error('Иконка не найдена для:', dropdownId);
        return;
    }
    
    // Закрываем все другие дропдауны
    if (activeDropdown && activeDropdown !== dropdownId) {
        const otherDropdown = document.getElementById(activeDropdown);
        if (otherDropdown) {
            const otherButton = otherDropdown.parentElement.querySelector('.filter-dropdown-btn');
            if (otherButton) {
                const otherIcon = document.getElementById(activeDropdown + 'Icon');
                if (otherIcon) {
                    otherDropdown.classList.remove('show');
                    // Не меняем состояние кнопки - это делается в updateFilterCounter
                    // Поворачиваем стрелочку обратно если фильтр не активен
                    if (!otherIcon.classList.contains('reset-mode')) {
                        otherIcon.style.transform = 'rotate(0deg)';
                    }
                }
            }
        }
    }
    
    // Переключаем текущий дропдаун
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        // Поворачиваем стрелочку обратно если фильтр не активен
        if (!filterIcon.classList.contains('reset-mode')) {
            filterIcon.style.transform = 'rotate(0deg)';
        }
        activeDropdown = null;
    } else {
        dropdown.classList.add('show');
        // Поворачиваем стрелку если это не крестик
        if (!filterIcon.classList.contains('reset-mode')) {
            filterIcon.style.transform = 'rotate(180deg)';
        }
        activeDropdown = dropdownId;
    }
}

// Закрытие всех дропдаунов
function closeAllDropdowns() {
    document.querySelectorAll('.filter-dropdown-content').forEach(dropdown => {
        if (dropdown) {
            dropdown.classList.remove('show');
        }
    });
    document.querySelectorAll('.filter-dropdown-btn').forEach(button => {
        if (button) {
            const filterIcon = button.querySelector('.filter-toggle-icon');
            // Поворачиваем стрелочку обратно если фильтр не активен
            if (filterIcon && !filterIcon.classList.contains('reset-mode')) {
                filterIcon.style.transform = 'rotate(0deg)';
            }
        }
    });
    activeDropdown = null;
}

// Переключение "Выбрать все"
function toggleSelectAll(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    const selectAllCheckbox = dropdown.querySelector('input[type="checkbox"]');
    const checkboxes = dropdown.querySelectorAll('.filter-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
    
    updateFilterCounter(dropdownId);
    applyFilters();
}

// Функция для обновления текста фильтра
function updateFilterText(filterId, count, selectedValues = []) {
    const filterText = document.getElementById(filterId + 'Text');
    
    if (count > 0) {
        // Показываем количество в тексте фильтра
        filterText.innerHTML = `${getFilterDisplayName(filterId)} <span class="filter-count">(${count})</span>`;
        filterText.classList.add('has-selection');
        
        // Добавляем тултип с выбранными значениями
        if (selectedValues.length > 0) {
            const tooltipText = selectedValues.join(', ');
            filterText.title = tooltipText;
        }
    } else {
        // Возвращаем исходный текст
        filterText.textContent = getFilterDisplayName(filterId);
        filterText.classList.remove('has-selection');
        filterText.title = '';
    }
}

// Функция для получения отображаемого имени фильтра
function getFilterDisplayName(filterId) {
    const names = {
        'businessArea': 'Категория',
        'cooperation': 'Формат',
        'barter': 'Бартер'
    };
    return names[filterId] || filterId;
}

// Функция для получения названий выбранных значений
function getSelectedValueNames(filterId, selectedValues) {
    const valueNames = {
        'businessArea': {
            'beauty': 'Салоны красоты',
            'fitness': 'Фитнес и wellness',
            'psychology': 'Психология и коучинг',
            'education': 'Образование',
            'health': 'Здоровье',
            'esoteric': 'Эзотерика',
            'it': 'IT и цифровые услуги',
            'entertainment': 'Развлекательные услуги',
            'finance': 'Финансы',
            'household': 'Бытовые услуги',
            'retail': 'Розничная торговля',
            'real-estate': 'Недвижимость',
            'manufacturing': 'Промышленное производство',
            'agriculture': 'Сельское хозяйство',
            'livestock': 'Животноводство',
            'tourism': 'Туристический бизнес',
            'restaurant': 'Ресторанный бизнес',
            'auto': 'Автобизнес',
            'blogger': 'Блогер и артист'
        },
        'cooperation': {
            'barter': 'Бартер',
            'paid': 'Платное сотрудничество',
            'joint': 'Совместные акции',
            'events': 'Совместные мероприятия',
            'cross-promo': 'Кросс-промо'
        }
    };
    
    return selectedValues.map(value => valueNames[filterId][value] || value);
}

// Обновленная функция updateFilterCounter
function updateFilterCounter(filterId) {
    const dropdown = document.getElementById(filterId);
    const checkboxes = dropdown.querySelectorAll('.filter-checkbox:checked');
    const count = checkboxes.length;
    
    // Обновляем состояние фильтра
    filterState[filterId] = Array.from(checkboxes).map(cb => cb.value);
    
    // Обновляем текст фильтра
    const selectedValues = getSelectedValueNames(filterId, filterState[filterId]);
    updateFilterText(filterId, count, selectedValues);
    
    // Обновляем иконку и состояние кнопки
    const filterButton = document.querySelector(`#${filterId}`).parentElement.querySelector('.filter-dropdown-btn');
    const filterIcon = document.getElementById(filterId + 'Icon');
    
    if (count > 0) {
        filterButton.classList.add('active');
        if (filterIcon) {
            filterIcon.className = 'fas fa-times filter-toggle-icon reset-mode';
        }
    } else {
        filterButton.classList.remove('active');
        if (filterIcon) {
            filterIcon.className = 'fas fa-chevron-down filter-toggle-icon';
            filterIcon.classList.remove('reset-mode');
        }
    }
    
    // Показываем/скрываем кнопку "Сбросить все"
    updateResetAllButton();
    
    // Применяем фильтры автоматически
    applyFilters();
}

// Функция для переключения бартера
function toggleBarterFilter() {
    const barterText = document.getElementById('barterText');
    const barterIcon = document.getElementById('barterIcon');
    const barterButton = document.querySelector('.barter-filter');
    
    if (filterState.barter === null) {
        // Первый клик - устанавливаем "Да"
        filterState.barter = true;
        barterText.textContent = 'Бартер: Да';
        barterIcon.className = 'fas fa-check filter-icon';
        barterButton.classList.add('active');
    } else if (filterState.barter === true) {
        // Второй клик - устанавливаем "Нет"
        filterState.barter = false;
        barterText.textContent = 'Бартер: Нет';
        barterIcon.className = 'fas fa-times filter-icon';
        barterButton.classList.add('active');
    } else {
        // Третий клик - сбрасываем
        filterState.barter = null;
        barterText.textContent = 'Бартер';
        barterIcon.className = 'fas fa-plus filter-icon';
        barterButton.classList.remove('active');
    }
    
    // Показываем/скрываем кнопку "Сбросить все"
    updateResetAllButton();
    
    // Применяем фильтры автоматически
    applyFilters();
}

// Функция для обновления кнопки "Сбросить все"
function updateResetAllButton() {
    const resetAllBtn = document.getElementById('resetAllBtn');
    const hasActiveFilters = filterState.businessArea.length > 0 || 
                           filterState.cooperation.length > 0 || 
                           filterState.barter !== null;
    
    if (hasActiveFilters) {
        resetAllBtn.style.display = 'flex';
    } else {
        resetAllBtn.style.display = 'none';
    }
}

// Функция для сброса всех фильтров
function resetAllFilters() {
    // Сбрасываем все чекбоксы
    document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Сбрасываем состояние фильтров
    filterState = {
        businessArea: [],
        cooperation: [],
        barter: null
    };
    
    // Обновляем все счетчики
    updateFilterCounter('businessArea');
    updateFilterCounter('cooperation');
    
    // Сбрасываем бартер
    const barterText = document.getElementById('barterText');
    const barterIcon = document.getElementById('barterIcon');
    const barterButton = document.querySelector('.barter-filter');
    
    barterText.textContent = 'Бартер';
    barterIcon.className = 'fas fa-plus filter-icon';
    barterButton.classList.remove('active');
    
    // Скрываем кнопку "Сбросить все"
    updateResetAllButton();
    
    // Применяем фильтры
    applyFilters();
}

// Обновленная функция resetFilter
function resetFilter(filterId) {
    if (filterId === 'barter') {
        // Специальная логика для бартера
        filterState.barter = null;
        const barterText = document.getElementById('barterText');
        const barterIcon = document.getElementById('barterIcon');
        const barterButton = document.querySelector('.barter-filter');
        
        barterText.textContent = 'Бартер';
        barterIcon.className = 'fas fa-plus filter-icon';
        barterButton.classList.remove('active');
    } else {
        // Логика для обычных фильтров
        const dropdown = document.getElementById(filterId);
        const checkboxes = dropdown.querySelectorAll('.filter-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Сбрасываем "Выбрать все"
        const selectAll = dropdown.querySelector('input[type="checkbox"]');
        if (selectAll) {
            selectAll.checked = false;
        }
        
        filterState[filterId] = [];
    }
    
    // Обновляем счетчик и текст
    if (filterId !== 'barter') {
        updateFilterCounter(filterId);
    }
    
    // Показываем/скрываем кнопку "Сбросить все"
    updateResetAllButton();
    
    // Применяем фильтры
    applyFilters();
}

// Применение фильтров
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    filteredCompanies = companies.filter(company => {
        // Поиск по названию и описанию
        const matchesSearch = !searchTerm || 
            company['Название компании / Имя Эксперта'].toLowerCase().includes(searchTerm) ||
            company['Коротко о компании (2–3 предложения)'].toLowerCase().includes(searchTerm) ||
            (company['Направление деятельности'] || company['Направление бизнеса'] || '').toLowerCase().includes(searchTerm);
        
        // Фильтр по сфере деятельности
        const businessArea = company['Направление деятельности'] || company['Направление бизнеса'] || '';
        const matchesBusinessArea = filterState.businessArea.length === 0 || 
            filterState.businessArea.includes(getBusinessAreaValue(businessArea));
        
        // Фильтр по формату сотрудничества
        const matchesCooperation = filterState.cooperation.length === 0 || 
            filterState.cooperation.some(format => {
                switch(format) {
                    case 'barter': return company['Бартер'] && company['Бартер'].trim() !== '';
                    case 'paid': return !company['Бартер'] || company['Бартер'].trim() === '';
                    case 'joint': return company['Какие рекламные возможности у вас есть? (можно выбрать несколько) '].includes('мероприят');
                    case 'events': return company['Какие рекламные возможности у вас есть? (можно выбрать несколько) '].includes('мероприят');
                    case 'cross-promo': return company['Какие рекламные возможности у вас есть? (можно выбрать несколько) '].includes('соцсет');
                    default: return false;
                }
            });
        
        // Фильтр по бартеру (обновлено под новую структуру данных)
        const matchesBarter = filterState.barter === null || 
            (filterState.barter === true && company['Бартер'] && company['Бартер'].trim() !== '') ||
            (filterState.barter === false && (!company['Бартер'] || company['Бартер'].trim() === ''));
        
        return matchesSearch && matchesBusinessArea && matchesCooperation && matchesBarter;
    });
    
    displayCompanies();
    updateResultsCount();
}

// Получение значения сферы деятельности для фильтрации
function getBusinessAreaValue(businessArea) {
    const businessAreaMap = {
        'Салоны красоты': 'beauty',
        'Фитнес и wellness': 'fitness',
        'Психология и коучинг': 'psychology',
        'Образование': 'education',
        'Здоровье': 'health',
        'Эзотерика': 'esoteric',
        'IT и цифровые услуги': 'it',
        'Развлекательные услуги': 'entertainment',
        'Финансы': 'finance',
        'Бытовые услуги': 'household',
        'Розничная торговля': 'retail',
        'Недвижимость': 'real-estate',
        'Промышленное производство': 'manufacturing',
        'Сельское хозяйство': 'agriculture',
        'Животноводство': 'livestock',
        'Туристический бизнес': 'tourism',
        'Ресторанный бизнес': 'restaurant',
        'Автобизнес': 'auto',
        'Блогер и артист': 'blogger'
    };
    
    return businessAreaMap[businessArea] || businessArea.toLowerCase();
}

// Функция debounce для оптимизации поиска
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Обновление счетчика результатов
function updateResultsCount() {
    resultsCount.textContent = filteredCompanies.length;
}

// Функция для получения названия категории
function getCategoryName(categoryKey) {
    const categoryNames = {
        'beauty': 'Салоны красоты',
        'fitness': 'Фитнес и wellness',
        'psychology': 'Психология и коучинг',
        'education': 'Образование',
        'health': 'Здоровье',
        'esoteric': 'Эзотерика',
        'it': 'IT и цифровые услуги',
        'entertainment': 'Развлекательные услуги',
        'finance': 'Финансы',
        'household': 'Бытовые услуги',
        'retail': 'Розничная торговля',
        'real-estate': 'Недвижимость',
        'manufacturing': 'Промышленное производство',
        'agriculture': 'Сельское хозяйство',
        'livestock': 'Животноводство',
        'tourism': 'Туристический бизнес',
        'restaurant': 'Ресторанный бизнес',
        'auto': 'Автобизнес',
        'blogger': 'Блогер и артист'
    };
    return categoryNames[categoryKey] || categoryKey;
}

// Отображение компаний
function displayCompanies() {
    const companiesGrid = document.getElementById('companiesGrid');
    
    if (filteredCompanies.length === 0) {
        companiesGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>По вашему запросу ничего не найдено</p>
                <p>Попробуйте изменить параметры поиска или фильтры</p>
            </div>
        `;
        return;
    }
    
    companiesGrid.innerHTML = filteredCompanies.map(company => {
        // Рекламные возможности из нового поля
        const adOpportunities = [];
        // Проверяем разные варианты названия поля
        const adOpportunitiesText = company['Какие рекламные возможности у вас есть? (можно выбрать несколько) '] || 
                                   company['Какие рекламные возможности у вас есть? (можно выбрать несколько)'] ||
                                   '';
        
        if (adOpportunitiesText.includes('печатных материалов') || adOpportunitiesText.includes('Печатная') || adOpportunitiesText.includes('флаера')) {
            adOpportunities.push(`<div class="ad-opportunity"><i class="fas fa-print"></i> Печатная реклама</div>`);
        }
        if (adOpportunitiesText.includes('соцсетях') || adOpportunitiesText.includes('Посты') || adOpportunitiesText.includes('Digital') || adOpportunitiesText.includes('Соц.сети')) {
            adOpportunities.push(`<div class="ad-opportunity"><i class="fas fa-comment"></i> Посты в соцсетях</div>`);
        }
        if (adOpportunitiesText.includes('мероприятий') || adOpportunitiesText.includes('Совместные')) {
            adOpportunities.push(`<div class="ad-opportunity"><i class="fas fa-calendar-alt"></i> Совместные мероприятия</div>`);
        }
        if (adOpportunitiesText.includes('Промоакции')) {
            adOpportunities.push(`<div class="ad-opportunity"><i class="fas fa-gift"></i> Промоакции</div>`);
        }
        
        // Статус бартера из нового поля
        const barterField = company['Бартер'] || '';
        const hasBarterInfo = barterField && barterField.trim() !== '';
        const barterStatus = hasBarterInfo 
            ? '<span class="barter-status barter-yes"><i class="fas fa-check"></i> Бартер</span>' 
            : '<span class="barter-status barter-no"><i class="fas fa-times"></i> Бартер</span>';
        
        return `
            <div class="company-card">
                <div class="company-card-header">
                    <div class="company-info-left">
                        <h3 class="company-name">${company['Название компании / Имя Эксперта']}</h3>
                        <span class="company-category">${company['Направление деятельности'] || company['Направление бизнеса'] || 'Категория не указана'}</span>
                    </div>
                    
                    <img src="${company['Лого компании'] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iNDAiIGZpbGw9IiNGMUY1RjkiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOENBM0IiPgo8cGF0aCBkPSJNMTIgMTJjMi4yMSAwIDQtMS43OSA0LTRzLTEuNzktNC00LTQtNCAxLjc5LTQgNCAxLjc5IDQgNCA0em0wIDJjLTIuNjcgMC04IDEuMzQtOCA0djJoMTZ2LTJjMC0yLjY2LTUuMzMtNC04LTR6Ci8+Cjwvc3ZnPgo8L3N2Zz4K'}" 
                         alt="${company['Название компании / Имя Эксперта']}" 
                         class="company-avatar"
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iNDAiIGZpbGw9IiNGMUY1RjkiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOENBM0IiPgo8cGF0aCBkPSJNMTIgMTJjMi4yMSAwIDQtMS43OSA0LTRzLTEuNzktNC00LTQtNCAxLjc5LTQgNCAxLjc5IDQgNCA0em0wIDJjLTIuNjcgMC04IDEuMzQtOCA0djJoMTZ2LTJjMC0yLjY2LTUuMzMtNC04LTR6Ci8+Cjwvc3ZnPgo8L3N2Zz4K'">
                </div>
                
                <p class="company-description">${company['Коротко о компании (2–3 предложения)']}</p>
                
                ${adOpportunities.length > 0 ? `
                <div class="company-ad-opportunities">
                    <h4 class="collaboration-title">Возможности для коллабораций</h4>
                    ${adOpportunities.join('')}
                </div>` : `<div class="company-spacer"></div>`}
                
                <div class="company-bottom">
                    <div class="company-pills">
                        <span class="pill-metric">
                            <i class="fas fa-users"></i>
                            ${company['Расскажите про свою аудиторию в соцсетях, если есть'] || 'Аудитория не указана'}
                        </span>
                        <span class="pill-metric">
                            <i class="fas fa-user"></i>
                            Клиенты - ${company['Поделитесь цифрами: сколько заказов/клиентов вы получаете ежемесячно?'] || '0'}
                        </span>
                            ${barterStatus}
                        </div>
                        
                        <button class="company-contact" data-company-name="${company['Название компании / Имя Эксперта'].replace(/"/g, '&quot;')}">
                            <i class="fas fa-eye"></i>
                            Подробнее
                        </button>
                </div>
            </div>
        `;
    }).join('');

    // Добавляем обработчики событий для кнопок "Подробнее"
    document.querySelectorAll('.company-contact').forEach(button => {
        button.addEventListener('click', function() {
            const companyName = this.getAttribute('data-company-name').replace(/&quot;/g, '"');
            console.log('🔍 Кликнули на кнопку для компании:', companyName);
            openCompanyDetails(companyName);
        });
    });
}

// Открытие деталей компании
function openCompanyDetails(companyName) {
    console.log('🔍 Ищем компанию:', companyName);
    console.log('📋 Доступные компании:', companies.map(c => c['Название компании / Имя Эксперта']));
    
    const company = companies.find(c => c['Название компании / Имя Эксперта'] === companyName);
    if (!company) {
        console.error('❌ Компания не найдена:', companyName);
        alert('Компания не найдена: ' + companyName);
        return;
    }

    // Подготовка данных для отображения
    const companyTitle = company['Название компании / Имя Эксперта'] || 'Название не указано';
    const companyCategory = company['Направление деятельности'] || company['Направление бизнеса'] || 'Категория не указана';
    const shortDescription = company['Коротко о компании (2–3 предложения)'] || '';
    const fullDescription = company['Расскажите подробнее о своей компании/экспертизе'] || shortDescription;
    const companyLogo = company['Лого компании'] || '';
    
    console.log('✅ Открываем карточку:', companyTitle);
    console.log('📊 Данные компании:', company);
    
    // Возможности для коллабораций
    const collaborationField = company['Какие рекламные возможности у вас есть? (можно выбрать несколько) '] || 
                              company['Какие рекламные возможности у вас есть? (можно выбрать несколько)'] || '';
    
    const collaborationOpportunities = [];
    if (collaborationField) {
        // Разбиваем только по точкам с запятой, чтобы не ломать пункты с запятыми внутри
        const opportunities = collaborationField.split(';').map(item => item.trim()).filter(item => item);
        opportunities.forEach(opportunity => {
            let icon = 'fas fa-star';
            if (opportunity.toLowerCase().includes('соц') || opportunity.toLowerCase().includes('пост') || opportunity.toLowerCase().includes('digital')) {
                icon = 'fas fa-comment';
            } else if (opportunity.toLowerCase().includes('печат') || opportunity.toLowerCase().includes('флаер') || opportunity.toLowerCase().includes('визит') || opportunity.toLowerCase().includes('материал')) {
                icon = 'fas fa-print';
            } else if (opportunity.toLowerCase().includes('мероприят') || opportunity.toLowerCase().includes('событ') || opportunity.toLowerCase().includes('вебинар') || opportunity.toLowerCase().includes('конференц')) {
                icon = 'fas fa-calendar-alt';
            } else if (opportunity.toLowerCase().includes('промо') || opportunity.toLowerCase().includes('акц') || opportunity.toLowerCase().includes('розыгрыш') || opportunity.toLowerCase().includes('конкурс')) {
                icon = 'fas fa-gift';
            } else if (opportunity.toLowerCase().includes('цифр')) {
                icon = 'fas fa-laptop';
            }
            collaborationOpportunities.push({ icon, text: opportunity });
        });
    }
    
    // Аудитория и масштабы
    const socialAudience = company['Расскажите про свою аудиторию в соцсетях, если есть'] || '';
    const monthlyClients = company['Поделитесь цифрами: сколько заказов/клиентов вы получаете ежемесячно?'] || '';
    const barterAvailable = company['Бартер'] || '';
    const partnershipPreferences = company['С кем вы хотели бы сотрудничать?'] || '';
    
    const modalHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-header-content">
                    <h2 class="modal-company-name">${companyTitle}</h2>
                    <p class="modal-company-subtitle">${companyCategory}</p>
                </div>
                <div class="modal-company-logo">
                    ${companyLogo ? `<img src="${companyLogo}" alt="${companyTitle}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` : ''}
                    <div class="modal-logo-placeholder" ${companyLogo ? 'style="display: none;"' : ''}>
                        <i class="fas fa-building"></i>
                    </div>
                </div>
                <span class="close" onclick="closeModal()">&times;</span>
            </div>
            
            <div class="modal-body">
                ${fullDescription ? `
                    <div class="modal-section">
                        <h3>О компании</h3>
                        <p class="modal-description">${fullDescription}</p>
                    </div>
                ` : ''}
                
                ${collaborationOpportunities.length > 0 ? `
                    <div class="modal-section">
                        <h3>Возможности для коллабораций</h3>
                        <div class="modal-opportunities">
                            ${collaborationOpportunities.map(opp => `
                                <div class="modal-opportunity-item">
                                    <i class="${opp.icon}"></i>
                                    <span>${opp.text}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <div class="modal-section">
                    <h3>Аудитория и масштабы</h3>
                    <div class="modal-metrics">
                        ${socialAudience ? `
                            <div class="modal-metric-item">
                                <i class="fas fa-users"></i>
                                <span><strong>Подписчики:</strong> ${socialAudience}</span>
                            </div>
                        ` : ''}
                        ${monthlyClients ? `
                            <div class="modal-metric-item">
                                <i class="fas fa-user"></i>
                                <span><strong>Клиенты в месяц:</strong> ${monthlyClients}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                ${barterAvailable ? `
                    <div class="modal-section">
                        <h3>Бартерные возможности</h3>
                        <div class="modal-barter-opportunities">
                            ${barterAvailable.split(';').map(opportunity => `
                                <div class="modal-opportunity-item">
                                    <i class="fas fa-handshake"></i>
                                    <span>${opportunity.trim()}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${partnershipPreferences ? `
                    <div class="modal-section">
                        <h3>Пожелания для партнёрства</h3>
                        <div class="modal-preferences">
                            <div class="modal-preference-item">
                                <i class="fas fa-star"></i>
                                <span><strong>Хотим коллаборацию с:</strong><br>${partnershipPreferences}</span>
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                <div class="modal-actions">
                    <button class="modal-btn-primary" onclick="requestCollaboration('${companyTitle}')">
                        <i class="fas fa-handshake"></i>
                        Хочу коллаб
                    </button>
                    <button class="modal-btn-secondary" onclick="closeModal()">
                        <i class="fas fa-times"></i>
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('companyModal').innerHTML = modalHTML;
    document.getElementById('companyModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Закрытие модального окна
function closeModal() {
    document.getElementById('companyModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Обработчик клика по иконке фильтра
function handleFilterIconClick(event, filterId) {
    event.stopPropagation();
    
    const filterIcon = document.getElementById(filterId + 'Icon');
    
    if (filterIcon.classList.contains('reset-mode')) {
        // Если иконка в режиме сброса (крестик), сбрасываем фильтр
        resetFilter(filterId);
    } else {
        // Иначе открываем дропдаун
        toggleDropdown(filterId);
    }
}

// Запрос коллаборации
function requestCollaboration(companyName) {
    alert(`Отлично! Для коллаборации с "${companyName}" свяжитесь с ними через Telegram или социальные сети. Контакты указаны в карточке компании.`);
}

