// Доступные временные слоты
const availableSlots = [
    { date: '2025-03-20', time: '10:00' },
    { date: '2025-03-20', time: '11:00' },
    { date: '2025-03-20', time: '14:00' },
    { date: '2025-03-21', time: '09:00' },
    { date: '2025-03-21', time: '13:00' },
];

// Заполнение временных слотов в зависимости от выбранной даты
function populateSlots() {
    const dateInput = document.getElementById('date');
    const slotSelect = document.getElementById('slot');
    if (!dateInput || !slotSelect) return; // Проверка на наличие элементов

    slotSelect.innerHTML = '<option value="">Выберите время</option>';
    availableSlots.forEach(slot => {
        if (slot.date === dateInput.value) {
            const option = document.createElement('option');
            option.value = slot.time;
            option.text = slot.time;
            slotSelect.appendChild(option);
        }
    });
}

// Обработка отправки формы
const form = document.getElementById('appointmentForm');
if (form) {
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const date = document.getElementById('date').value;
        const slot = document.getElementById('slot').value;
        const service = document.getElementById('service').value;

        if (name && phone && date && slot && service) {
            document.getElementById('formMessage').textContent = `Спасибо, ${name}! Вы записаны на ${service} на ${date} в ${slot}. Мы свяжемся с вами по телефону: ${phone}.`;
            document.getElementById('formMessage').style.color = 'green';
            this.reset();
            document.getElementById('slot').innerHTML = '<option value="">Выберите время</option>';
        } else {
            document.getElementById('formMessage').textContent = 'Пожалуйста, заполните все поля корректно.';
            document.getElementById('formMessage').style.color = 'red';
        }
    });
}
// Обработка кнопок "Записаться" на странице услуг
document.querySelectorAll('.book-now').forEach(button => {
    button.addEventListener('click', function() {
        const service = this.getAttribute('data-service');
        localStorage.setItem('selectedService', service); // Сохраняем выбранную услугу
        window.location.href = 'appointment.html'; // Переход на страницу записи
    });
});

// Предварительное заполнение формы записи на основе выбранной услуги
if (document.getElementById('appointmentForm')) {
    const selectedService = localStorage.getItem('selectedService');
    if (selectedService) {
        document.getElementById('service').value = selectedService;
        localStorage.removeItem('selectedService'); // Очищаем после использования
    }
}

// Данные о врачах и стоимости услуг
const serviceDetails = {
    therapy: { doctors: ['д-р Иванова А.П.', 'д-р Петров С.М.'], cost: 2000 },
    surgery: { doctors: ['д-р Сидоров В.К.', 'д-р Кузнецова Е.Н.'], cost: 15000 },
    pediatrics: { doctors: ['д-р Михайлова О.В.', 'д-р Николаев Д.А.'], cost: 1800 },
    diagnostics: { doctors: ['д-р Григорьева Т.И.', 'д-р Соколов П.Е.'], cost: 2500 },
    cardiology: { doctors: ['д-р Ковалев Р.Н.', 'д-р Лебедева М.С.'], cost: 3000 }
};

// Обновление списка врачей и стоимости
function updateDoctorsAndCost() {
    const serviceSelect = document.getElementById('service');
    const doctorSelect = document.getElementById('doctor');
    const costSpan = document.getElementById('cost');
    if (!serviceSelect || !doctorSelect || !costSpan) return;

    const service = serviceSelect.value;
    doctorSelect.innerHTML = '<option value="">Выберите врача</option>';
    costSpan.textContent = '0 руб.';

    if (service && serviceDetails[service]) {
        serviceDetails[service].doctors.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor;
            option.text = doctor;
            doctorSelect.appendChild(option);
        });
        costSpan.textContent = `${serviceDetails[service].cost} руб.`;
    }
}

