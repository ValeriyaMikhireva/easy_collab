// Р“Р»РѕР±Р°Р»СЊРЅС‹Рµ РїРµСЂРµРјРµРЅРЅС‹Рµ
let companies = [];
let filteredCompanies = [];
let activeDropdown = null;



// РџСЂРѕРІРµСЂРєР° Р·Р°РіСЂСѓР·РєРё JavaScript
console.log('рџљЂ JavaScript Р·Р°РіСЂСѓР¶РµРЅ! Р’РµСЂСЃРёСЏ 2.0');

// DOM СЌР»РµРјРµРЅС‚С‹
let searchInput;
let companiesGrid;
const resultsCount = document.getElementById('resultsCount');
const modal = document.getElementById('companyModal');

// РЎРѕСЃС‚РѕСЏРЅРёРµ С„РёР»СЊС‚СЂРѕРІ
let filterState = {
    businessArea: [],
    cooperation: [],
    barter: null // null, true, false
};

// РРЅРёС†РёР°Р»РёР·Р°С†РёСЏ РїСЂРё Р·Р°РіСЂСѓР·РєРµ СЃС‚СЂР°РЅРёС†С‹
document.addEventListener('DOMContentLoaded', function() {
    console.log('РЎРєСЂРёРїС‚ Р·Р°РіСЂСѓР¶РµРЅ, РІРµСЂСЃРёСЏ 2.0');
    
    // РРЅРёС†РёР°Р»РёР·Р°С†РёСЏ Р±СѓСЂРіРµСЂ-РјРµРЅСЋ
    initBurgerMenu();
    
    // Р—Р°РіСЂСѓР·РєР° РґР°РЅРЅС‹С… РєРѕРјРїР°РЅРёР№
    loadCompanies();
    
    // РРЅРёС†РёР°Р»РёР·Р°С†РёСЏ РїРѕРёСЃРєР°
    initSearch();
    
    // РРЅРёС†РёР°Р»РёР·Р°С†РёСЏ С„РёР»СЊС‚СЂРѕРІ
    initFilters();
    
    // Р“Р»РѕР±Р°Р»СЊРЅС‹Р№ РѕР±СЂР°Р±РѕС‚С‡РёРє РєР»РёРєРѕРІ РґР»СЏ Р·Р°РєСЂС‹С‚РёСЏ РґСЂРѕРїРґР°СѓРЅРѕРІ
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.dropdown-filter')) {
            closeAllDropdowns();
        }
    });
    
    // Р—Р°РєСЂС‹С‚РёРµ РјРѕРґР°Р»СЊРЅРѕРіРѕ РѕРєРЅР° РїРѕ РєР»РёРєСѓ РІРЅРµ РµРіРѕ
    const modal = document.getElementById('companyModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // Р—Р°РєСЂС‹С‚РёРµ РїРѕ Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});

// РРЅРёС†РёР°Р»РёР·Р°С†РёСЏ Р±СѓСЂРіРµСЂ-РјРµРЅСЋ
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
    
    // Р—Р°РєСЂС‹С‚РёРµ РїРѕ РєР»РёРєСѓ РІРЅРµ РјРµРЅСЋ
    mobileNav.addEventListener('click', function(event) {
        if (event.target === mobileNav) {
            burgerMenu.classList.remove('active');
            mobileNav.classList.remove('show');
            document.body.style.overflow = '';
        }
    });
}

// Р—Р°РіСЂСѓР·РєР° РґР°РЅРЅС‹С… РєРѕРјРїР°РЅРёР№
function loadCompanies() {
    console.log('Р—Р°РіСЂСѓР¶Р°РµРј РґР°РЅРЅС‹Рµ РєРѕРјРїР°РЅРёР№...');
    
    // Р•СЃР»Рё РѕС‚РєСЂС‹С‚ РЅР°РїСЂСЏРјСѓСЋ РєР°Рє С„Р°Р№Р» (Р±РµР· СЃРµСЂРІРµСЂР°), Р·Р°РіСЂСѓР¶Р°РµРј С‚РµСЃС‚РѕРІС‹Рµ РґР°РЅРЅС‹Рµ
    if (location.protocol === 'file:') {
        console.log('РћР±РЅР°СЂСѓР¶РµРЅ file: РїСЂРѕС‚РѕРєРѕР». РСЃРїРѕР»СЊР·СѓСЋ С‚РµСЃС‚РѕРІС‹Рµ РґР°РЅРЅС‹Рµ РІРјРµСЃС‚Рѕ fetch.');
        loadTestData();
        return;
    }
    
    // Р—Р°РіСЂСѓР¶Р°РµРј РґР°РЅРЅС‹Рµ РёР· CSV С„Р°Р№Р»Р°
    fetch('kollab_data.csv')
        .then(response => {
            console.log('РћС‚РІРµС‚ РѕС‚ СЃРµСЂРІРµСЂР°:', response.status, response.statusText);
            return response.text();
        })
        .then(data => {
            console.log('Р”Р°РЅРЅС‹Рµ РїРѕР»СѓС‡РµРЅС‹, РґР»РёРЅР°:', data.length);
            console.log('РџРµСЂРІС‹Рµ 200 СЃРёРјРІРѕР»РѕРІ:', data.substring(0, 200));
            
            companies = parseCSV(data);
            console.log('РљРѕРјРїР°РЅРёР№ СЂР°СЃРїР°СЂСЃРµРЅРѕ:', companies.length);
            console.log('РџРµСЂРІР°СЏ РєРѕРјРїР°РЅРёСЏ:', companies[0]);
            
            filteredCompanies = [...companies];
            displayCompanies();
            updateResultsCount();
        })
        .catch(error => {
            console.error('РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё РґР°РЅРЅС‹С…:', error);
            console.log('Р—Р°РіСЂСѓР¶Р°РµРј С‚РµСЃС‚РѕРІС‹Рµ РґР°РЅРЅС‹Рµ...');
            // Р—Р°РіСЂСѓР¶Р°РµРј С‚РµСЃС‚РѕРІС‹Рµ РґР°РЅРЅС‹Рµ
            loadTestData();
        });
}

// РџР°СЂСЃРёРЅРі CSV
function parseCSV(csv) {
    console.log('РџР°СЂСЃРёРј CSV...');
    const lines = csv.split('\n').filter(line => line.trim());
    console.log('РљРѕР»РёС‡РµСЃС‚РІРѕ СЃС‚СЂРѕРє:', lines.length);
    
    if (lines.length < 2) {
        console.error('CSV С„Р°Р№Р» СЃР»РёС€РєРѕРј РєРѕСЂРѕС‚РєРёР№');
        return [];
    }
    
    // РЈР»СѓС‡С€РµРЅРЅС‹Р№ РїР°СЂСЃРёРЅРі CSV СЃ СѓС‡РµС‚РѕРј РєР°РІС‹С‡РµРє
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
                    // Р”РІРѕР№РЅС‹Рµ РєР°РІС‹С‡РєРё РІРЅСѓС‚СЂРё СЃС‚СЂРѕРєРё
                    current += '"';
                    i += 2;
                    continue;
                } else {
                    // РќР°С‡Р°Р»Рѕ РёР»Рё РєРѕРЅРµС† РєР°РІС‹С‡РµРє
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                // Р Р°Р·РґРµР»РёС‚РµР»СЊ РІРЅРµ РєР°РІС‹С‡РµРє
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
    console.log('Р—Р°РіРѕР»РѕРІРєРё:', headers);
    
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
    
    console.log('РљРѕРјРїР°РЅРёР№ СЃРѕР·РґР°РЅРѕ:', companies.length);
    console.log('РџРµСЂРІР°СЏ РєРѕРјРїР°РЅРёСЏ:', companies[0]);
    return companies;
}

