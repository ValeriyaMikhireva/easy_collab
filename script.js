// Глобальные переменные
let companies = [];
let filteredCompanies = [];

// Функция для загрузки данных компаний
function loadCompanies() {
    console.log('Загружаем данные компаний...');
    
    // Проверяем протокол и хост для локальной разработки
    if (location.protocol === 'file:' || location.hostname === '127.0.0.1' || location.hostname === 'localhost') {
        console.log('Обнаружен file: протокол или localhost. Использую тестовые данные вместо fetch.');
        loadTestData();
        return;
    }
    
    fetch('kollab_data.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(csvText => {
            console.log('CSV данные загружены');
            companies = parseCSV(csvText);
            filteredCompanies = [...companies];
            displayCompanies();
            updateResultsCount();
        })
        .catch(error => {
            console.error('Ошибка загрузки данных:', error);
            console.log('Использую тестовые данные в качестве резерва');
            loadTestData();
        });
}

// Функция парсинга CSV
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
    const companies = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(value => value.trim().replace(/"/g, ''));
        const company = {};
        
        headers.forEach((header, index) => {
            company[header] = values[index] || '';
        });
        
        companies.push(company);
    }
    
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
            'Лого компании': 'lotos.jpg'
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
            'Лого компании': 'psycho-marketing.jpg'
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

// Debounce функция для оптимизации поиска
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

// Применение фильтров
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    filteredCompanies = companies.filter(company => {
        const matchesSearch = matchesSearchTerm(company, searchTerm);
        return matchesSearch;
    });
    
    displayCompanies();
    updateResultsCount();
}

// Проверка соответствия поисковому запросу
function matchesSearchTerm(company, searchTerm) {
    if (!searchTerm) return true;
    
    const fieldsToSearch = [
        'Название компании / Имя Эксперта',
        'Направление деятельности',
        'Коротко о компании (2–3 предложения)',
        'Расскажите подробнее о своей компании/экспертизе'
    ];
    
    return fieldsToSearch.some(field => 
        company[field]?.toLowerCase().includes(searchTerm)
    );
}

// Получение выбранного направления
function getSelectedDirection() {
    const activeDirectionBtn = document.querySelector('.direction-filter.active');
    return activeDirectionBtn ? activeDirectionBtn.dataset.direction : 'all';
}

// Получение выбранного бартерного фильтра
function getSelectedBarterFilter() {
    const activeBarterBtn = document.querySelector('.barter-filter.active');
    return activeBarterBtn ? activeBarterBtn.dataset.barter : 'all';
}

// Проверка соответствия бартерному фильтру
function checkBarterMatch(company, barterFilter) {
    const barterField = company['Бартер'];
    if (!barterField) return barterFilter === 'none';
    
    const barterText = barterField.toLowerCase();
    
    switch (barterFilter) {
        case 'printing':
            return barterText.includes('печатн') || barterText.includes('флаер') || barterText.includes('визит');
        case 'digital':
            return barterText.includes('digital') || barterText.includes('соцсет') || barterText.includes('сайт') || barterText.includes('публик');
        case 'events':
            return barterText.includes('мероприят') || barterText.includes('вебинар') || barterText.includes('конференц');
        case 'promo':
            return barterText.includes('промо') || barterText.includes('реферал') || barterText.includes('розыгр') || barterText.includes('конкурс');
        case 'none':
            return !barterText.trim();
        default:
            return true;
    }
}

// Отображение компаний
function displayCompanies() {
    const container = document.getElementById('companiesGrid');
    if (!container) {
        console.error('Контейнер companiesGrid не найден');
        return;
    }
    
    if (filteredCompanies.length === 0) {
        container.innerHTML = '<div class="no-results">Компании не найдены. Попробуйте изменить параметры поиска.</div>';
        return;
    }
    
    container.innerHTML = filteredCompanies.map(company => createCompanyCard(company)).join('');
}

// Создание карточки компании
function createCompanyCard(company) {
    const companyName = company['Название компании / Имя Эксперта'] || 'Без названия';
    const direction = company['Направление деятельности'] || 'Не указано';
    const shortDescription = company['Коротко о компании (2–3 предложения)'] || 'Описание отсутствует';
    const logo = company['Лого компании'] || 'default-logo.png';
    const barterOptions = company['Бартер'] || '';
    
    return `
        <div class="company-card" onclick="openCompanyModal('${companyName.replace(/'/g, "\\'")}')">
            <div class="company-logo">
                <img src="${logo}" alt="${companyName}" onerror="this.src='default-logo.png'">
            </div>
            <div class="company-info">
                <h3 class="company-name">${companyName}</h3>
                <div class="company-direction">${direction}</div>
                <p class="company-description">${shortDescription}</p>
                ${barterOptions ? `<div class="barter-pills">${createBarterPills(barterOptions)}</div>` : ''}
            </div>
        </div>
    `;
}

