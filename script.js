// Prayer names mapping
const prayerNames = {
    Fajr: { tr: 'İmsak', id: 'imsak', icon: '🌙' },
    Sunrise: { tr: 'Güneş', id: 'gunes', icon: '🌅' },
    Dhuhr: { tr: 'Öğle', id: 'ogle', icon: '☀️' },
    Asr: { tr: 'İkindi', id: 'ikindi', icon: '🌤️' },
    Maghrib: { tr: 'Akşam', id: 'aksam', icon: '🌆' },
    Isha: { tr: 'Yatsı', id: 'yatsi', icon: '🌃' }
};

// Turkish city names to English mapping for API
const cityMapping = {
    'Istanbul': 'Istanbul',
    'Ankara': 'Ankara',
    'Izmir': 'Izmir',
    'Bursa': 'Bursa',
    'Antalya': 'Antalya',
    'Adana': 'Adana',
    'Konya': 'Konya',
    'Gaziantep': 'Gaziantep',
    'Kayseri': 'Kayseri',
    'Mersin': 'Mersin'
};

let currentPrayerTimes = {};
let countdownInterval = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Load saved city
    const savedCity = localStorage.getItem('selectedCity');
    if (savedCity) {
        document.getElementById('citySelect').value = savedCity;
        fetchPrayerTimes(savedCity);
    }

    // City selection change
    document.getElementById('citySelect').addEventListener('change', (e) => {
        const city = e.target.value;
        if (city) {
            localStorage.setItem('selectedCity', city);
            fetchPrayerTimes(city);
        }
    });
});

// Update date and time
function updateDateTime() {
    const now = new Date();

    // Turkish date format
    const dateOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const dateStr = now.toLocaleDateString('tr-TR', dateOptions);
    document.getElementById('currentDate').textContent = dateStr;

    // Time format
    const timeStr = now.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('currentTime').textContent = timeStr;
}

// Show loading
function showLoading(show) {
    const loading = document.getElementById('loading');
    if (show) {
        loading.classList.add('show');
    } else {
        loading.classList.remove('show');
    }
}

// Show error
function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    errorElement.textContent = message;
    errorElement.classList.add('show');
    setTimeout(() => {
        errorElement.classList.remove('show');
    }, 5000);
}