// Р—Р°РіСЂСѓР·РєР° С‚РµСЃС‚РѕРІС‹С… РґР°РЅРЅС‹С…
function loadTestData() {
    companies = [
        {
            'РќР°Р·РІР°РЅРёРµ РєРѕРјРїР°РЅРёРё / РРјСЏ Р­РєСЃРїРµСЂС‚Р°': 'Р›РѕС‚РѕСЃ',
            'РќР°РїСЂР°РІР»РµРЅРёРµ РґРµСЏС‚РµР»СЊРЅРѕСЃС‚Рё': 'Р¤РёС‚РЅРµСЃ Рё wellness',
            'РќР°РїСЂР°РІР»РµРЅРёРµ Р±РёР·РЅРµСЃР°': 'Р¤РёС‚РЅРµСЃ Рё wellness',
            'РљРѕСЂРѕС‚РєРѕ Рѕ РєРѕРјРїР°РЅРёРё (2вЂ“3 РїСЂРµРґР»РѕР¶РµРЅРёСЏ)': 'РњР°РіРЅРёС‚РЅРѕ-РІРѕР»РЅРѕРІРѕР№ РјР°СЃСЃР°Р¶',
            'Р Р°СЃСЃРєР°Р¶РёС‚Рµ РїРѕРґСЂРѕР±РЅРµРµ Рѕ СЃРІРѕРµР№ РєРѕРјРїР°РЅРёРё/СЌРєСЃРїРµСЂС‚РёР·Рµ': 'РџРѕР»РЅС‹Р№ СЃРїРµРєС‚СЂ СѓСЃР»СѓРі РґР»СЏ Р·РґРѕСЂРѕРІСЊСЏ Рё РєСЂР°СЃРѕС‚С‹. РџСЂРѕС„РµСЃСЃРёРѕРЅР°Р»СЊРЅС‹Рµ РјР°СЃСЃР°Р¶РёСЃС‚С‹ СЃ РјРЅРѕРіРѕР»РµС‚РЅРёРј РѕРїС‹С‚РѕРј СЂР°Р±РѕС‚С‹.',
            'РљР°РєРёРµ СЂРµРєР»Р°РјРЅС‹Рµ РІРѕР·РјРѕР¶РЅРѕСЃС‚Рё Сѓ РІР°СЃ РµСЃС‚СЊ? (РјРѕР¶РЅРѕ РІС‹Р±СЂР°С‚СЊ РЅРµСЃРєРѕР»СЊРєРѕ) ': 'Digital СЂРµРєР»Р°РјР° (РЎРѕС†.СЃРµС‚Рё, СЃР°Р№С‚ Рё С‚.Рґ.); РџРµС‡Р°С‚РЅР°СЏ СЂРµРєР»Р°РјР° (С„Р»Р°РµСЂР°, РІРёР·РёС‚РєРё Рё С‚.Рґ.)',
            'Р Р°СЃСЃРєР°Р¶РёС‚Рµ РїСЂРѕ СЃРІРѕСЋ Р°СѓРґРёС‚РѕСЂРёСЋ РІ СЃРѕС†СЃРµС‚СЏС…, РµСЃР»Рё РµСЃС‚СЊ': 'РђСѓРґРёС‚РѕСЂРёСЏ РЅРµ СѓРєР°Р·Р°РЅР°',
            'РџРѕРґРµР»РёС‚РµСЃСЊ С†РёС„СЂР°РјРё: СЃРєРѕР»СЊРєРѕ Р·Р°РєР°Р·РѕРІ/РєР»РёРµРЅС‚РѕРІ РІС‹ РїРѕР»СѓС‡Р°РµС‚Рµ РµР¶РµРјРµСЃСЏС‡РЅРѕ?': 'РљР»РёРµРЅС‚С‹ РЅРµ СѓРєР°Р·Р°РЅС‹',
            'Р‘Р°СЂС‚РµСЂ': '',
            'Р’Р°С€ РќРёРє РІ Telegram РґР»СЏ СЃРІСЏР·Рё': '',
            'РЎ РєРµРј РІС‹ С…РѕС‚РµР»Рё Р±С‹ СЃРѕС‚СЂСѓРґРЅРёС‡Р°С‚СЊ?': '',
            'Р›РѕРіРѕ РєРѕРјРїР°РЅРёРё': 'lotos.jpg'
        },
        {
            'РќР°Р·РІР°РЅРёРµ РєРѕРјРїР°РЅРёРё / РРјСЏ Р­РєСЃРїРµСЂС‚Р°': 'РРіСЂР° "РџСЃРёС…РѕРњР°СЂРєРµС‚РёРЅРі"',
            'РќР°РїСЂР°РІР»РµРЅРёРµ РґРµСЏС‚РµР»СЊРЅРѕСЃС‚Рё': 'РћР±СЂР°Р·РѕРІР°РЅРёРµ',
            'РќР°РїСЂР°РІР»РµРЅРёРµ Р±РёР·РЅРµСЃР°': 'РћР±СЂР°Р·РѕРІР°РЅРёРµ',
            'РљРѕСЂРѕС‚РєРѕ Рѕ РєРѕРјРїР°РЅРёРё (2вЂ“3 РїСЂРµРґР»РѕР¶РµРЅРёСЏ)': 'РРіСЂР° В«РџСЃРёС…РѕРњР°СЂРєРµС‚РёРЅРіВ» - РјР°СЂРєРµС‚РёРЅРіРѕРІР°СЏ РёРіСЂР° РЅРѕРІРѕРіРѕ РІСЂРµРјРµРЅРё! РќРµ РёРјРµСЋС‰Р°СЏ Р°РЅР°Р»РѕРіРѕРј РЅР° РјРёСЂРѕРІРѕРј СЂС‹РЅРєРµ.',
            'Р Р°СЃСЃРєР°Р¶РёС‚Рµ РїРѕРґСЂРѕР±РЅРµРµ Рѕ СЃРІРѕРµР№ РєРѕРјРїР°РЅРёРё/СЌРєСЃРїРµСЂС‚РёР·Рµ': 'РРЅРЅРѕРІР°С†РёРѕРЅРЅР°СЏ РЅР°СЃС‚РѕР»СЊРЅР°СЏ РёРіСЂР° РґР»СЏ РёР·СѓС‡РµРЅРёСЏ РїСЃРёС…РѕР»РѕРіРёРё РјР°СЂРєРµС‚РёРЅРіР°. РџРѕРјРѕРіР°РµС‚ РїРѕРЅСЏС‚СЊ РїРѕРІРµРґРµРЅРёРµ РїРѕС‚СЂРµР±РёС‚РµР»РµР№ Рё СЌС„С„РµРєС‚РёРІРЅС‹Рµ СЃС‚СЂР°С‚РµРіРёРё РїСЂРѕРґР°Р¶.',
            'РљР°РєРёРµ СЂРµРєР»Р°РјРЅС‹Рµ РІРѕР·РјРѕР¶РЅРѕСЃС‚Рё Сѓ РІР°СЃ РµСЃС‚СЊ? (РјРѕР¶РЅРѕ РІС‹Р±СЂР°С‚СЊ РЅРµСЃРєРѕР»СЊРєРѕ) ': 'Р Р°Р·РјРµС‰РµРЅРёРµ РїРµС‡Р°С‚РЅС‹С… РјР°С‚РµСЂРёР°Р»РѕРІ (С„Р»Р°РµСЂС‹, РІРёР·РёС‚РєРё, СЃС‚РµРЅРґС‹, РІРёС‚СЂРёРЅС‹ Рё С‚.Рґ.); РџСѓР±Р»РёРєР°С†РёСЏ СЂРµРєР»Р°РјС‹ РІ СЃРѕС†СЃРµС‚СЏС…, РЅР° СЃР°Р№С‚Рµ, РІ РїРѕРґРєР°СЃС‚Р°С… Рё С‚.Рґ.; РћСЂРіР°РЅРёР·Р°С†РёСЏ СЃРѕРІРјРµСЃС‚РЅС‹С… РјРµСЂРѕРїСЂРёСЏС‚РёР№ (РІРµР±РёРЅР°СЂС‹, РІС‹СЃС‚СѓРїР»РµРЅРёСЏ, РєРѕРЅС„РµСЂРµРЅС†РёРё Рё С‚.Рґ.); РџСЂРѕРјРѕР°РєС†РёРё (СЂРµС„РµСЂР°Р»СЊРЅР°СЏ СЃРёСЃС‚РµРјР°, СЂРѕР·С‹РіСЂС‹С€Рё ,РєРѕРЅРєСѓСЂСЃС‹ Рё С‚.Рґ.)',
            'Р Р°СЃСЃРєР°Р¶РёС‚Рµ РїСЂРѕ СЃРІРѕСЋ Р°СѓРґРёС‚РѕСЂРёСЋ РІ СЃРѕС†СЃРµС‚СЏС…, РµСЃР»Рё РµСЃС‚СЊ': 'Telegram - 200 РїРѕРґРїРёСЃС‡РёРєРѕРІ',
            'РџРѕРґРµР»РёС‚РµСЃСЊ С†РёС„СЂР°РјРё: СЃРєРѕР»СЊРєРѕ Р·Р°РєР°Р·РѕРІ/РєР»РёРµРЅС‚РѕРІ РІС‹ РїРѕР»СѓС‡Р°РµС‚Рµ РµР¶РµРјРµСЃСЏС‡РЅРѕ?': 'Р‘РѕР»РµРµ 50',
            'Р‘Р°СЂС‚РµСЂ': 'Р Р°Р·РјРµС‰РµРЅРёРµ РїРµС‡Р°С‚РЅС‹С… РјР°С‚РµСЂРёР°Р»РѕРІ (С„Р»Р°РµСЂС‹, РІРёР·РёС‚РєРё, СЃС‚РµРЅРґС‹, РІРёС‚СЂРёРЅС‹ Рё С‚.Рґ.); РџСѓР±Р»РёРєР°С†РёСЏ СЂРµРєР»Р°РјС‹ РІ СЃРѕС†СЃРµС‚СЏС…, РЅР° СЃР°Р№С‚Рµ, РІ РїРѕРґРєР°СЃС‚Р°С… Рё С‚.Рґ.; РћСЂРіР°РЅРёР·Р°С†РёСЏ СЃРѕРІРјРµСЃС‚РЅС‹С… РјРµСЂРѕРїСЂРёСЏС‚РёР№ (РІРµР±РёРЅР°СЂС‹, РІС‹СЃС‚СѓРїР»РµРЅРёСЏ, РєРѕРЅС„РµСЂРµРЅС†РёРё Рё С‚.Рґ.); РџСЂРѕРјРѕР°РєС†РёРё (СЂРµС„РµСЂР°Р»СЊРЅР°СЏ СЃРёСЃС‚РµРјР°, СЂРѕР·С‹РіСЂС‹С€Рё ,РєРѕРЅРєСѓСЂСЃС‹ Рё С‚.Рґ.)',
            'Р’Р°С€ РќРёРє РІ Telegram РґР»СЏ СЃРІСЏР·Рё': '@dora_hahamir',
            'РЎ РєРµРј РІС‹ С…РѕС‚РµР»Рё Р±С‹ СЃРѕС‚СЂСѓРґРЅРёС‡Р°С‚СЊ?': 'Р±РёР·РЅРµСЃ-С€РєРѕР»Р°РјРё, РєРѕСѓС‡Р°РјРё, РјР°СЂРєРµС‚РѕР»РѕРіР°РјРё',
            'Р›РѕРіРѕ РєРѕРјРїР°РЅРёРё': 'psycho-marketing.jpg'
        }
    ];
    
    filteredCompanies = [...companies];
    displayCompanies();
    updateResultsCount();
}