// Обработка формы записи с сохранением истории
if (document.getElementById('appointmentForm')) {
    const appointmentForm = document.getElementById('appointmentForm');
    appointmentForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const service = document.getElementById('service').value;
        const doctor = document.getElementById('doctor').value;
        const date = document.getElementById('date').value;
        const slot = document.getElementById('slot').value;

        if (name && phone && service && doctor && date && slot) {
            const message = `Спасибо, ${name}! Вы записаны на ${service} к ${doctor} на ${date} в ${slot}. Телефон: ${phone}.`;
            document.getElementById('formMessage').textContent = message;
            document.getElementById('formMessage').style.color = 'green';

            // Сохранение в историю
            const history = JSON.parse(localStorage.getItem('appointmentHistory') || '[]');
            history.push({ name, phone, service, doctor, date, slot });
            localStorage.setItem('appointmentHistory', JSON.stringify(history));
            updateHistoryList();

            this.reset();
            document.getElementById('slot').innerHTML = '<option value="">Выберите время</option>';
            document.getElementById('doctor').innerHTML = '<option value="">Выберите врача</option>';
            document.getElementById('cost').textContent = '0 руб.';
        } else {
            document.getElementById('formMessage').textContent = 'Заполните все поля корректно.';
            document.getElementById('formMessage').style.color = 'red';
        }
    });

    // Обновление списка истории
    function updateHistoryList() {
        const historyList = document.getElementById('historyList');
        const history = JSON.parse(localStorage.getItem('appointmentHistory') || '[]');
        historyList.innerHTML = '';
        history.forEach(entry => {
            const li = document.createElement('li');
            li.textContent = `${entry.name} - ${entry.service} с ${entry.doctor} на ${entry.date} в ${entry.slot}`;
            historyList.appendChild(li);
        });
    }

    // Инициализация при загрузке
    document.addEventListener('DOMContentLoaded', () => {
        updateHistoryList();
        const selectedService = localStorage.getItem('selectedService');
        if (selectedService) {
            document.getElementById('service').value = selectedService;
            updateDoctorsAndCost();
            localStorage.removeItem('selectedService');
        }
    });
}
// Функция для показа/скрытия подробностей новости
function toggleDetails(button) {
    const details = button.nextElementSibling;
    details.style.display = details.style.display === 'none' ? 'block' : 'none';
}

// Фильтрация новостей по категории
function filterNews() {
    const category = document.getElementById('category').value;
    document.querySelectorAll('.news-item').forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        item.style.display = (category === 'all' || itemCategory === category) ? 'block' : 'none';
    });
}

// Обработка комментариев
document.querySelectorAll('.comment-form').forEach(form => {
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const newsId = this.getAttribute('data-news-id');
        const commentText = this.querySelector('input').value;

        const commentList = document.getElementById(`comments-${newsId}`);
        const li = document.createElement('li');
        li.textContent = commentText;
        commentList.appendChild(li);

        // Сохранение в localStorage
        const comments = JSON.parse(localStorage.getItem(`comments-${newsId}`) || '[]');
        comments.push(commentText);
        localStorage.setItem(`comments-${newsId}`, JSON.stringify(comments));

        this.reset();
    });
});

// Загрузка сохраненных комментариев
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.comments ul').forEach(ul => {
        const newsId = ul.id.split('-')[1];
        const comments = JSON.parse(localStorage.getItem(`comments-${newsId}`) || '[]');
        comments.forEach(comment => {
            const li = document.createElement('li');
            li.textContent = comment;
            ul.appendChild(li);
        });
    });
});

// Обновление данных DHIS2
document.getElementById('refresh-data')?.addEventListener('click', function() {
    const dataTable = document.getElementById('data-table');
    // Пример обновления (в реальной системе данные приходят из API DHIS2)
    const newData = [
        { indicator: 'Посещения пациентов', value: Math.floor(Math.random() * 50) + 100, date: '2025-03-17' },
        { indicator: 'Диагностические тесты', value: Math.floor(Math.random() * 20) + 30, date: '2025-03-17' },
        { indicator: 'Операции', value: Math.floor(Math.random() * 10) + 10, date: '2025-03-17' }
    ];
    dataTable.innerHTML = newData.map(row => `
        <tr>
            <td>${row.indicator}</td>
            <td>${row.value}</td>
            <td>${row.date}</td>
        </tr>
    `).join('');
});

// Слайдер отзывов
const reviews = document.querySelectorAll('.review');
let currentReview = 0;

function showReview(index) {
    reviews.forEach((review, i) => {
        review.classList.toggle('active', i === index);
    });
}

document.getElementById('next-review')?.addEventListener('click', () => {
    currentReview = (currentReview + 1) % reviews.length;
    showReview(currentReview);
});

document.getElementById('prev-review')?.addEventListener('click', () => {
    currentReview = (currentReview - 1 + reviews.length) % reviews.length;
    showReview(currentReview);
});

// Инициализация слайдера
if (reviews.length > 0) showReview(currentReview);