// Создание пиллов для бартера
function createBarterPills(barterText) {
    const pills = [];
    const text = barterText.toLowerCase();
    
    if (text.includes('печатн') || text.includes('флаер') || text.includes('визит')) {
        pills.push('<span class="barter-pill barter-printing">Печатная реклама</span>');
    }
    if (text.includes('digital') || text.includes('соцсет') || text.includes('сайт') || text.includes('публик')) {
        pills.push('<span class="barter-pill barter-digital">Digital реклама</span>');
    }
    if (text.includes('мероприят') || text.includes('вебинар') || text.includes('конференц')) {
        pills.push('<span class="barter-pill barter-events">Мероприятия</span>');
    }
    if (text.includes('промо') || text.includes('реферал') || text.includes('розыгр') || text.includes('конкурс')) {
        pills.push('<span class="barter-pill barter-promo">Промоакции</span>');
    }
    
    return pills.join('');
}

// Обновление счетчика результатов
function updateResultsCount() {
    const countElement = document.getElementById('resultsCount');
    if (countElement) {
        const count = filteredCompanies.length;
        countElement.textContent = count;
    }
}

// Склонение числительных
function getDeclension(number, titles) {
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[Math.min(number % 10, 5)]];
}

// Открытие модального окна компании
function openCompanyModal(companyName) {
    const company = companies.find(c => c['Название компании / Имя Эксперта'] === companyName);
    if (!company) return;
    
    const modal = document.getElementById('companyModal');
    if (!modal) return;
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            ${createModalContent(company)}
        </div>
    `;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Создание содержимого модального окна
function createModalContent(company) {
    const companyName = company['Название компании / Имя Эксперта'] || 'Без названия';
    const direction = company['Направление деятельности'] || 'Не указано';
    const fullDescription = company['Расскажите подробнее о своей компании/экспертизе'] || 'Подробное описание отсутствует';
    const logo = company['Лого компании'] || 'default-logo.png';
    const audience = company['Расскажите про свою аудиторию в соцсетях, если есть'] || 'Не указана';
    const clients = company['Поделитесь цифрами: сколько заказов/клиентов вы получаете ежемесячно?'] || 'Не указано';
    const telegram = company['Ваш Ник в Telegram для связи'] || '';
    const cooperation = company['С кем вы хотели бы сотрудничать?'] || 'Не указано';
    const advertising = company['Какие рекламные возможности у вас есть? (можно выбрать несколько) '] || 'Не указано';
    const barter = company['Бартер'] || '';
    
    return `
        <div class="modal-header">
            <div class="modal-logo">
                <img src="${logo}" alt="${companyName}" onerror="this.src='default-logo.png'">
            </div>
            <div class="modal-company-info">
                <h2>${companyName}</h2>
                <div class="modal-direction">${direction}</div>
            </div>
        </div>
        
        <div class="modal-body">
            <div class="modal-section">
                <h3>О компании</h3>
                <p>${fullDescription}</p>
            </div>
            
            <div class="modal-section">
                <h3>Аудитория</h3>
                <p>${audience}</p>
            </div>
            
            <div class="modal-section">
                <h3>Количество клиентов</h3>
                <p>${clients}</p>
            </div>
            
            <div class="modal-section">
                <h3>Рекламные возможности</h3>
                <p>${advertising}</p>
            </div>
            
            ${barter ? `
            <div class="modal-section">
                <h3>Бартерные возможности</h3>
                <p>${barter}</p>
            </div>
            ` : ''}
            
            <div class="modal-section">
                <h3>Желаемое сотрудничество</h3>
                <p>${cooperation}</p>
            </div>
            
            ${telegram ? `
            <div class="modal-section">
                <h3>Связь</h3>
                <p><a href="https://t.me/${telegram.replace('@', '')}" target="_blank" class="telegram-link">${telegram}</a></p>
            </div>
            ` : ''}
        </div>
    `;
}

// Закрытие модального окна
function closeModal() {
    const modal = document.getElementById('companyModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Инициализация фильтров направлений
function initDirectionFilters() {
    const filterButtons = document.querySelectorAll('.direction-filter');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            applyFilters();
        });
    });
}

// Инициализация бартерных фильтров
function initBarterFilters() {
    const filterButtons = document.querySelectorAll('.barter-filter');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            applyFilters();
        });
    });
}

// Инициализация мобильного меню
function initMobileMenu() {
    const burgerMenu = document.getElementById('burgerMenu');
    const mobileNav = document.getElementById('mobileNav');
    
    if (burgerMenu && mobileNav) {
        burgerMenu.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            burgerMenu.classList.toggle('active');
        });
        
        // Закрытие меню при клике на ссылку
        const mobileLinks = mobileNav.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileNav.classList.remove('active');
                burgerMenu.classList.remove('active');
            });
        });
    }
}

// Инициализация всех компонентов при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализация...');
    
    initMobileMenu();
    initSearch();
    // initDirectionFilters(); // Временно отключено
    // initBarterFilters(); // Временно отключено  
    loadCompanies();
    
    // Инициализация модального окна
    const modal = document.getElementById('companyModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Закрытие по Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    }
    
    console.log('Инициализация завершена');
});