// РРЅРёС†РёР°Р»РёР·Р°С†РёСЏ РїРѕРёСЃРєР°
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', debounce(function() {
        applyFilters();
    }, 300));
}

// РРЅРёС†РёР°Р»РёР·Р°С†РёСЏ С„РёР»СЊС‚СЂРѕРІ
function initFilters() {
    // Р”РѕР±Р°РІР»СЏРµРј РѕР±СЂР°Р±РѕС‚С‡РёРєРё РґР»СЏ РІСЃРµС… С‡РµРєР±РѕРєСЃРѕРІ
    document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            applyFilters();
        });
    });
}

// РџРµСЂРµРєР»СЋС‡РµРЅРёРµ РґСЂРѕРїРґР°СѓРЅР°
function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) {
        console.error('Р”СЂРѕРїРґР°СѓРЅ РЅРµ РЅР°Р№РґРµРЅ:', dropdownId);
        return;
    }
    
    // РќР°С…РѕРґРёРј РєРЅРѕРїРєСѓ С„РёР»СЊС‚СЂР° (СЂРѕРґРёС‚РµР»СЊСЃРєРёР№ СЌР»РµРјРµРЅС‚ РґСЂРѕРїРґР°СѓРЅР°)
    const filterButton = dropdown.parentElement.querySelector('.filter-dropdown-btn');
    if (!filterButton) {
        console.error('РљРЅРѕРїРєР° С„РёР»СЊС‚СЂР° РЅРµ РЅР°Р№РґРµРЅР° РґР»СЏ:', dropdownId);
        return;
    }
    
    // РС‰РµРј РёРєРѕРЅРєСѓ РїРѕ ID
    const filterIcon = document.getElementById(dropdownId + 'Icon');
    if (!filterIcon) {
        console.error('РРєРѕРЅРєР° РЅРµ РЅР°Р№РґРµРЅР° РґР»СЏ:', dropdownId);
        return;
    }
    
    // Р—Р°РєСЂС‹РІР°РµРј РІСЃРµ РґСЂСѓРіРёРµ РґСЂРѕРїРґР°СѓРЅС‹
    if (activeDropdown && activeDropdown !== dropdownId) {
        const otherDropdown = document.getElementById(activeDropdown);
        if (otherDropdown) {
            const otherButton = otherDropdown.parentElement.querySelector('.filter-dropdown-btn');
            if (otherButton) {
                const otherIcon = document.getElementById(activeDropdown + 'Icon');
                if (otherIcon) {
                    otherDropdown.classList.remove('show');
                    // РќРµ РјРµРЅСЏРµРј СЃРѕСЃС‚РѕСЏРЅРёРµ РєРЅРѕРїРєРё - СЌС‚Рѕ РґРµР»Р°РµС‚СЃСЏ РІ updateFilterCounter
                    // РџРѕРІРѕСЂР°С‡РёРІР°РµРј СЃС‚СЂРµР»РѕС‡РєСѓ РѕР±СЂР°С‚РЅРѕ РµСЃР»Рё С„РёР»СЊС‚СЂ РЅРµ Р°РєС‚РёРІРµРЅ
                    if (!otherIcon.classList.contains('reset-mode')) {
                        otherIcon.style.transform = 'rotate(0deg)';
                    }
                }
            }
        }
    }
    
    // РџРµСЂРµРєР»СЋС‡Р°РµРј С‚РµРєСѓС‰РёР№ РґСЂРѕРїРґР°СѓРЅ
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        // РџРѕРІРѕСЂР°С‡РёРІР°РµРј СЃС‚СЂРµР»РѕС‡РєСѓ РѕР±СЂР°С‚РЅРѕ РµСЃР»Рё С„РёР»СЊС‚СЂ РЅРµ Р°РєС‚РёРІРµРЅ
        if (!filterIcon.classList.contains('reset-mode')) {
            filterIcon.style.transform = 'rotate(0deg)';
        }
        activeDropdown = null;
    } else {
        dropdown.classList.add('show');
        // РџРѕРІРѕСЂР°С‡РёРІР°РµРј СЃС‚СЂРµР»РєСѓ РµСЃР»Рё СЌС‚Рѕ РЅРµ РєСЂРµСЃС‚РёРє
        if (!filterIcon.classList.contains('reset-mode')) {
            filterIcon.style.transform = 'rotate(180deg)';
        }
        activeDropdown = dropdownId;
    }
}

// Р—Р°РєСЂС‹С‚РёРµ РІСЃРµС… РґСЂРѕРїРґР°СѓРЅРѕРІ
function closeAllDropdowns() {
    document.querySelectorAll('.filter-dropdown-content').forEach(dropdown => {
        if (dropdown) {
            dropdown.classList.remove('show');
        }
    });
    document.querySelectorAll('.filter-dropdown-btn').forEach(button => {
        if (button) {
            const filterIcon = button.querySelector('.filter-toggle-icon');
            // РџРѕРІРѕСЂР°С‡РёРІР°РµРј СЃС‚СЂРµР»РѕС‡РєСѓ РѕР±СЂР°С‚РЅРѕ РµСЃР»Рё С„РёР»СЊС‚СЂ РЅРµ Р°РєС‚РёРІРµРЅ
            if (filterIcon && !filterIcon.classList.contains('reset-mode')) {
                filterIcon.style.transform = 'rotate(0deg)';
            }
        }
    });
    activeDropdown = null;
}

// РџРµСЂРµРєР»СЋС‡РµРЅРёРµ "Р’С‹Р±СЂР°С‚СЊ РІСЃРµ"
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

// Р¤СѓРЅРєС†РёСЏ РґР»СЏ РѕР±РЅРѕРІР»РµРЅРёСЏ С‚РµРєСЃС‚Р° С„РёР»СЊС‚СЂР°
function updateFilterText(filterId, count, selectedValues = []) {
    const filterText = document.getElementById(filterId + 'Text');
    
    if (count > 0) {
        // РџРѕРєР°Р·С‹РІР°РµРј РєРѕР»РёС‡РµСЃС‚РІРѕ РІ С‚РµРєСЃС‚Рµ С„РёР»СЊС‚СЂР°
        filterText.innerHTML = `${getFilterDisplayName(filterId)} <span class="filter-count">(${count})</span>`;
        filterText.classList.add('has-selection');
        
        // Р”РѕР±Р°РІР»СЏРµРј С‚СѓР»С‚РёРї СЃ РІС‹Р±СЂР°РЅРЅС‹РјРё Р·РЅР°С‡РµРЅРёСЏРјРё
        if (selectedValues.length > 0) {
            const tooltipText = selectedValues.join(', ');
            filterText.title = tooltipText;
        }
    } else {
        // Р’РѕР·РІСЂР°С‰Р°РµРј РёСЃС…РѕРґРЅС‹Р№ С‚РµРєСЃС‚
        filterText.textContent = getFilterDisplayName(filterId);
        filterText.classList.remove('has-selection');
        filterText.title = '';
    }
}

