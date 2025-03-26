// Simulated data
let rooms = { single: 5, double: 3, suite: 2 };
let bookings = {};
let payments = {};
let foodOrders = {};
let feedback = {};

// Generate unique booking ID
function generateBookingId() {
    return 'BK-' + Math.random().toString(36).substr(2, 5).toUpperCase();
}

// Show popup
function showPopup(message, isError = false) {
    const popup = document.getElementById('popup');
    const popupContent = document.querySelector('.popup-content');
    const popupMessage = document.getElementById('popupMessage');
    popupMessage.textContent = message;
    popupMessage.style.color = isError ? '#d32f2f' : '#0288d1';
    popup.style.display = 'flex';
    if (isError) popupContent.classList.add('error');
    else popupContent.classList.remove('error');
}

// Close popup
function closePopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'none';
}

// Registration Form (index.html)
const registrationForm = document.getElementById('registrationForm');
if (registrationForm) {
    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const contact = document.getElementById('contact').value;
        const idProof = document.getElementById('idProof').value;
        const checkin = document.getElementById('checkin').value;
        const checkout = document.getElementById('checkout').value;

        if (new Date(checkout) <= new Date(checkin)) {
            showPopup('Check-out date must be after check-in date!', true);
            return;
        }

        const bookingId = generateBookingId();
        bookings[bookingId] = { name, contact, idProof, checkin, checkout, room: null, totalCost: 0 };
        showPopup(`Booking Confirmed! Your ID: ${bookingId}`);
        registrationForm.reset();
    });
}

// Room Allocation Form (rooms.html)
const roomForm = document.getElementById('roomForm');
if (roomForm) {
    const bookingIdInput = document.getElementById('bookingIdRoom');
    const feedback = document.getElementById('bookingIdFeedback');
    const allocateButton = document.getElementById('allocateButton');

    bookingIdInput.addEventListener('input', validateBookingId.bind(null, bookingIdInput, feedback, allocateButton));
    roomForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const bookingId = bookingIdInput.value.trim();
        const roomType = document.getElementById('roomType').value;

        if (!bookings[bookingId]) {
            showPopup(`Error: Booking ID "${bookingId}" not found!`, true);
            return;
        }

        if (bookings[bookingId].room) {
            showPopup(`Error: Booking "${bookingId}" already has a ${bookings[bookingId].room} room!`, true);
            return;
        }

        if (rooms[roomType] > 0) {
            rooms[roomType]--;
            bookings[bookingId].room = roomType;
            bookings[bookingId].totalCost += { single: 50, double: 80, suite: 120 }[roomType]; // Sample costs
            updateRoomAvailability();
            showPopup(`${roomType.charAt(0).toUpperCase() + roomType.slice(1)} room allocated to ${bookingId}!`);
        } else {
            suggestAlternatives(bookingId);
        }
        roomForm.reset();
        feedback.textContent = '';
        allocateButton.disabled = true;
    });
}

// Payment Form (payment.html)
const paymentForm = document.getElementById('paymentForm');
if (paymentForm) {
    const bookingIdInput = document.getElementById('bookingIdPayment');
    const feedback = document.getElementById('paymentFeedback');
    const payButton = document.getElementById('payButton');

    bookingIdInput.addEventListener('input', validateBookingId.bind(null, bookingIdInput, feedback, payButton));
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const bookingId = bookingIdInput.value.trim();
        const amount = parseFloat(document.getElementById('amount').value);
        const paymentType = document.getElementById('paymentType').value;
        const paymentStatus = document.getElementById('paymentStatus').value;

        if (!bookings[bookingId]) {
            showPopup(`Error: Booking ID "${bookingId}" not found!`, true);
            return;
        }

        payments[bookingId] = payments[bookingId] || { paid: 0, status: '' };
        payments[bookingId].paid += amount;
        payments[bookingId].status = paymentStatus;
        payments[bookingId].type = paymentType;

        let message = `Payment of $${amount} (${paymentType}) processed for ${bookingId} as ${paymentStatus}!`;
        if (paymentStatus !== 'full' && payments[bookingId].paid < bookings[bookingId].totalCost) {
            message += ` Remaining: $${(bookings[bookingId].totalCost - payments[bookingId].paid).toFixed(2)}`;
        }
        showPopup(message);
        paymentForm.reset();
        feedback.textContent = '';
        payButton.disabled = true;
    });
}

