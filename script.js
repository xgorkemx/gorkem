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

// ========== NEW FEATURES ==========

// Modal Management
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target.id);
    }
});

// ========== QIBLA COMPASS ==========
let qiblaAngle = 0;
let userLat = 0;
let userLng = 0;
let compassSupported = false;
let compassHeading = 0;

// Kaaba coordinates
const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

// Calculate Qibla direction
function calculateQiblaAngle(lat, lng) {
    const latRad = lat * Math.PI / 180;
    const lngRad = lng * Math.PI / 180;
    const kaabaLatRad = KAABA_LAT * Math.PI / 180;
    const kaabaLngRad = KAABA_LNG * Math.PI / 180;

    const dLng = kaabaLngRad - lngRad;

    const y = Math.sin(dLng) * Math.cos(kaabaLatRad);
    const x = Math.cos(latRad) * Math.sin(kaabaLatRad) -
              Math.sin(latRad) * Math.cos(kaabaLatRad) * Math.cos(dLng);

    let angle = Math.atan2(y, x) * 180 / Math.PI;
    angle = (angle + 360) % 360;

    return angle;
}

// Calculate distance to Kaaba
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance);
}

// Update compass orientation
function updateCompass(heading) {
    compassHeading = heading;
    const needle = document.getElementById('compassNeedle');
    const qiblaDir = document.getElementById('qiblaDirection');

    if (needle && qiblaDir) {
        // Rotate needle to show north
        needle.style.transform = `rotate(${-heading}deg)`;
        // Rotate Kaaba icon to show Qibla direction
        qiblaDir.style.transform = `rotate(${qiblaAngle - heading}deg)`;
    }
}

// Initialize compass
function initQiblaCompass() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLat = position.coords.latitude;
                userLng = position.coords.longitude;

                qiblaAngle = calculateQiblaAngle(userLat, userLng);
                const distance = calculateDistance(userLat, userLng, KAABA_LAT, KAABA_LNG);

                document.getElementById('qiblaAngle').innerHTML =
                    `Kıble Açısı: <strong>${Math.round(qiblaAngle)}°</strong>`;
                document.getElementById('qiblaDistance').innerHTML =
                    `Kabe'ye Uzaklık: <strong>${distance.toLocaleString('tr-TR')} km</strong>`;

                // Start compass if available
                if (window.DeviceOrientationEvent) {
                    compassSupported = true;
                    window.addEventListener('deviceorientation', handleOrientation);
                } else {
                    showError('Cihazınız pusula sensörünü desteklemiyor.');
                }
            },
            (error) => {
                showError('Konum izni gerekli. Lütfen konum erişimine izin verin.');
            }
        );
    } else {
        showError('Cihazınız konum servisini desteklemiyor.');
    }
}

function handleOrientation(event) {
    let heading = event.alpha; // 0-360 degrees

    if (event.webkitCompassHeading) {
        // iOS
        heading = event.webkitCompassHeading;
    } else if (heading !== null) {
        // Android
        heading = 360 - heading;
    }

    if (heading !== null) {
        updateCompass(heading);
    }
}

// Qibla button click
document.getElementById('qiblaBtn')?.addEventListener('click', () => {
    openModal('qiblaModal');
    if (!compassSupported) {
        initQiblaCompass();
    }
});

// Calibrate button
document.getElementById('calibrateBtn')?.addEventListener('click', () => {
    initQiblaCompass();
});

// ========== TASBIH (DIGITAL COUNTER) ==========
let tasbihCount = parseInt(localStorage.getItem('tasbihCount') || '0');
let tasbihTarget = parseInt(localStorage.getItem('tasbihTarget') || '33');

function updateTasbihDisplay() {
    document.getElementById('tasbihCount').textContent = tasbihCount;
    document.querySelector('.count-label').textContent = `/ ${tasbihTarget}`;
    localStorage.setItem('tasbihCount', tasbihCount.toString());
}

// Tasbih click
document.getElementById('tasbihClickBtn')?.addEventListener('click', () => {
    tasbihCount++;
    updateTasbihDisplay();

    // Haptic feedback if available
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }

    // Check if target reached
    if (tasbihCount === tasbihTarget) {
        setTimeout(() => {
            alert(`🎉 Tebrikler! ${tasbihTarget} zikir tamamlandı!`);
        }, 100);
    }
});