// Р¤СѓРЅРєС†РёСЏ РґР»СЏ РїРѕР»СѓС‡РµРЅРёСЏ РѕС‚РѕР±СЂР°Р¶Р°РµРјРѕРіРѕ РёРјРµРЅРё С„РёР»СЊС‚СЂР°
function getFilterDisplayName(filterId) {
    const names = {
        'businessArea': 'РљР°С‚РµРіРѕСЂРёСЏ',
        'cooperation': 'Р¤РѕСЂРјР°С‚',
        'barter': 'Р‘Р°СЂС‚РµСЂ'
    };
    return names[filterId] || filterId;
}

// Р¤СѓРЅРєС†РёСЏ РґР»СЏ РїРѕР»СѓС‡РµРЅРёСЏ РЅР°Р·РІР°РЅРёР№ РІС‹Р±СЂР°РЅРЅС‹С… Р·РЅР°С‡РµРЅРёР№
function getSelectedValueNames(filterId, selectedValues) {
    const valueNames = {
        'businessArea': {
            'beauty': 'РЎР°Р»РѕРЅС‹ РєСЂР°СЃРѕС‚С‹',
            'fitness': 'Р¤РёС‚РЅРµСЃ Рё wellness',
            'psychology': 'РџСЃРёС…РѕР»РѕРіРёСЏ Рё РєРѕСѓС‡РёРЅРі',
            'education': 'РћР±СЂР°Р·РѕРІР°РЅРёРµ',
            'health': 'Р—РґРѕСЂРѕРІСЊРµ',
            'esoteric': 'Р­Р·РѕС‚РµСЂРёРєР°',
            'it': 'IT Рё С†РёС„СЂРѕРІС‹Рµ СѓСЃР»СѓРіРё',
            'entertainment': 'Р Р°Р·РІР»РµРєР°С‚РµР»СЊРЅС‹Рµ СѓСЃР»СѓРіРё',
            'finance': 'Р¤РёРЅР°РЅСЃС‹',
            'household': 'Р‘С‹С‚РѕРІС‹Рµ СѓСЃР»СѓРіРё',
            'retail': 'Р РѕР·РЅРёС‡РЅР°СЏ С‚РѕСЂРіРѕРІР»СЏ',
            'real-estate': 'РќРµРґРІРёР¶РёРјРѕСЃС‚СЊ',
            'manufacturing': 'РџСЂРѕРјС‹С€Р»РµРЅРЅРѕРµ РїСЂРѕРёР·РІРѕРґСЃС‚РІРѕ',
            'agriculture': 'РЎРµР»СЊСЃРєРѕРµ С…РѕР·СЏР№СЃС‚РІРѕ',
            'livestock': 'Р–РёРІРѕС‚РЅРѕРІРѕРґСЃС‚РІРѕ',
            'tourism': 'РўСѓСЂРёСЃС‚РёС‡РµСЃРєРёР№ Р±РёР·РЅРµСЃ',
            'restaurant': 'Р РµСЃС‚РѕСЂР°РЅРЅС‹Р№ Р±РёР·РЅРµСЃ',
            'auto': 'РђРІС‚РѕР±РёР·РЅРµСЃ',
            'blogger': 'Р‘Р»РѕРіРµСЂ Рё Р°СЂС‚РёСЃС‚'
        },
        'cooperation': {
            'barter': 'Р‘Р°СЂС‚РµСЂ',
            'paid': 'РџР»Р°С‚РЅРѕРµ СЃРѕС‚СЂСѓРґРЅРёС‡РµСЃС‚РІРѕ',
            'joint': 'РЎРѕРІРјРµСЃС‚РЅС‹Рµ Р°РєС†РёРё',
            'events': 'РЎРѕРІРјРµСЃС‚РЅС‹Рµ РјРµСЂРѕРїСЂРёСЏС‚РёСЏ',
            'cross-promo': 'РљСЂРѕСЃСЃ-РїСЂРѕРјРѕ'
        }
    };
    
    return selectedValues.map(value => valueNames[filterId][value] || value);
}

// РћР±РЅРѕРІР»РµРЅРЅР°СЏ С„СѓРЅРєС†РёСЏ updateFilterCounter
function updateFilterCounter(filterId) {
    const dropdown = document.getElementById(filterId);
    const checkboxes = dropdown.querySelectorAll('.filter-checkbox:checked');
    const count = checkboxes.length;
    
    // РћР±РЅРѕРІР»СЏРµРј СЃРѕСЃС‚РѕСЏРЅРёРµ С„РёР»СЊС‚СЂР°
    filterState[filterId] = Array.from(checkboxes).map(cb => cb.value);
    
    // РћР±РЅРѕРІР»СЏРµРј С‚РµРєСЃС‚ С„РёР»СЊС‚СЂР°
    const selectedValues = getSelectedValueNames(filterId, filterState[filterId]);
    updateFilterText(filterId, count, selectedValues);
    
    // РћР±РЅРѕРІР»СЏРµРј РёРєРѕРЅРєСѓ Рё СЃРѕСЃС‚РѕСЏРЅРёРµ РєРЅРѕРїРєРё
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
    
    // РџРѕРєР°Р·С‹РІР°РµРј/СЃРєСЂС‹РІР°РµРј РєРЅРѕРїРєСѓ "РЎР±СЂРѕСЃРёС‚СЊ РІСЃРµ"
    updateResetAllButton();
    
    // РџСЂРёРјРµРЅСЏРµРј С„РёР»СЊС‚СЂС‹ Р°РІС‚РѕРјР°С‚РёС‡РµСЃРєРё
    applyFilters();
}

// Р¤СѓРЅРєС†РёСЏ РґР»СЏ РїРµСЂРµРєР»СЋС‡РµРЅРёСЏ Р±Р°СЂС‚РµСЂР°
function toggleBarterFilter() {
    const barterText = document.getElementById('barterText');
    const barterIcon = document.getElementById('barterIcon');
    const barterButton = document.querySelector('.barter-filter');
    
    if (filterState.barter === null) {
        // РџРµСЂРІС‹Р№ РєР»РёРє - СѓСЃС‚Р°РЅР°РІР»РёРІР°РµРј "Р”Р°"
        filterState.barter = true;
        barterText.textContent = 'Р‘Р°СЂС‚РµСЂ: Р”Р°';
        barterIcon.className = 'fas fa-check filter-icon';
        barterButton.classList.add('active');
    } else if (filterState.barter === true) {
        // Р’С‚РѕСЂРѕР№ РєР»РёРє - СѓСЃС‚Р°РЅР°РІР»РёРІР°РµРј "РќРµС‚"
        filterState.barter = false;
        barterText.textContent = 'Р‘Р°СЂС‚РµСЂ: РќРµС‚';
        barterIcon.className = 'fas fa-times filter-icon';
        barterButton.classList.add('active');
    } else {
        // РўСЂРµС‚РёР№ РєР»РёРє - СЃР±СЂР°СЃС‹РІР°РµРј
        filterState.barter = null;
        barterText.textContent = 'Р‘Р°СЂС‚РµСЂ';
        barterIcon.className = 'fas fa-plus filter-icon';
        barterButton.classList.remove('active');
    }
    
    // РџРѕРєР°Р·С‹РІР°РµРј/СЃРєСЂС‹РІР°РµРј РєРЅРѕРїРєСѓ "РЎР±СЂРѕСЃРёС‚СЊ РІСЃРµ"
    updateResetAllButton();
    
    // РџСЂРёРјРµРЅСЏРµРј С„РёР»СЊС‚СЂС‹ Р°РІС‚РѕРјР°С‚РёС‡РµСЃРєРё
    applyFilters();
}

// Р¤СѓРЅРєС†РёСЏ РґР»СЏ РѕР±РЅРѕРІР»РµРЅРёСЏ РєРЅРѕРїРєРё "РЎР±СЂРѕСЃРёС‚СЊ РІСЃРµ"
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

// Р¤СѓРЅРєС†РёСЏ РґР»СЏ СЃР±СЂРѕСЃР° РІСЃРµС… С„РёР»СЊС‚СЂРѕРІ
function resetAllFilters() {
    // РЎР±СЂР°СЃС‹РІР°РµРј РІСЃРµ С‡РµРєР±РѕРєСЃС‹
    document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // РЎР±СЂР°СЃС‹РІР°РµРј СЃРѕСЃС‚РѕСЏРЅРёРµ С„РёР»СЊС‚СЂРѕРІ
    filterState = {
        businessArea: [],
        cooperation: [],
        barter: null
    };
    
    // РћР±РЅРѕРІР»СЏРµРј РІСЃРµ СЃС‡РµС‚С‡РёРєРё
    updateFilterCounter('businessArea');
    updateFilterCounter('cooperation');
    
    // РЎР±СЂР°СЃС‹РІР°РµРј Р±Р°СЂС‚РµСЂ
    const barterText = document.getElementById('barterText');
    const barterIcon = document.getElementById('barterIcon');
    const barterButton = document.querySelector('.barter-filter');
    
    barterText.textContent = 'Р‘Р°СЂС‚РµСЂ';
    barterIcon.className = 'fas fa-plus filter-icon';
    barterButton.classList.remove('active');
    
    // РЎРєСЂС‹РІР°РµРј РєРЅРѕРїРєСѓ "РЎР±СЂРѕСЃРёС‚СЊ РІСЃРµ"
    updateResetAllButton();
    
    // РџСЂРёРјРµРЅСЏРµРј С„РёР»СЊС‚СЂС‹
    applyFilters();
}