// Food Form (food.html)
const foodForm = document.getElementById('foodForm');
if (foodForm) {
    const bookingIdInput = document.getElementById('bookingIdFood');
    const feedback = document.getElementById('foodFeedback');
    const orderButton = document.getElementById('orderButton');

    bookingIdInput.addEventListener('input', validateBookingId.bind(null, bookingIdInput, feedback, orderButton));
    foodForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const bookingId = bookingIdInput.value.trim();
        const orderType = document.getElementById('orderType').value;
        const items = document.getElementById('items').value;

        if (!bookings[bookingId]) {
            showPopup(`Error: Booking ID "${bookingId}" not found!`, true);
            return;
        }

        const orderCost = items.split(',').length * 10; // Sample cost: $10 per item
        foodOrders[bookingId] = foodOrders[bookingId] || [];
        foodOrders[bookingId].push({ type: orderType, items, cost: orderCost });
        bookings[bookingId].totalCost += orderCost;

        showPopup(`Order placed for ${bookingId}: ${orderType} - ${items} ($${orderCost})`);
        foodForm.reset();
        feedback.textContent = '';
        orderButton.disabled = true;
    });
}

// Feedback Form (feedback.html)
const feedbackForm = document.getElementById('feedbackForm');
if (feedbackForm) {
    const bookingIdInput = document.getElementById('bookingIdFeedback');
    const feedbackText = document.getElementById('feedbackFeedback');
    const submitButton = document.getElementById('submitFeedbackButton');

    bookingIdInput.addEventListener('input', validateBookingId.bind(null, bookingIdInput, feedbackText, submitButton));
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const bookingId = bookingIdInput.value.trim();
        const rating = document.getElementById('rating').value;
        const comments = document.getElementById('comments').value;

        if (!bookings[bookingId]) {
            showPopup(`Error: Booking ID "${bookingId}" not found!`, true);
            return;
        }

        feedback[bookingId] = { rating, comments };
        showPopup(`Thank you for your feedback, ${bookings[bookingId].name}!`);
        feedbackForm.reset();
        feedbackText.textContent = '';
        submitButton.disabled = true;
    });
}

// Utility Functions
function validateBookingId(input, feedback, button) {
    const bookingId = input.value.trim();
    if (bookingId && !bookings[bookingId]) {
        input.classList.add('invalid');
        feedback.textContent = `Booking ID "${bookingId}" not found!`;
        feedback.style.color = '#d32f2f';
        button.disabled = true;
    } else if (bookingId && bookings[bookingId]) {
        input.classList.remove('invalid');
        feedback.textContent = `Booking ID "${bookingId}" found!`;
        feedback.style.color = '#0288d1';
        button.disabled = false;
    } else {
        input.classList.remove('invalid');
        feedback.textContent = '';
        button.disabled = true;
    }
}

function updateRoomAvailability() {
    if (document.getElementById('roomAvailability')) {
        document.getElementById('singleCount').textContent = rooms.single;
        document.getElementById('doubleCount').textContent = rooms.double;
        document.getElementById('suiteCount').textContent = rooms.suite;
    }
}

function suggestAlternatives(bookingId) {
    let available = [];
    for (let type in rooms) {
        if (rooms[type] > 0) available.push(type);
    }
    if (available.length > 0) {
        showPopup(`No ${document.getElementById('roomType').value} rooms available! Alternatives: ${available.join(', ')}.`, true);
    } else {
        showPopup('No rooms available at all!', true);
    }
}

// Initialize room availability
updateRoomAvailability();