// Reset tasbih
document.getElementById('tasbihReset')?.addEventListener('click', () => {
    tasbihCount = 0;
    updateTasbihDisplay();
});

// Change target
document.getElementById('tasbihTarget')?.addEventListener('click', () => {
    const targets = [33, 99, 100];
    const currentIndex = targets.indexOf(tasbihTarget);
    const nextIndex = (currentIndex + 1) % targets.length;
    tasbihTarget = targets[nextIndex];

    localStorage.setItem('tasbihTarget', tasbihTarget.toString());
    updateTasbihDisplay();

    document.getElementById('tasbihTarget').textContent = `🎯 Hedef: ${tasbihTarget}`;
});

// Tasbih button click
document.getElementById('tasbihBtn')?.addEventListener('click', () => {
    openModal('tasbihModal');
    updateTasbihDisplay();
});

// ========== NOTIFICATION SYSTEM ==========
let notificationSettings = {
    enabled: false,
    imsak: false,
    ogle: true,
    ikindi: true,
    aksam: true,
    yatsi: true,
    playAdhan: true,
    volume: 70,
    earlyWarning: 0
};

// Load notification settings
function loadNotificationSettings() {
    const saved = localStorage.getItem('notificationSettings');
    if (saved) {
        notificationSettings = { ...notificationSettings, ...JSON.parse(saved) };
    }

    // Update UI
    document.getElementById('notifyImsak').checked = notificationSettings.imsak;
    document.getElementById('notifyOgle').checked = notificationSettings.ogle;
    document.getElementById('notifyIkindi').checked = notificationSettings.ikindi;
    document.getElementById('notifyAksam').checked = notificationSettings.aksam;
    document.getElementById('notifyYatsi').checked = notificationSettings.yatsi;
    document.getElementById('playAdhan').checked = notificationSettings.playAdhan;
    document.getElementById('volumeSlider').value = notificationSettings.volume;
    document.getElementById('volumeValue').textContent = notificationSettings.volume + '%';
    document.getElementById('earlyWarning').value = notificationSettings.earlyWarning;

    updateNotificationStatus();
}

function saveNotificationSettings() {
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
}

function updateNotificationStatus() {
    const status = document.getElementById('notificationStatus');

    if (!('Notification' in window)) {
        status.innerHTML = '<p>❌ Tarayıcınız bildirimleri desteklemiyor.</p>';
        status.className = 'notification-status denied';
    } else if (Notification.permission === 'granted') {
        status.innerHTML = '<p>✅ Bildirimler aktif!</p>';
        status.className = 'notification-status granted';
        notificationSettings.enabled = true;
    } else if (Notification.permission === 'denied') {
        status.innerHTML = '<p>❌ Bildirimler engellendi. Tarayıcı ayarlarından izin verin.</p>';
        status.className = 'notification-status denied';
    } else {
        status.innerHTML = '<p>⚠️ Bildirim izni verilmedi.</p>';
        status.className = 'notification-status';
    }
}

// Request notification permission
document.getElementById('requestNotificationBtn')?.addEventListener('click', async () => {
    if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        updateNotificationStatus();

        if (permission === 'granted') {
            new Notification('Ezan Vakti Pro', {
                body: 'Bildirimler başarıyla etkinleştirildi!',
                icon: '🕌'
            });
        }
    }
});

// Save notification settings on change
document.querySelectorAll('#notificationModal input, #notificationModal select').forEach(el => {
    el.addEventListener('change', (e) => {
        const id = e.target.id;

        if (id === 'notifyImsak') notificationSettings.imsak = e.target.checked;
        if (id === 'notifyOgle') notificationSettings.ogle = e.target.checked;
        if (id === 'notifyIkindi') notificationSettings.ikindi = e.target.checked;
        if (id === 'notifyAksam') notificationSettings.aksam = e.target.checked;
        if (id === 'notifyYatsi') notificationSettings.yatsi = e.target.checked;
        if (id === 'playAdhan') notificationSettings.playAdhan = e.target.checked;
        if (id === 'volumeSlider') {
            notificationSettings.volume = parseInt(e.target.value);
            document.getElementById('volumeValue').textContent = notificationSettings.volume + '%';
        }
        if (id === 'earlyWarning') notificationSettings.earlyWarning = parseInt(e.target.value);

        saveNotificationSettings();
    });
});

// Notification button click
document.getElementById('notificationBtn')?.addEventListener('click', () => {
    openModal('notificationModal');
    loadNotificationSettings();
});