// РћР±РЅРѕРІР»РµРЅРЅР°СЏ С„СѓРЅРєС†РёСЏ resetFilter
function resetFilter(filterId) {
    if (filterId === 'barter') {
        // РЎРїРµС†РёР°Р»СЊРЅР°СЏ Р»РѕРіРёРєР° РґР»СЏ Р±Р°СЂС‚РµСЂР°
        filterState.barter = null;
        const barterText = document.getElementById('barterText');
        const barterIcon = document.getElementById('barterIcon');
        const barterButton = document.querySelector('.barter-filter');
        
        barterText.textContent = 'Р‘Р°СЂС‚РµСЂ';
        barterIcon.className = 'fas fa-plus filter-icon';
        barterButton.classList.remove('active');
    } else {
        // Р›РѕРіРёРєР° РґР»СЏ РѕР±С‹С‡РЅС‹С… С„РёР»СЊС‚СЂРѕРІ
        const dropdown = document.getElementById(filterId);
        const checkboxes = dropdown.querySelectorAll('.filter-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // РЎР±СЂР°СЃС‹РІР°РµРј "Р’С‹Р±СЂР°С‚СЊ РІСЃРµ"
        const selectAll = dropdown.querySelector('input[type="checkbox"]');
        if (selectAll) {
            selectAll.checked = false;
        }
        
        filterState[filterId] = [];
    }
    
    // РћР±РЅРѕРІР»СЏРµРј СЃС‡РµС‚С‡РёРє Рё С‚РµРєСЃС‚
    if (filterId !== 'barter') {
        updateFilterCounter(filterId);
    }
    
    // РџРѕРєР°Р·С‹РІР°РµРј/СЃРєСЂС‹РІР°РµРј РєРЅРѕРїРєСѓ "РЎР±СЂРѕСЃРёС‚СЊ РІСЃРµ"
    updateResetAllButton();
    
    // РџСЂРёРјРµРЅСЏРµРј С„РёР»СЊС‚СЂС‹
    applyFilters();
}

// РџСЂРёРјРµРЅРµРЅРёРµ С„РёР»СЊС‚СЂРѕРІ
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    filteredCompanies = companies.filter(company => {
        // РџРѕРёСЃРє РїРѕ РЅР°Р·РІР°РЅРёСЋ Рё РѕРїРёСЃР°РЅРёСЋ
        const matchesSearch = !searchTerm || 
            company['РќР°Р·РІР°РЅРёРµ РєРѕРјРїР°РЅРёРё / РРјСЏ Р­РєСЃРїРµСЂС‚Р°'].toLowerCase().includes(searchTerm) ||
            company['РљРѕСЂРѕС‚РєРѕ Рѕ РєРѕРјРїР°РЅРёРё (2вЂ“3 РїСЂРµРґР»РѕР¶РµРЅРёСЏ)'].toLowerCase().includes(searchTerm) ||
            (company['РќР°РїСЂР°РІР»РµРЅРёРµ РґРµСЏС‚РµР»СЊРЅРѕСЃС‚Рё'] || company['РќР°РїСЂР°РІР»РµРЅРёРµ Р±РёР·РЅРµСЃР°'] || '').toLowerCase().includes(searchTerm);
        
        // Р¤РёР»СЊС‚СЂ РїРѕ СЃС„РµСЂРµ РґРµСЏС‚РµР»СЊРЅРѕСЃС‚Рё
        const businessArea = company['РќР°РїСЂР°РІР»РµРЅРёРµ РґРµСЏС‚РµР»СЊРЅРѕСЃС‚Рё'] || company['РќР°РїСЂР°РІР»РµРЅРёРµ Р±РёР·РЅРµСЃР°'] || '';
        const matchesBusinessArea = filterState.businessArea.length === 0 || 
            filterState.businessArea.includes(getBusinessAreaValue(businessArea));
        
        // Р¤РёР»СЊС‚СЂ РїРѕ С„РѕСЂРјР°С‚Сѓ СЃРѕС‚СЂСѓРґРЅРёС‡РµСЃС‚РІР°
        const matchesCooperation = filterState.cooperation.length === 0 || 
            filterState.cooperation.some(format => {
                switch(format) {
                    case 'barter': return company['Р‘Р°СЂС‚РµСЂ'] && company['Р‘Р°СЂС‚РµСЂ'].trim() !== '';
                    case 'paid': return !company['Р‘Р°СЂС‚РµСЂ'] || company['Р‘Р°СЂС‚РµСЂ'].trim() === '';
                    case 'joint': return company['РљР°РєРёРµ СЂРµРєР»Р°РјРЅС‹Рµ РІРѕР·РјРѕР¶РЅРѕСЃС‚Рё Сѓ РІР°СЃ РµСЃС‚СЊ? (РјРѕР¶РЅРѕ РІС‹Р±СЂР°С‚СЊ РЅРµСЃРєРѕР»СЊРєРѕ) '].includes('РјРµСЂРѕРїСЂРёСЏС‚');
                    case 'events': return company['РљР°РєРёРµ СЂРµРєР»Р°РјРЅС‹Рµ РІРѕР·РјРѕР¶РЅРѕСЃС‚Рё Сѓ РІР°СЃ РµСЃС‚СЊ? (РјРѕР¶РЅРѕ РІС‹Р±СЂР°С‚СЊ РЅРµСЃРєРѕР»СЊРєРѕ) '].includes('РјРµСЂРѕРїСЂРёСЏС‚');
                    case 'cross-promo': return company['РљР°РєРёРµ СЂРµРєР»Р°РјРЅС‹Рµ РІРѕР·РјРѕР¶РЅРѕСЃС‚Рё Сѓ РІР°СЃ РµСЃС‚СЊ? (РјРѕР¶РЅРѕ РІС‹Р±СЂР°С‚СЊ РЅРµСЃРєРѕР»СЊРєРѕ) '].includes('СЃРѕС†СЃРµС‚');
                    default: return false;
                }
            });
        
        // Р¤РёР»СЊС‚СЂ РїРѕ Р±Р°СЂС‚РµСЂСѓ (РѕР±РЅРѕРІР»РµРЅРѕ РїРѕРґ РЅРѕРІСѓСЋ СЃС‚СЂСѓРєС‚СѓСЂСѓ РґР°РЅРЅС‹С…)
        const matchesBarter = filterState.barter === null || 
            (filterState.barter === true && company['Р‘Р°СЂС‚РµСЂ'] && company['Р‘Р°СЂС‚РµСЂ'].trim() !== '') ||
            (filterState.barter === false && (!company['Р‘Р°СЂС‚РµСЂ'] || company['Р‘Р°СЂС‚РµСЂ'].trim() === ''));
        
        return matchesSearch && matchesBusinessArea && matchesCooperation && matchesBarter;
    });
    
    displayCompanies();
    updateResultsCount();
}