// Fetch prayer times from API
async function fetchPrayerTimes(city) {
    showLoading(true);
    document.getElementById('prayerTimes').classList.remove('show');
    document.getElementById('nextPrayerCard').classList.remove('show');

    try {
        const cityName = cityMapping[city] || city;
        const country = 'Turkey';

        // Using Aladhan API
        const response = await fetch(
            `https://api.aladhan.com/v1/timingsByCity?city=${cityName}&country=${country}&method=13`
        );

        if (!response.ok) {
            throw new Error('Namaz vakitleri alınamadı');
        }

        const data = await response.json();

        if (data.code === 200 && data.data) {
            displayPrayerTimes(data.data.timings);
            currentPrayerTimes = data.data.timings;
            updateNextPrayer();

            // Start countdown
            if (countdownInterval) {
                clearInterval(countdownInterval);
            }
            countdownInterval = setInterval(updateNextPrayer, 1000);
        } else {
            throw new Error('Geçersiz veri formatı');
        }

    } catch (error) {
        console.error('Error fetching prayer times:', error);
        showError('Namaz vakitleri yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
        showLoading(false);
    }
}

// Display prayer times
function displayPrayerTimes(timings) {
    // Map API response to our prayer names
    const prayers = {
        imsak: timings.Fajr,
        gunes: timings.Sunrise,
        ogle: timings.Dhuhr,
        ikindi: timings.Asr,
        aksam: timings.Maghrib,
        yatsi: timings.Isha
    };

    // Update each prayer time
    Object.keys(prayers).forEach(prayerId => {
        const timeElement = document.getElementById(prayerId);
        if (timeElement) {
            timeElement.textContent = formatTime(prayers[prayerId]);
        }
    });

    document.getElementById('prayerTimes').classList.add('show');
}

// Format time from 24h to readable format
function formatTime(time) {
    if (!time) return '--:--';

    // Remove seconds and timezone info
    const parts = time.split(' ')[0].split(':');
    return `${parts[0]}:${parts[1]}`;
}

// Calculate next prayer and update countdown
function updateNextPrayer() {
    if (!currentPrayerTimes || Object.keys(currentPrayerTimes).length === 0) {
        return;
    }

    const now = new Date();
    const currentTime = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

    // Prayer times in seconds
    const prayers = [
        { name: 'İmsak', time: timeToSeconds(currentPrayerTimes.Fajr), id: 'imsak' },
        { name: 'Güneş', time: timeToSeconds(currentPrayerTimes.Sunrise), id: 'gunes' },
        { name: 'Öğle', time: timeToSeconds(currentPrayerTimes.Dhuhr), id: 'ogle' },
        { name: 'İkindi', time: timeToSeconds(currentPrayerTimes.Asr), id: 'ikindi' },
        { name: 'Akşam', time: timeToSeconds(currentPrayerTimes.Maghrib), id: 'aksam' },
        { name: 'Yatsı', time: timeToSeconds(currentPrayerTimes.Isha), id: 'yatsi' }
    ];

    // Find next prayer
    let nextPrayer = null;
    let minDiff = Infinity;

    prayers.forEach(prayer => {
        const diff = prayer.time - currentTime;
        if (diff > 0 && diff < minDiff) {
            minDiff = diff;
            nextPrayer = prayer;
        }
    });

    // If no prayer found for today, next prayer is tomorrow's first prayer (Imsak)
    if (!nextPrayer) {
        nextPrayer = prayers[0];
        minDiff = (24 * 3600) - currentTime + nextPrayer.time;
    }

    // Update UI
    if (nextPrayer) {
        document.getElementById('nextPrayerName').textContent = nextPrayer.name;
        document.getElementById('nextPrayerTime').textContent = formatTime(getPrayerTimeByName(nextPrayer.name));

        // Update countdown
        const hours = Math.floor(minDiff / 3600);
        const minutes = Math.floor((minDiff % 3600) / 60);
        const seconds = minDiff % 60;

        document.getElementById('countdown').textContent =
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        document.getElementById('nextPrayerCard').classList.add('show');

        // Highlight active prayer card
        document.querySelectorAll('.prayer-card').forEach(card => {
            card.classList.remove('active');
        });
        const activeCard = document.querySelector(`[data-prayer="${nextPrayer.id}"]`);
        if (activeCard) {
            activeCard.classList.add('active');
        }
    }
}

// Convert time string to seconds
function timeToSeconds(timeStr) {
    if (!timeStr) return 0;

    const parts = timeStr.split(' ')[0].split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);

    return hours * 3600 + minutes * 60;
}

// Get prayer time by Turkish name
function getPrayerTimeByName(name) {
    const mapping = {
        'İmsak': currentPrayerTimes.Fajr,
        'Güneş': currentPrayerTimes.Sunrise,
        'Öğle': currentPrayerTimes.Dhuhr,
        'İkindi': currentPrayerTimes.Asr,
        'Akşam': currentPrayerTimes.Maghrib,
        'Yatsı': currentPrayerTimes.Isha
    };

    return mapping[name] || '--:--';
}

// Add click effect to prayer cards
document.addEventListener('click', (e) => {
    const card = e.target.closest('.prayer-card');
    if (card) {
        // Add ripple effect
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.animation = 'ripple 0.6s ease-out';

        const rect = card.getBoundingClientRect();
        ripple.style.left = (e.clientX - rect.left - 10) + 'px';
        ripple.style.top = (e.clientY - rect.top - 10) + 'px';

        card.style.position = 'relative';
        card.style.overflow = 'hidden';
        card.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(10);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