// ========== ADHAN AUDIO ==========
const adhanAudio = document.getElementById('adhanAudio');

// Update volume
document.getElementById('volumeSlider')?.addEventListener('input', (e) => {
    const volume = parseInt(e.target.value);
    if (adhanAudio) {
        adhanAudio.volume = volume / 100;
    }
});

// Test adhan sound
document.getElementById('testAdhanBtn')?.addEventListener('click', () => {
    if (adhanAudio) {
        adhanAudio.volume = notificationSettings.volume / 100;
        adhanAudio.play().catch(err => {
            showError('Ses dosyası yüklenemedi. İnternet bağlantınızı kontrol edin.');
        });
    }
});

// Play adhan at prayer time
function playAdhan() {
    if (notificationSettings.playAdhan && adhanAudio) {
        adhanAudio.volume = notificationSettings.volume / 100;
        adhanAudio.play().catch(err => console.error('Adhan play error:', err));
    }
}

// Check and send prayer notifications
function checkPrayerNotifications() {
    if (!notificationSettings.enabled || Notification.permission !== 'granted') {
        return;
    }

    const now = new Date();
    const currentTime = now.getHours() * 3600 + now.getMinutes() * 60;
    const earlyWarning = notificationSettings.earlyWarning * 60; // convert to seconds

    const prayers = [
        { name: 'İmsak', time: timeToSeconds(currentPrayerTimes.Fajr), enabled: notificationSettings.imsak },
        { name: 'Öğle', time: timeToSeconds(currentPrayerTimes.Dhuhr), enabled: notificationSettings.ogle },
        { name: 'İkindi', time: timeToSeconds(currentPrayerTimes.Asr), enabled: notificationSettings.ikindi },
        { name: 'Akşam', time: timeToSeconds(currentPrayerTimes.Maghrib), enabled: notificationSettings.aksam },
        { name: 'Yatsı', time: timeToSeconds(currentPrayerTimes.Isha), enabled: notificationSettings.yatsi }
    ];

    prayers.forEach(prayer => {
        if (prayer.enabled && prayer.time > 0) {
            const diff = prayer.time - currentTime - earlyWarning;

            // Trigger within 1 minute window
            if (diff >= 0 && diff <= 60) {
                const notificationKey = `prayer_${prayer.name}_${now.toDateString()}`;

                // Check if already notified today
                if (!sessionStorage.getItem(notificationKey)) {
                    const warningText = earlyWarning > 0 ?
                        ` (${notificationSettings.earlyWarning} dakika sonra)` : ' vakti geldi!';

                    new Notification(`🕌 ${prayer.name} Vakti`, {
                        body: `${prayer.name} namazı${warningText}`,
                        icon: '🕌',
                        tag: prayer.name
                    });

                    // Play adhan if it's prayer time (not early warning)
                    if (earlyWarning === 0) {
                        playAdhan();
                    }

                    sessionStorage.setItem(notificationKey, 'true');
                }
            }
        }
    });
}

// Check notifications every 30 seconds
setInterval(checkPrayerNotifications, 30000);

// ========== AUTO LOCATION ==========
document.getElementById('locationBtn')?.addEventListener('click', async () => {
    if (!('geolocation' in navigator)) {
        showError('Cihazınız konum servisini desteklemiyor.');
        return;
    }

    showLoading(true);

    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Fetch city name from coordinates using reverse geocoding
        const response = await fetch(
            `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=13`
        );

        if (!response.ok) {
            throw new Error('Konum bilgisi alınamadı');
        }

        const data = await response.json();

        if (data.code === 200 && data.data) {
            // Display prayer times for this location
            displayPrayerTimes(data.data.timings);
            currentPrayerTimes = data.data.timings;
            updateNextPrayer();

            // Start countdown
            if (countdownInterval) {
                clearInterval(countdownInterval);
            }
            countdownInterval = setInterval(updateNextPrayer, 1000);

            // Try to match with a city in our list
            const cityName = data.data.meta.timezone.split('/')[1] || 'İstanbul';
            document.getElementById('citySelect').value = cityName;
            localStorage.setItem('selectedCity', cityName);

            showError('📍 Konumunuz tespit edildi!');
        }

    } catch (error) {
        console.error('Location error:', error);
        showError('Konum bilgisi alınamadı. Lütfen konum erişimine izin verin.');
    } finally {
        showLoading(false);
    }
});

// Initialize on load
loadNotificationSettings();