// РџРѕР»СѓС‡РµРЅРёРµ Р·РЅР°С‡РµРЅРёСЏ СЃС„РµСЂС‹ РґРµСЏС‚РµР»СЊРЅРѕСЃС‚Рё РґР»СЏ С„РёР»СЊС‚СЂР°С†РёРё
function getBusinessAreaValue(businessArea) {
    const businessAreaMap = {
        'РЎР°Р»РѕРЅС‹ РєСЂР°СЃРѕС‚С‹': 'beauty',
        'Р¤РёС‚РЅРµСЃ Рё wellness': 'fitness',
        'РџСЃРёС…РѕР»РѕРіРёСЏ Рё РєРѕСѓС‡РёРЅРі': 'psychology',
        'РћР±СЂР°Р·РѕРІР°РЅРёРµ': 'education',
        'Р—РґРѕСЂРѕРІСЊРµ': 'health',
        'Р­Р·РѕС‚РµСЂРёРєР°': 'esoteric',
        'IT Рё С†РёС„СЂРѕРІС‹Рµ СѓСЃР»СѓРіРё': 'it',
        'Р Р°Р·РІР»РµРєР°С‚РµР»СЊРЅС‹Рµ СѓСЃР»СѓРіРё': 'entertainment',
        'Р¤РёРЅР°РЅСЃС‹': 'finance',
        'Р‘С‹С‚РѕРІС‹Рµ СѓСЃР»СѓРіРё': 'household',
        'Р РѕР·РЅРёС‡РЅР°СЏ С‚РѕСЂРіРѕРІР»СЏ': 'retail',
        'РќРµРґРІРёР¶РёРјРѕСЃС‚СЊ': 'real-estate',
        'РџСЂРѕРјС‹С€Р»РµРЅРЅРѕРµ РїСЂРѕРёР·РІРѕРґСЃС‚РІРѕ': 'manufacturing',
        'РЎРµР»СЊСЃРєРѕРµ С…РѕР·СЏР№СЃС‚РІРѕ': 'agriculture',
        'Р–РёРІРѕС‚РЅРѕРІРѕРґСЃС‚РІРѕ': 'livestock',
        'РўСѓСЂРёСЃС‚РёС‡РµСЃРєРёР№ Р±РёР·РЅРµСЃ': 'tourism',
        'Р РµСЃС‚РѕСЂР°РЅРЅС‹Р№ Р±РёР·РЅРµСЃ': 'restaurant',
        'РђРІС‚РѕР±РёР·РЅРµСЃ': 'auto',
        'Р‘Р»РѕРіРµСЂ Рё Р°СЂС‚РёСЃС‚': 'blogger'
    };
    
    return businessAreaMap[businessArea] || businessArea.toLowerCase();
}

// Р¤СѓРЅРєС†РёСЏ debounce РґР»СЏ РѕРїС‚РёРјРёР·Р°С†РёРё РїРѕРёСЃРєР°
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

// РћР±РЅРѕРІР»РµРЅРёРµ СЃС‡РµС‚С‡РёРєР° СЂРµР·СѓР»СЊС‚Р°С‚РѕРІ
function updateResultsCount() {
    resultsCount.textContent = filteredCompanies.length;
}

// Р¤СѓРЅРєС†РёСЏ РґР»СЏ РїРѕР»СѓС‡РµРЅРёСЏ РЅР°Р·РІР°РЅРёСЏ РєР°С‚РµРіРѕСЂРёРё
function getCategoryName(categoryKey) {
    const categoryNames = {
        'beauty': 'РЎР°Р»РѕРЅС‹ РєСЂР°СЃРѕС‚С‹',
        'fitness': 'Р¤РёС‚РЅРµСЃ Рё wellness',
        'psychology': 'РџСЃРёС…РѕР»РѕРіРёСЏ Рё РєРѕСѓС‡РёРЅРі',
        'education': 'РћР±СЂР°Р·РѕРІР°РЅРёРµ',
        'health': 'Р—РґРѕСЂРѕРІСЊРµ',
        'esoteric': 'Р­Р·РѕС‚РµСЂРёРєР°',
        'it': 'IT Рё С†РёС„СЂРѕРІС‹Рµ СѓСЃР»СѓРіРё',
        'entertainment': 'Р Р°Р·РІР»РµРєР°С‚РµР»СЊРЅС‹Рµ СѓСЃР»СѓРіРё',
        'finance': 'Р¤РёРЅР°РЅСЃС‹',
        'household': 'Р‘С‹С‚РѕРІС‹Рµ СѓСЃР»СѓРіРё',
        'retail': 'Р РѕР·РЅРёС‡РЅР°СЏ С‚РѕСЂРіРѕРІР»СЏ',
        'real-estate': 'РќРµРґРІРёР¶РёРјРѕСЃС‚СЊ',
        'manufacturing': 'РџСЂРѕРјС‹С€Р»РµРЅРЅРѕРµ РїСЂРѕРёР·РІРѕРґСЃС‚РІРѕ',
        'agriculture': 'РЎРµР»СЊСЃРєРѕРµ С…РѕР·СЏР№СЃС‚РІРѕ',
        'livestock': 'Р–РёРІРѕС‚РЅРѕРІРѕРґСЃС‚РІРѕ',
        'tourism': 'РўСѓСЂРёСЃС‚РёС‡РµСЃРєРёР№ Р±РёР·РЅРµСЃ',
        'restaurant': 'Р РµСЃС‚РѕСЂР°РЅРЅС‹Р№ Р±РёР·РЅРµСЃ',
        'auto': 'РђРІС‚РѕР±РёР·РЅРµСЃ',
        'blogger': 'Р‘Р»РѕРіРµСЂ Рё Р°СЂС‚РёСЃС‚'
    };
    return categoryNames[categoryKey] || categoryKey;
}

// РћС‚РѕР±СЂР°Р¶РµРЅРёРµ РєРѕРјРїР°РЅРёР№
function displayCompanies() {
    const companiesGrid = document.getElementById('companiesGrid');
    
    if (filteredCompanies.length === 0) {
        companiesGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>РџРѕ РІР°С€РµРјСѓ Р·Р°РїСЂРѕСЃСѓ РЅРёС‡РµРіРѕ РЅРµ РЅР°Р№РґРµРЅРѕ</p>
                <p>РџРѕРїСЂРѕР±СѓР№С‚Рµ РёР·РјРµРЅРёС‚СЊ РїР°СЂР°РјРµС‚СЂС‹ РїРѕРёСЃРєР° РёР»Рё С„РёР»СЊС‚СЂС‹</p>
            </div>
        `;
        return;
    }
    
    companiesGrid.innerHTML = filteredCompanies.map(company => {
        // Р РµРєР»Р°РјРЅС‹Рµ РІРѕР·РјРѕР¶РЅРѕСЃС‚Рё РёР· РЅРѕРІРѕРіРѕ РїРѕР»СЏ
        const adOpportunities = [];
        // РџСЂРѕРІРµСЂСЏРµРј СЂР°Р·РЅС‹Рµ РІР°СЂРёР°РЅС‚С‹ РЅР°Р·РІР°РЅРёСЏ РїРѕР»СЏ
        const adOpportunitiesText = company['РљР°РєРёРµ СЂРµРєР»Р°РјРЅС‹Рµ РІРѕР·РјРѕР¶РЅРѕСЃС‚Рё Сѓ РІР°СЃ РµСЃС‚СЊ? (РјРѕР¶РЅРѕ РІС‹Р±СЂР°С‚СЊ РЅРµСЃРєРѕР»СЊРєРѕ) '] || 
                                   company['РљР°РєРёРµ СЂРµРєР»Р°РјРЅС‹Рµ РІРѕР·РјРѕР¶РЅРѕСЃС‚Рё Сѓ РІР°СЃ РµСЃС‚СЊ? (РјРѕР¶РЅРѕ РІС‹Р±СЂР°С‚СЊ РЅРµСЃРєРѕР»СЊРєРѕ)'] ||
                                   '';
        
        if (adOpportunitiesText.includes('РїРµС‡Р°С‚РЅС‹С… РјР°С‚РµСЂРёР°Р»РѕРІ') || adOpportunitiesText.includes('РџРµС‡Р°С‚РЅР°СЏ') || adOpportunitiesText.includes('С„Р»Р°РµСЂР°')) {
            adOpportunities.push(`<div class="ad-opportunity"><i class="fas fa-print"></i> РџРµС‡Р°С‚РЅР°СЏ СЂРµРєР»Р°РјР°</div>`);
        }
        if (adOpportunitiesText.includes('СЃРѕС†СЃРµС‚СЏС…') || adOpportunitiesText.includes('РџРѕСЃС‚С‹') || adOpportunitiesText.includes('Digital') || adOpportunitiesText.includes('РЎРѕС†.СЃРµС‚Рё')) {
            adOpportunities.push(`<div class="ad-opportunity"><i class="fas fa-comment"></i> РџРѕСЃС‚С‹ РІ СЃРѕС†СЃРµС‚СЏС…</div>`);
        }
        if (adOpportunitiesText.includes('РјРµСЂРѕРїСЂРёСЏС‚РёР№') || adOpportunitiesText.includes('РЎРѕРІРјРµСЃС‚РЅС‹Рµ')) {
            adOpportunities.push(`<div class="ad-opportunity"><i class="fas fa-calendar-alt"></i> РЎРѕРІРјРµСЃС‚РЅС‹Рµ РјРµСЂРѕРїСЂРёСЏС‚РёСЏ</div>`);
        }
        if (adOpportunitiesText.includes('РџСЂРѕРјРѕР°РєС†РёРё')) {
            adOpportunities.push(`<div class="ad-opportunity"><i class="fas fa-gift"></i> РџСЂРѕРјРѕР°РєС†РёРё</div>`);
        }
        
        // РЎС‚Р°С‚СѓСЃ Р±Р°СЂС‚РµСЂР° РёР· РЅРѕРІРѕРіРѕ РїРѕР»СЏ
        const barterField = company['Р‘Р°СЂС‚РµСЂ'] || '';
        const hasBarterInfo = barterField && barterField.trim() !== '';
        const barterStatus = hasBarterInfo 
            ? '<span class="barter-status barter-yes"><i class="fas fa-check"></i> Р‘Р°СЂС‚РµСЂ</span>' 
            : '<span class="barter-status barter-no"><i class="fas fa-times"></i> Р‘Р°СЂС‚РµСЂ</span>';
        
        return `
            <div class="company-card">
                <div class="company-card-header">
                    <div class="company-info-left">
                        <h3 class="company-name">${company['РќР°Р·РІР°РЅРёРµ РєРѕРјРїР°РЅРёРё / РРјСЏ Р­РєСЃРїРµСЂС‚Р°']}</h3>
                        <span class="company-category">${company['РќР°РїСЂР°РІР»РµРЅРёРµ РґРµСЏС‚РµР»СЊРЅРѕСЃС‚Рё'] || company['РќР°РїСЂР°РІР»РµРЅРёРµ Р±РёР·РЅРµСЃР°'] || 'РљР°С‚РµРіРѕСЂРёСЏ РЅРµ СѓРєР°Р·Р°РЅР°'}</span>
                    </div>
                    
                    <img src="${company['Р›РѕРіРѕ РєРѕРјРїР°РЅРёРё'] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iNDAiIGZpbGw9IiNGMUY1RjkiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOENBM0IiPgo8cGF0aCBkPSJNMTIgMTJjMi4yMSAwIDQtMS43OSA0LTRzLTEuNzktNC00LTQtNCAxLjc5LTQgNCAxLjc5IDQgNCA0em0wIDJjLTIuNjcgMC04IDEuMzQtOCA0djJoMTZ2LTJjMC0yLjY2LTUuMzMtNC04LTR6Ci8+Cjwvc3ZnPgo8L3N2Zz4K'}" 
                         alt="${company['РќР°Р·РІР°РЅРёРµ РєРѕРјРїР°РЅРёРё / РРјСЏ Р­РєСЃРїРµСЂС‚Р°']}" 
                         class="company-avatar"
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iNDAiIGZpbGw9IiNGMUY1RjkiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOENBM0IiPgo8cGF0aCBkPSJNMTIgMTJjMi4yMSAwIDQtMS43OSA0LTRzLTEuNzktNC00LTQtNCAxLjc5LTQgNCAxLjc5IDQgNCA0em0wIDJjLTIuNjcgMC04IDEuMzQtOCA0djJoMTZ2LTJjMC0yLjY2LTUuMzMtNC04LTR6Ci8+Cjwvc3ZnPgo8L3N2Zz4K'">
                </div>
                
                <p class="company-description">${company['РљРѕСЂРѕС‚РєРѕ Рѕ РєРѕРјРїР°РЅРёРё (2вЂ“3 РїСЂРµРґР»РѕР¶РµРЅРёСЏ)']}</p>
                
                ${adOpportunities.length > 0 ? `
                <div class="company-ad-opportunities">
                    <h4 class="collaboration-title">Р’РѕР·РјРѕР¶РЅРѕСЃС‚Рё РґР»СЏ РєРѕР»Р»Р°Р±РѕСЂР°С†РёР№</h4>
                    ${adOpportunities.join('')}
                </div>` : `<div class="company-spacer"></div>`}
                
                <div class="company-bottom">
                    <div class="company-pills">
                        <span class="pill-metric">
                            <i class="fas fa-users"></i>
                            ${company['Р Р°СЃСЃРєР°Р¶РёС‚Рµ РїСЂРѕ СЃРІРѕСЋ Р°СѓРґРёС‚РѕСЂРёСЋ РІ СЃРѕС†СЃРµС‚СЏС…, РµСЃР»Рё РµСЃС‚СЊ'] || 'РђСѓРґРёС‚РѕСЂРёСЏ РЅРµ СѓРєР°Р·Р°РЅР°'}
                        </span>
                        <span class="pill-metric">
                            <i class="fas fa-user"></i>
                            РљР»РёРµРЅС‚С‹ - ${company['РџРѕРґРµР»РёС‚РµСЃСЊ С†РёС„СЂР°РјРё: СЃРєРѕР»СЊРєРѕ Р·Р°РєР°Р·РѕРІ/РєР»РёРµРЅС‚РѕРІ РІС‹ РїРѕР»СѓС‡Р°РµС‚Рµ РµР¶РµРјРµСЃСЏС‡РЅРѕ?'] || '0'}
                        </span>
                            ${barterStatus}
                        </div>
                        
                        <button class="company-contact" data-company-name="${company['РќР°Р·РІР°РЅРёРµ РєРѕРјРїР°РЅРёРё / РРјСЏ Р­РєСЃРїРµСЂС‚Р°'].replace(/"/g, '&quot;')}">
                            <i class="fas fa-eye"></i>
                            РџРѕРґСЂРѕР±РЅРµРµ
                        </button>
                </div>
            </div>
        `;
    }).join('');

    // Р”РѕР±Р°РІР»СЏРµРј РѕР±СЂР°Р±РѕС‚С‡РёРєРё СЃРѕР±С‹С‚РёР№ РґР»СЏ РєРЅРѕРїРѕРє "РџРѕРґСЂРѕР±РЅРµРµ"
    document.querySelectorAll('.company-contact').forEach(button => {
        button.addEventListener('click', function() {
            const companyName = this.getAttribute('data-company-name').replace(/&quot;/g, '"');
            console.log('рџ”Ќ РљР»РёРєРЅСѓР»Рё РЅР° РєРЅРѕРїРєСѓ РґР»СЏ РєРѕРјРїР°РЅРёРё:', companyName);
            openCompanyDetails(companyName);
        });
    });
}

// РћС‚РєСЂС‹С‚РёРµ РґРµС‚Р°Р»РµР№ РєРѕРјРїР°РЅРёРё
function openCompanyDetails(companyName) {
    console.log('рџ”Ќ РС‰РµРј РєРѕРјРїР°РЅРёСЋ:', companyName);
    console.log('рџ“‹ Р”РѕСЃС‚СѓРїРЅС‹Рµ РєРѕРјРїР°РЅРёРё:', companies.map(c => c['РќР°Р·РІР°РЅРёРµ РєРѕРјРїР°РЅРёРё / РРјСЏ Р­РєСЃРїРµСЂС‚Р°']));
    
    const company = companies.find(c => c['РќР°Р·РІР°РЅРёРµ РєРѕРјРїР°РЅРёРё / РРјСЏ Р­РєСЃРїРµСЂС‚Р°'] === companyName);
    if (!company) {
        console.error('вќЊ РљРѕРјРїР°РЅРёСЏ РЅРµ РЅР°Р№РґРµРЅР°:', companyName);
        alert('РљРѕРјРїР°РЅРёСЏ РЅРµ РЅР°Р№РґРµРЅР°: ' + companyName);
        return;
    }

    // РџРѕРґРіРѕС‚РѕРІРєР° РґР°РЅРЅС‹С… РґР»СЏ РѕС‚РѕР±СЂР°Р¶РµРЅРёСЏ
    const companyTitle = company['РќР°Р·РІР°РЅРёРµ РєРѕРјРїР°РЅРёРё / РРјСЏ Р­РєСЃРїРµСЂС‚Р°'] || 'РќР°Р·РІР°РЅРёРµ РЅРµ СѓРєР°Р·Р°РЅРѕ';
    const companyCategory = company['РќР°РїСЂР°РІР»РµРЅРёРµ РґРµСЏС‚РµР»СЊРЅРѕСЃС‚Рё'] || company['РќР°РїСЂР°РІР»РµРЅРёРµ Р±РёР·РЅРµСЃР°'] || 'РљР°С‚РµРіРѕСЂРёСЏ РЅРµ СѓРєР°Р·Р°РЅР°';
    const shortDescription = company['РљРѕСЂРѕС‚РєРѕ Рѕ РєРѕРјРїР°РЅРёРё (2вЂ“3 РїСЂРµРґР»РѕР¶РµРЅРёСЏ)'] || '';
    const fullDescription = company['Р Р°СЃСЃРєР°Р¶РёС‚Рµ РїРѕРґСЂРѕР±РЅРµРµ Рѕ СЃРІРѕРµР№ РєРѕРјРїР°РЅРёРё/СЌРєСЃРїРµСЂС‚РёР·Рµ'] || shortDescription;
    const companyLogo = company['Р›РѕРіРѕ РєРѕРјРїР°РЅРёРё'] || '';
    
    console.log('вњ… РћС‚РєСЂС‹РІР°РµРј РєР°СЂС‚РѕС‡РєСѓ:', companyTitle);
    console.log('рџ“Љ Р”Р°РЅРЅС‹Рµ РєРѕРјРїР°РЅРёРё:', company);
    
    // Р’РѕР·РјРѕР¶РЅРѕСЃС‚Рё РґР»СЏ РєРѕР»Р»Р°Р±РѕСЂР°С†РёР№
    const collaborationField = company['РљР°РєРёРµ СЂРµРєР»Р°РјРЅС‹Рµ РІРѕР·РјРѕР¶РЅРѕСЃС‚Рё Сѓ РІР°СЃ РµСЃС‚СЊ? (РјРѕР¶РЅРѕ РІС‹Р±СЂР°С‚СЊ РЅРµСЃРєРѕР»СЊРєРѕ) '] || 
                              company['РљР°РєРёРµ СЂРµРєР»Р°РјРЅС‹Рµ РІРѕР·РјРѕР¶РЅРѕСЃС‚Рё Сѓ РІР°СЃ РµСЃС‚СЊ? (РјРѕР¶РЅРѕ РІС‹Р±СЂР°С‚СЊ РЅРµСЃРєРѕР»СЊРєРѕ)'] || '';
    
    const collaborationOpportunities = [];
    if (collaborationField) {
        // Р Р°Р·Р±РёРІР°РµРј С‚РѕР»СЊРєРѕ РїРѕ С‚РѕС‡РєР°Рј СЃ Р·Р°РїСЏС‚РѕР№, С‡С‚РѕР±С‹ РЅРµ Р»РѕРјР°С‚СЊ РїСѓРЅРєС‚С‹ СЃ Р·Р°РїСЏС‚С‹РјРё РІРЅСѓС‚СЂРё
        const opportunities = collaborationField.split(';').map(item => item.trim()).filter(item => item);
        opportunities.forEach(opportunity => {
            let icon = 'fas fa-star';
            if (opportunity.toLowerCase().includes('СЃРѕС†') || opportunity.toLowerCase().includes('РїРѕСЃС‚') || opportunity.toLowerCase().includes('digital')) {
                icon = 'fas fa-comment';
            } else if (opportunity.toLowerCase().includes('РїРµС‡Р°С‚') || opportunity.toLowerCase().includes('С„Р»Р°РµСЂ') || opportunity.toLowerCase().includes('РІРёР·РёС‚') || opportunity.toLowerCase().includes('РјР°С‚РµСЂРёР°Р»')) {
                icon = 'fas fa-print';
            } else if (opportunity.toLowerCase().includes('РјРµСЂРѕРїСЂРёСЏС‚') || opportunity.toLowerCase().includes('СЃРѕР±С‹С‚') || opportunity.toLowerCase().includes('РІРµР±РёРЅР°СЂ') || opportunity.toLowerCase().includes('РєРѕРЅС„РµСЂРµРЅС†')) {
                icon = 'fas fa-calendar-alt';
            } else if (opportunity.toLowerCase().includes('РїСЂРѕРјРѕ') || opportunity.toLowerCase().includes('Р°РєС†') || opportunity.toLowerCase().includes('СЂРѕР·С‹РіСЂС‹С€') || opportunity.toLowerCase().includes('РєРѕРЅРєСѓСЂСЃ')) {
                icon = 'fas fa-gift';
            } else if (opportunity.toLowerCase().includes('С†РёС„СЂ')) {
                icon = 'fas fa-laptop';
            }
            collaborationOpportunities.push({ icon, text: opportunity });
        });
    }
    
    // РђСѓРґРёС‚РѕСЂРёСЏ Рё РјР°СЃС€С‚Р°Р±С‹
    const socialAudience = company['Р Р°СЃСЃРєР°Р¶РёС‚Рµ РїСЂРѕ СЃРІРѕСЋ Р°СѓРґРёС‚РѕСЂРёСЋ РІ СЃРѕС†СЃРµС‚СЏС…, РµСЃР»Рё РµСЃС‚СЊ'] || '';
    const monthlyClients = company['РџРѕРґРµР»РёС‚РµСЃСЊ С†РёС„СЂР°РјРё: СЃРєРѕР»СЊРєРѕ Р·Р°РєР°Р·РѕРІ/РєР»РёРµРЅС‚РѕРІ РІС‹ РїРѕР»СѓС‡Р°РµС‚Рµ РµР¶РµРјРµСЃСЏС‡РЅРѕ?'] || '';
    const barterAvailable = company['Р‘Р°СЂС‚РµСЂ'] || '';
    const partnershipPreferences = company['РЎ РєРµРј РІС‹ С…РѕС‚РµР»Рё Р±С‹ СЃРѕС‚СЂСѓРґРЅРёС‡Р°С‚СЊ?'] || '';
    
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
                        <h3>Рћ РєРѕРјРїР°РЅРёРё</h3>
                        <p class="modal-description">${fullDescription}</p>
                    </div>
                ` : ''}
                
                ${collaborationOpportunities.length > 0 ? `
                    <div class="modal-section">
                        <h3>Р’РѕР·РјРѕР¶РЅРѕСЃС‚Рё РґР»СЏ РєРѕР»Р»Р°Р±РѕСЂР°С†РёР№</h3>
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
                    <h3>РђСѓРґРёС‚РѕСЂРёСЏ Рё РјР°СЃС€С‚Р°Р±С‹</h3>
                    <div class="modal-metrics">
                        ${socialAudience ? `
                            <div class="modal-metric-item">
                                <i class="fas fa-users"></i>
                                <span><strong>РџРѕРґРїРёСЃС‡РёРєРё:</strong> ${socialAudience}</span>
                            </div>
                        ` : ''}
                        ${monthlyClients ? `
                            <div class="modal-metric-item">
                                <i class="fas fa-user"></i>
                                <span><strong>РљР»РёРµРЅС‚С‹ РІ РјРµСЃСЏС†:</strong> ${monthlyClients}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                ${barterAvailable ? `
                    <div class="modal-section">
                        <h3>Р‘Р°СЂС‚РµСЂРЅС‹Рµ РІРѕР·РјРѕР¶РЅРѕСЃС‚Рё</h3>
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
                        <h3>РџРѕР¶РµР»Р°РЅРёСЏ РґР»СЏ РїР°СЂС‚РЅС‘СЂСЃС‚РІР°</h3>
                        <div class="modal-preferences">
                            <div class="modal-preference-item">
                                <i class="fas fa-star"></i>
                                <span><strong>РҐРѕС‚РёРј РєРѕР»Р»Р°Р±РѕСЂР°С†РёСЋ СЃ:</strong><br>${partnershipPreferences}</span>
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                <div class="modal-actions">
                    <button class="modal-btn-primary" onclick="requestCollaboration('${companyTitle}')">
                        <i class="fas fa-handshake"></i>
                        РҐРѕС‡Сѓ РєРѕР»Р»Р°Р±
                    </button>
                    <button class="modal-btn-secondary" onclick="closeModal()">
                        <i class="fas fa-times"></i>
                        Р—Р°РєСЂС‹С‚СЊ
                    </button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('companyModal').innerHTML = modalHTML;
    document.getElementById('companyModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Р—Р°РєСЂС‹С‚РёРµ РјРѕРґР°Р»СЊРЅРѕРіРѕ РѕРєРЅР°
function closeModal() {
    document.getElementById('companyModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// РћР±СЂР°Р±РѕС‚С‡РёРє РєР»РёРєР° РїРѕ РёРєРѕРЅРєРµ С„РёР»СЊС‚СЂР°
function handleFilterIconClick(event, filterId) {
    event.stopPropagation();
    
    const filterIcon = document.getElementById(filterId + 'Icon');
    
    if (filterIcon.classList.contains('reset-mode')) {
        // Р•СЃР»Рё РёРєРѕРЅРєР° РІ СЂРµР¶РёРјРµ СЃР±СЂРѕСЃР° (РєСЂРµСЃС‚РёРє), СЃР±СЂР°СЃС‹РІР°РµРј С„РёР»СЊС‚СЂ
        resetFilter(filterId);
    } else {
        // РРЅР°С‡Рµ РѕС‚РєСЂС‹РІР°РµРј РґСЂРѕРїРґР°СѓРЅ
        toggleDropdown(filterId);
    }
}

// Р—Р°РїСЂРѕСЃ РєРѕР»Р»Р°Р±РѕСЂР°С†РёРё
function requestCollaboration(companyName) {
    alert(`РћС‚Р»РёС‡РЅРѕ! Р”Р»СЏ РєРѕР»Р»Р°Р±РѕСЂР°С†РёРё СЃ "${companyName}" СЃРІСЏР¶РёС‚РµСЃСЊ СЃ РЅРёРјРё С‡РµСЂРµР· Telegram РёР»Рё СЃРѕС†РёР°Р»СЊРЅС‹Рµ СЃРµС‚Рё. РљРѕРЅС‚Р°РєС‚С‹ СѓРєР°Р·Р°РЅС‹ РІ РєР°СЂС‚РѕС‡РєРµ РєРѕРјРїР°РЅРёРё.`);
}

