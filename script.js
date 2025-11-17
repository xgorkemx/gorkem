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

        // If closing qibla modal, stop AR mode
        if (modalId === 'qiblaModal' && arMode) {
            stopARMode();
        }
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

// Notification button click - Opens enhanced notifications
document.getElementById('notificationBtn')?.addEventListener('click', () => {
    openModal('notificationEnhancedModal');
    loadNotificationPresets();
});

// ========== ADHAN AUDIO ==========
const adhanAudio = document.getElementById('adhanAudio');

// Load selected adhan sound on page load
document.addEventListener('DOMContentLoaded', () => {
    const selectedSoundId = localStorage.getItem('selectedAdhanSound') || '1';
    const selectedSound = adhanSounds.find(s => s.id == selectedSoundId);
    if (selectedSound && adhanAudio) {
        adhanAudio.src = selectedSound.url;
    }
});

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

// ========== HIJRI CALENDAR ==========
function getHijriDate() {
    // Simple Hijri date calculation (approximation)
    const gregorianDate = new Date();
    const gregorianYear = gregorianDate.getFullYear();
    const gregorianMonth = gregorianDate.getMonth() + 1;
    const gregorianDay = gregorianDate.getDate();

    // Convert Gregorian to Julian Day Number
    const a = Math.floor((14 - gregorianMonth) / 12);
    const y = gregorianYear + 4800 - a;
    const m = gregorianMonth + 12 * a - 3;

    const julianDay = gregorianDay + Math.floor((153 * m + 2) / 5) +
                      365 * y + Math.floor(y / 4) -
                      Math.floor(y / 100) + Math.floor(y / 400) - 32045;

    // Convert Julian Day Number to Hijri
    const l = julianDay - 1948440 + 10632;
    const n = Math.floor((l - 1) / 10631);
    const l2 = l - 10631 * n + 354;
    const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) +
              Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
    const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
               Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;

    const hijriMonth = Math.floor((24 * l3) / 709);
    const hijriDay = l3 - Math.floor((709 * hijriMonth) / 24);
    const hijriYear = 30 * n + j - 30;

    const hijriMonthNames = [
        'Muharrem', 'Safer', 'Rebiülevvel', 'Rebiülahir',
        'Cemaziyelevvel', 'Cemaziyelahir', 'Recep', 'Şaban',
        'Ramazan', 'Şevval', 'Zilkade', 'Zilhicce'
    ];

    return `${hijriDay} ${hijriMonthNames[hijriMonth - 1]} ${hijriYear}`;
}

// Update Hijri date
function updateHijriDate() {
    const hijriDateElement = document.getElementById('hijriDate');
    if (hijriDateElement) {
        hijriDateElement.textContent = `Hicri: ${getHijriDate()}`;
    }
}

// ========== DARK/LIGHT THEME ==========
let currentTheme = localStorage.getItem('theme') || 'light';

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme();
    localStorage.setItem('theme', currentTheme);
}

function applyTheme() {
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        document.getElementById('themeIcon').textContent = '☀️';
    } else {
        document.body.classList.remove('dark-theme');
        document.getElementById('themeIcon').textContent = '🌙';
    }
}

// Theme toggle button
document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);

// ========== WIDGET MODE ==========
let widgetMode = false;

function toggleWidgetMode() {
    widgetMode = !widgetMode;
    if (widgetMode) {
        document.body.classList.add('widget-mode');
    } else {
        document.body.classList.remove('widget-mode');
    }
}

// Widget toggle button
document.getElementById('widgetToggle')?.addEventListener('click', toggleWidgetMode);

// ========== PRAYER TRACKING SYSTEM ==========
let prayerTracking = JSON.parse(localStorage.getItem('prayerTracking') || '{}');

function getTodayKey() {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

function initPrayerTracking() {
    const todayKey = getTodayKey();
    if (!prayerTracking[todayKey]) {
        prayerTracking[todayKey] = {
            imsak: false,
            ogle: false,
            ikindi: false,
            aksam: false,
            yatsi: false
        };
    }
}

function savePrayerTracking() {
    localStorage.setItem('prayerTracking', JSON.stringify(prayerTracking));
}

function togglePrayerCheck(prayer) {
    const todayKey = getTodayKey();
    initPrayerTracking();

    prayerTracking[todayKey][prayer] = !prayerTracking[todayKey][prayer];
    savePrayerTracking();
    updatePrayerTrackingUI();
    updateTrackingStats();

    // Haptic feedback
    if (navigator.vibrate) {
        navigator.vibrate(30);
    }
}

function updatePrayerTrackingUI() {
    const todayKey = getTodayKey();
    initPrayerTracking();

    const prayers = ['imsak', 'ogle', 'ikindi', 'aksam', 'yatsi'];
    prayers.forEach(prayer => {
        const button = document.querySelector(`[data-prayer="${prayer}"] .check-btn`);
        const item = document.querySelector(`.prayer-track-item[data-prayer="${prayer}"]`);
        const icon = button?.querySelector('.check-icon');

        if (prayerTracking[todayKey][prayer]) {
            button?.classList.add('checked');
            item?.classList.add('completed');
            if (icon) icon.textContent = '✅';
        } else {
            button?.classList.remove('checked');
            item?.classList.remove('completed');
            if (icon) icon.textContent = '⭕';
        }
    });

    // Update prayer times in tracking modal
    if (currentPrayerTimes && Object.keys(currentPrayerTimes).length > 0) {
        document.getElementById('trackImsakTime').textContent = formatTime(currentPrayerTimes.Fajr);
        document.getElementById('trackOgleTime').textContent = formatTime(currentPrayerTimes.Dhuhr);
        document.getElementById('trackIkindiTime').textContent = formatTime(currentPrayerTimes.Asr);
        document.getElementById('trackAksamTime').textContent = formatTime(currentPrayerTimes.Maghrib);
        document.getElementById('trackYatsiTime').textContent = formatTime(currentPrayerTimes.Isha);
    }
}

function updateTrackingStats() {
    const todayKey = getTodayKey();
    initPrayerTracking();

    // Today's count
    const todayPrayers = Object.values(prayerTracking[todayKey]).filter(v => v).length;
    document.getElementById('todayCount').textContent = `${todayPrayers}/5`;

    // Week count
    const today = new Date();
    let weekCount = 0;
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        if (prayerTracking[key]) {
            weekCount += Object.values(prayerTracking[key]).filter(v => v).length;
        }
    }
    document.getElementById('weekCount').textContent = `${weekCount}/35`;

    // Month count
    const year = today.getFullYear();
    const month = today.getMonth();
    let monthCount = 0;
    Object.keys(prayerTracking).forEach(key => {
        const [y, m] = key.split('-').map(Number);
        if (y === year && m === month + 1) {
            monthCount += Object.values(prayerTracking[key]).filter(v => v).length;
        }
    });
    document.getElementById('monthCount').textContent = monthCount;

    // Update motivation message
    updateMotivationMessage(todayPrayers);

    // Update weekly calendar
    updateWeeklyCalendar();
}

function updateMotivationMessage(count) {
    const messages = [
        '💪 Allah kabul etsin! Namazlarınızı işaretleyerek takip edin.',
        '🌟 Harika! Bir namaz daha kıldınız. Devam edin!',
        '🎯 Yarı yoldasınız! Allah kabul etsin.',
        '🔥 Neredeyse tamam! Bir kaç namaz kaldı.',
        '✨ Mükemmel! Bugünkü tüm namazlar tamamlandı. Allah razı olsun!',
        '🏆 Muhteşem! Bugünün tüm namazlarını kıldınız!'
    ];

    const messageElement = document.getElementById('motivationMessage');
    if (messageElement) {
        messageElement.textContent = messages[Math.min(count, 5)];
    }
}

function updateWeeklyCalendar() {
    const calendar = document.getElementById('weeklyCalendar');
    if (!calendar) return;

    calendar.innerHTML = '';
    const today = new Date();
    const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

        const dayCard = document.createElement('div');
        dayCard.className = 'day-card';
        if (i === 0) dayCard.classList.add('today');

        const dayName = document.createElement('div');
        dayName.className = 'day-name';
        dayName.textContent = dayNames[date.getDay()];

        const dayDate = document.createElement('div');
        dayDate.className = 'day-date';
        dayDate.textContent = date.getDate();

        const dayProgress = document.createElement('div');
        dayProgress.className = 'day-progress';

        const prayers = ['imsak', 'ogle', 'ikindi', 'aksam', 'yatsi'];
        prayers.forEach(prayer => {
            const dot = document.createElement('div');
            dot.className = 'prayer-dot';
            if (prayerTracking[key] && prayerTracking[key][prayer]) {
                dot.classList.add('completed');
            }
            dayProgress.appendChild(dot);
        });

        dayCard.appendChild(dayName);
        dayCard.appendChild(dayDate);
        dayCard.appendChild(dayProgress);
        calendar.appendChild(dayCard);
    }
}

// Prayer tracking button click
document.getElementById('prayerTrackBtn')?.addEventListener('click', () => {
    openModal('prayerTrackModal');
    updatePrayerTrackingUI();
    updateTrackingStats();
});

// Check button click handlers
document.querySelectorAll('.check-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        const prayer = button.closest('.prayer-track-item').dataset.prayer;
        togglePrayerCheck(prayer);
    });
});

// Initialize theme and hijri date on page load
document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    updateHijriDate();
    initPrayerTracking();

    // Update hijri date daily
    setInterval(updateHijriDate, 60000); // Update every minute to catch day change
});

// ========== ESMA-UL HUSNA ==========
function loadEsmaUlHusna(searchTerm = '') {
    const esmaList = document.getElementById('esmaList');
    if (!esmaList) return;

    const filtered = esmaUlHusna.filter(item => {
        const search = searchTerm.toLowerCase();
        return item.turkish.toLowerCase().includes(search) ||
               item.meaning.toLowerCase().includes(search) ||
               item.arabic.includes(search);
    });

    esmaList.innerHTML = filtered.map(item => `
        <div class="esma-item">
            <div class="esma-item-header">
                <div class="esma-number">${item.id}</div>
                <div class="esma-arabic">${item.arabic}</div>
            </div>
            <div class="esma-turkish">${item.turkish}</div>
            <div class="esma-meaning">${item.meaning}</div>
        </div>
    `).join('');
}

// Esma button click
document.getElementById('esmaBtn')?.addEventListener('click', () => {
    openModal('esmaModal');
    loadEsmaUlHusna();
});

// Esma search
document.getElementById('esmaSearch')?.addEventListener('input', (e) => {
    loadEsmaUlHusna(e.target.value);
});

// ========== PRAYER BOOK ==========
let currentPrayerCategory = 'daily';

function loadPrayerBook(category = 'daily') {
    const prayerBookList = document.getElementById('prayerBookList');
    if (!prayerBookList) return;

    const categoryPrayers = prayers[category] || [];

    prayerBookList.innerHTML = categoryPrayers.map(prayer => `
        <div class="prayer-item">
            <div class="prayer-item-header">
                <div class="prayer-name">${prayer.name}</div>
                <div class="prayer-category">${prayer.category}</div>
            </div>
            <div class="prayer-arabic">${prayer.arabic}</div>
            <div class="prayer-turkish">${prayer.turkish}</div>
            <div class="prayer-latin">${prayer.latin}</div>
        </div>
    `).join('');
}

// Prayer book button click
document.getElementById('prayerBookBtn')?.addEventListener('click', () => {
    openModal('prayerBookModal');
    loadPrayerBook(currentPrayerCategory);
});

// Prayer tabs
document.querySelectorAll('.prayer-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
        // Remove active class from all tabs
        document.querySelectorAll('.prayer-tab').forEach(t => t.classList.remove('active'));

        // Add active class to clicked tab
        e.target.classList.add('active');

        // Load prayers for selected category
        const category = e.target.dataset.category;
        currentPrayerCategory = category;
        loadPrayerBook(category);
    });
});

// ========== SHORT SURAHS ==========
function loadShortSurahs() {
    const surahList = document.getElementById('surahList');
    if (!surahList) return;

    surahList.innerHTML = shortSurahs.map(surah => `
        <div class="surah-item">
            <div class="surah-header">
                <div class="surah-info">
                    <div class="surah-name">${surah.name} Suresi</div>
                    <div class="surah-meta">Sure No: ${surah.number} | ${surah.ayah_count} Ayet</div>
                </div>
                <div class="surah-number">${surah.number}</div>
            </div>
            <div class="surah-arabic">${surah.arabic}</div>
            <div class="surah-turkish">${surah.turkish}</div>
        </div>
    `).join('');
}

// Surah button click
document.getElementById('surahBtn')?.addEventListener('click', () => {
    openModal('surahModal');
    loadShortSurahs();
});

// ========== CATEGORY F: UX FEATURES ==========

// ========== FAVORITES SYSTEM ==========
const FAVORITES_KEY = 'ezanvakti_favorites';

// Get favorites from localStorage
function getFavorites() {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : {
        prayers: [],
        surahs: [],
        esma: []
    };
}

// Save favorites to localStorage
function saveFavorites(favorites) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

// Toggle favorite
function toggleFavorite(type, id) {
    const favorites = getFavorites();
    const index = favorites[type].indexOf(id);

    if (index === -1) {
        favorites[type].push(id);
    } else {
        favorites[type].splice(index, 1);
    }

    saveFavorites(favorites);
    return index === -1; // Return true if favorited, false if unfavorited
}

// Check if item is favorited
function isFavorited(type, id) {
    const favorites = getFavorites();
    return favorites[type].includes(id);
}

// ========== SHARE FUNCTIONALITY ==========
async function shareContent(title, text) {
    if (navigator.share) {
        try {
            await navigator.share({
                title: title,
                text: text,
                url: window.location.href
            });
            console.log('Content shared successfully');
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.log('Error sharing:', err);
                fallbackCopyToClipboard(text);
            }
        }
    } else {
        fallbackCopyToClipboard(text);
    }
}

// Fallback copy to clipboard
function fallbackCopyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    try {
        document.execCommand('copy');
        showMessage('Panoya kopyalandı!', 'success');
    } catch (err) {
        showMessage('Kopyalama başarısız', 'error');
    }

    document.body.removeChild(textarea);
}

// ========== TEXT-TO-SPEECH ==========
let speechSynthesis = window.speechSynthesis;
let currentUtterance = null;

function speakArabic(text) {
    // Stop any ongoing speech
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        return false; // Indicate that we stopped
    }

    currentUtterance = new SpeechSynthesisUtterance(text);

    // Try to find Arabic voice, fallback to default
    const voices = speechSynthesis.getVoices();
    const arabicVoice = voices.find(voice => voice.lang.startsWith('ar'));

    if (arabicVoice) {
        currentUtterance.voice = arabicVoice;
    }

    currentUtterance.lang = 'ar-SA';
    currentUtterance.rate = 0.8; // Slower for clarity
    currentUtterance.pitch = 1;

    speechSynthesis.speak(currentUtterance);
    return true; // Indicate that we started speaking
}

// Load voices (some browsers load them asynchronously)
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => {
        speechSynthesis.getVoices();
    };
}

// ========== VIBRATION PATTERNS ==========
const VIBRATION_PATTERNS = {
    short: [100],
    double: [100, 50, 100],
    triple: [100, 50, 100, 50, 100],
    long: [300],
    pulse: [50, 50, 50, 50, 50]
};

function vibrate(pattern = 'short') {
    if (!navigator.vibrate) return;

    const vibrationEnabled = localStorage.getItem('vibrationEnabled') !== 'false';
    if (!vibrationEnabled) return;

    const selectedPattern = localStorage.getItem('vibrationPattern') || 'short';
    navigator.vibrate(VIBRATION_PATTERNS[selectedPattern] || VIBRATION_PATTERNS.short);
}

// ========== CUSTOMIZABLE HOME SCREEN ==========
const WIDGET_ORDER_KEY = 'ezanvakti_widget_order';
const HIDDEN_WIDGETS_KEY = 'ezanvakti_hidden_widgets';

function getWidgetOrder() {
    const stored = localStorage.getItem(WIDGET_ORDER_KEY);
    return stored ? JSON.parse(stored) : [
        'qiblaBtn', 'tasbihBtn', 'trackBtn', 'notificationBtn',
        'locationBtn', 'esmaBtn', 'prayerBookBtn', 'surahBtn',
        'ramadanBtn', 'alarmBtn', 'adhanSettingsBtn',
        'hadithBtn', 'fortyHadithBtn', 'storiesBtn', 'eventsBtn', 'juzBtn'
    ];
}

function getHiddenWidgets() {
    const stored = localStorage.getItem(HIDDEN_WIDGETS_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveWidgetOrder(order) {
    localStorage.setItem(WIDGET_ORDER_KEY, JSON.stringify(order));
}

function saveHiddenWidgets(hidden) {
    localStorage.setItem(HIDDEN_WIDGETS_KEY, JSON.stringify(hidden));
}

function applyWidgetCustomization() {
    const order = getWidgetOrder();
    const hidden = getHiddenWidgets();
    const container = document.querySelector('.feature-buttons');

    if (!container) return;

    // Reorder buttons
    order.forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            container.appendChild(btn);

            // Hide if in hidden list
            if (hidden.includes(btnId)) {
                btn.style.display = 'none';
            } else {
                btn.style.display = '';
            }
        }
    });
}

function toggleWidgetVisibility(widgetId) {
    const hidden = getHiddenWidgets();
    const index = hidden.indexOf(widgetId);

    if (index === -1) {
        hidden.push(widgetId);
    } else {
        hidden.splice(index, 1);
    }

    saveHiddenWidgets(hidden);
    applyWidgetCustomization();
}

// ========== UPDATE CONTENT LOADING WITH UX FEATURES ==========

// Enhanced Esma loading with favorites and actions
function loadEsmaUlHusna(searchTerm = '') {
    const esmaList = document.getElementById('esmaList');
    if (!esmaList) return;

    const filtered = esmaUlHusna.filter(item => {
        const search = searchTerm.toLowerCase();
        return item.turkish.toLowerCase().includes(search) ||
               item.meaning.toLowerCase().includes(search) ||
               item.arabic.includes(search);
    });

    esmaList.innerHTML = filtered.map(item => {
        const favorited = isFavorited('esma', item.id);
        return `
            <div class="esma-item">
                <div class="esma-item-header">
                    <div class="esma-number">${item.id}</div>
                    <div class="esma-arabic">${item.arabic}</div>
                </div>
                <div class="esma-turkish">${item.turkish}</div>
                <div class="esma-meaning">${item.meaning}</div>
                <div class="item-actions">
                    <button class="action-btn favorite-btn ${favorited ? 'favorited' : ''}"
                            onclick="handleFavorite('esma', ${item.id}, this)"
                            title="Favorilere ekle">
                        <span class="action-icon">${favorited ? '⭐' : '☆'}</span>
                    </button>
                    <button class="action-btn speak-btn"
                            onclick="handleSpeak('${item.arabic.replace(/'/g, "\\'")}', this)"
                            title="Sesli oku">
                        <span class="action-icon">🔊</span>
                    </button>
                    <button class="action-btn share-btn"
                            onclick="handleShare('${item.turkish}', '${item.arabic}\\n${item.meaning}')"
                            title="Paylaş">
                        <span class="action-icon">📤</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Enhanced Prayer Book loading
function loadPrayerBook(category = 'daily') {
    const prayerBookList = document.getElementById('prayerBookList');
    if (!prayerBookList) return;

    const categoryPrayers = prayers[category] || [];

    prayerBookList.innerHTML = categoryPrayers.map(prayer => {
        const favorited = isFavorited('prayers', prayer.id);
        return `
            <div class="prayer-item">
                <div class="prayer-item-header">
                    <div class="prayer-name">${prayer.name}</div>
                    <div class="prayer-category">${prayer.category}</div>
                </div>
                <div class="prayer-arabic">${prayer.arabic}</div>
                <div class="prayer-turkish">${prayer.turkish}</div>
                <div class="prayer-latin">${prayer.latin}</div>
                <div class="item-actions">
                    <button class="action-btn favorite-btn ${favorited ? 'favorited' : ''}"
                            onclick="handleFavorite('prayers', ${prayer.id}, this)"
                            title="Favorilere ekle">
                        <span class="action-icon">${favorited ? '⭐' : '☆'}</span>
                    </button>
                    <button class="action-btn speak-btn"
                            onclick="handleSpeak('${prayer.arabic.replace(/'/g, "\\'")}', this)"
                            title="Sesli oku">
                        <span class="action-icon">🔊</span>
                    </button>
                    <button class="action-btn share-btn"
                            onclick="handleShare('${prayer.name}', '${prayer.arabic}\\n\\n${prayer.turkish}\\n\\n${prayer.latin}')"
                            title="Paylaş">
                        <span class="action-icon">📤</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Enhanced Surah loading
function loadShortSurahs() {
    const surahList = document.getElementById('surahList');
    if (!surahList) return;

    surahList.innerHTML = shortSurahs.map(surah => {
        const favorited = isFavorited('surahs', surah.id);
        return `
            <div class="surah-item">
                <div class="surah-header">
                    <div class="surah-info">
                        <div class="surah-name">${surah.name} Suresi</div>
                        <div class="surah-meta">Sure No: ${surah.number} | ${surah.ayah_count} Ayet</div>
                    </div>
                    <div class="surah-number">${surah.number}</div>
                </div>
                <div class="surah-arabic">${surah.arabic}</div>
                <div class="surah-turkish">${surah.turkish}</div>
                <div class="item-actions">
                    <button class="action-btn favorite-btn ${favorited ? 'favorited' : ''}"
                            onclick="handleFavorite('surahs', ${surah.id}, this)"
                            title="Favorilere ekle">
                        <span class="action-icon">${favorited ? '⭐' : '☆'}</span>
                    </button>
                    <button class="action-btn speak-btn"
                            onclick="handleSpeak('${surah.arabic.replace(/'/g, "\\'").replace(/\n/g, ' ')}', this)"
                            title="Sesli oku">
                        <span class="action-icon">🔊</span>
                    </button>
                    <button class="action-btn share-btn"
                            onclick="handleShare('${surah.name} Suresi', '${surah.arabic}\\n\\n${surah.turkish}')"
                            title="Paylaş">
                        <span class="action-icon">📤</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// ========== ACTION HANDLERS ==========
function handleFavorite(type, id, button) {
    vibrate('short');
    const isFav = toggleFavorite(type, id);

    // Update button appearance
    const icon = button.querySelector('.action-icon');
    if (isFav) {
        button.classList.add('favorited');
        icon.textContent = '⭐';
    } else {
        button.classList.remove('favorited');
        icon.textContent = '☆';
    }
}

function handleSpeak(text, button) {
    vibrate('short');
    const icon = button.querySelector('.action-icon');

    const isSpeaking = speakArabic(text);

    if (isSpeaking) {
        icon.textContent = '🔇';
        button.classList.add('speaking');

        // Reset button when speech ends
        if (currentUtterance) {
            currentUtterance.onend = () => {
                icon.textContent = '🔊';
                button.classList.remove('speaking');
            };
        }
    } else {
        icon.textContent = '🔊';
        button.classList.remove('speaking');
    }
}

function handleShare(title, text) {
    vibrate('short');
    shareContent(title, text);
}

// Show success/error message
function showMessage(message, type = 'info') {
    const existingMsg = document.querySelector('.toast-message');
    if (existingMsg) {
        existingMsg.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast-message toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Settings button handler
document.getElementById('settingsBtn')?.addEventListener('click', () => {
    openModal('settingsModal');
    loadSettings();
});

// Load settings UI
function loadSettings() {
    const vibrationEnabled = localStorage.getItem('vibrationEnabled') !== 'false';
    const vibrationPattern = localStorage.getItem('vibrationPattern') || 'short';

    document.getElementById('vibrationToggle').checked = vibrationEnabled;
    document.getElementById('vibrationPattern').value = vibrationPattern;

    // Load widget customization
    loadWidgetCustomization();
}

// Save settings
function saveSettings() {
    const vibrationEnabled = document.getElementById('vibrationToggle').checked;
    const vibrationPattern = document.getElementById('vibrationPattern').value;

    localStorage.setItem('vibrationEnabled', vibrationEnabled);
    localStorage.setItem('vibrationPattern', vibrationPattern);

    showMessage('Ayarlar kaydedildi', 'success');
}

// Load widget customization UI
function loadWidgetCustomization() {
    const widgetList = document.getElementById('widgetList');
    if (!widgetList) return;

    const order = getWidgetOrder();
    const hidden = getHiddenWidgets();

    const widgetNames = {
        'qiblaBtn': 'Kıble',
        'tasbihBtn': 'Tesbih',
        'trackBtn': 'Takip',
        'notificationBtn': 'Bildirim',
        'locationBtn': 'Konum',
        'esmaBtn': '99 İsim',
        'prayerBookBtn': 'Dualar',
        'surahBtn': 'Sureler',
        'ramadanBtn': 'Ramazan',
        'alarmBtn': 'Alarmlar',
        'adhanSettingsBtn': 'Ezan',
        'hadithBtn': 'Günlük Hadis',
        'fortyHadithBtn': '40 Hadis',
        'storiesBtn': 'Kıssalar',
        'eventsBtn': 'Dini Günler',
        'juzBtn': 'Cüz Takibi'
    };

    widgetList.innerHTML = order.map(btnId => {
        const isHidden = hidden.includes(btnId);
        return `
            <div class="widget-item" data-widget-id="${btnId}">
                <span class="widget-drag-handle">⋮⋮</span>
                <span class="widget-name">${widgetNames[btnId] || btnId}</span>
                <label class="widget-toggle">
                    <input type="checkbox" ${!isHidden ? 'checked' : ''}
                           onchange="toggleWidgetVisibility('${btnId}')">
                    <span class="toggle-slider"></span>
                </label>
            </div>
        `;
    }).join('');
}

// Apply customization on page load
document.addEventListener('DOMContentLoaded', () => {
    applyWidgetCustomization();
});

// ========== CATEGORY A: ADVANCED FEATURES ==========

// ========== RAMADAN CALENDAR ==========
const RAMADAN_KEY = 'ezanvakti_ramadan_data';

// Check if today is in Ramadan
function isRamadan() {
    const hijriDate = getCurrentHijriDate();
    return hijriDate.month === 9; // Ramadan is 9th month
}

// Get Ramadan day (1-30)
function getRamadanDay() {
    if (!isRamadan()) return 0;
    const hijriDate = getCurrentHijriDate();
    return hijriDate.day;
}

// Calculate Ramadan times
function loadRamadanCalendar() {
    const container = document.getElementById('ramadanCalendar');
    if (!container) return;

    const hijriDate = getCurrentHijriDate();
    const isRamadanMonth = hijriDate.month === 9;

    if (!isRamadanMonth) {
        container.innerHTML = `
            <div class="ramadan-info-box">
                <div class="ramadan-icon">🌙</div>
                <h3>Ramazan Ayı Değil</h3>
                <p>Şu anda Ramazan ayında değiliz.</p>
                <p class="hijri-info">Hicri Tarih: ${hijriDate.day} ${getHijriMonthName(hijriDate.month)} ${hijriDate.year}</p>
            </div>
        `;
        return;
    }

    const ramadanDay = hijriDate.day;
    const daysLeft = 30 - ramadanDay;

    // Get today's prayer times for iftar and sahur
    const imsak = document.getElementById('imsak')?.textContent || '--:--';
    const aksam = document.getElementById('aksam')?.textContent || '--:--';

    container.innerHTML = `
        <div class="ramadan-header">
            <div class="ramadan-day-circle">
                <span class="ramadan-day-number">${ramadanDay}</span>
                <span class="ramadan-day-label">/30</span>
            </div>
            <div class="ramadan-title">
                <h3>🌙 Ramazan Mübarek</h3>
                <p>${daysLeft} gün kaldı</p>
            </div>
        </div>

        <div class="ramadan-times">
            <div class="ramadan-time-card iftar-card">
                <div class="time-icon">🌆</div>
                <div class="time-info">
                    <div class="time-label">İftar Vakti</div>
                    <div class="time-value">${aksam}</div>
                    <div class="time-countdown" id="iftarCountdown">--:--:--</div>
                </div>
            </div>

            <div class="ramadan-time-card sahur-card">
                <div class="time-icon">🌅</div>
                <div class="time-info">
                    <div class="time-label">İmsak (Sahur Sonu)</div>
                    <div class="time-value">${imsak}</div>
                    <div class="time-note">Sahur yemeği imsak vaktinden önce bitirilmelidir</div>
                </div>
            </div>
        </div>

        <div class="ramadan-progress">
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${(ramadanDay/30)*100}%"></div>
            </div>
            <div class="progress-label">${ramadanDay}. Gün tamamlandı</div>
        </div>
    `;

    // Start iftar countdown
    startIftarCountdown();
}

// Iftar countdown
function startIftarCountdown() {
    const countdownEl = document.getElementById('iftarCountdown');
    if (!countdownEl) return;

    setInterval(() => {
        const aksam = document.getElementById('aksam')?.textContent;
        if (!aksam || aksam === '--:--') return;

        const [hours, minutes] = aksam.split(':').map(Number);
        const now = new Date();
        const target = new Date(now);
        target.setHours(hours, minutes, 0);

        // If target is past, set to tomorrow
        if (target < now) {
            target.setDate(target.getDate() + 1);
        }

        const diff = target - now;
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);

        countdownEl.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }, 1000);
}

// ========== FRIDAY REMINDER ==========
function checkFridayReminder() {
    const now = new Date();
    const day = now.getDay();

    // Check if it's Friday (5)
    if (day === 5) {
        const jumuah = document.getElementById('ogle')?.textContent;
        if (!jumuah || jumuah === '--:--') return;

        const [hours, minutes] = jumuah.split(':').map(Number);
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        const currentTime = currentHours * 60 + currentMinutes;
        const jumuahTime = hours * 60 + minutes;

        // Remind 1 hour before Jumuah
        const diff = jumuahTime - currentTime;

        const fridayReminderShown = sessionStorage.getItem('fridayReminderShown');

        if (diff <= 60 && diff > 0 && !fridayReminderShown) {
            showFridayReminder();
            sessionStorage.setItem('fridayReminderShown', 'true');
        }
    }
}

function showFridayReminder() {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'granted') {
        vibrate('triple');
        new Notification('🕌 Cuma Namazı Hatırlatma', {
            body: 'Cuma namazına 1 saatten az kaldı. Hazırlıklarınızı yapabilirsiniz.',
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            tag: 'friday-reminder'
        });
    }

    showMessage('🕌 Cuma namazına 1 saatten az kaldı!', 'info');
}

// Check Friday reminder every minute
setInterval(checkFridayReminder, 60000);
checkFridayReminder(); // Check immediately

// ========== PRAYER TIME ALARMS ==========
const ALARMS_KEY = 'ezanvakti_alarms';

// Get alarm settings
function getAlarmSettings() {
    const stored = localStorage.getItem(ALARMS_KEY);
    return stored ? JSON.parse(stored) : {
        imsak: { enabled: false, beforeMinutes: 0 },
        gunes: { enabled: false, beforeMinutes: 0 },
        ogle: { enabled: false, beforeMinutes: 0 },
        ikindi: { enabled: false, beforeMinutes: 0 },
        aksam: { enabled: false, beforeMinutes: 0 },
        yatsi: { enabled: false, beforeMinutes: 0 }
    };
}

// Save alarm settings
function saveAlarmSettings(settings) {
    localStorage.setItem(ALARMS_KEY, JSON.stringify(settings));
}

// Load alarm settings UI
function loadAlarmSettings() {
    const container = document.getElementById('alarmSettings');
    if (!container) return;

    const settings = getAlarmSettings();
    const prayers = [
        { key: 'imsak', name: 'İmsak', icon: '🌅' },
        { key: 'gunes', name: 'Güneş', icon: '☀️' },
        { key: 'ogle', name: 'Öğle', icon: '🌞' },
        { key: 'ikindi', name: 'İkindi', icon: '🌤️' },
        { key: 'aksam', name: 'Akşam', icon: '🌆' },
        { key: 'yatsi', name: 'Yatsı', icon: '🌙' }
    ];

    container.innerHTML = prayers.map(prayer => {
        const setting = settings[prayer.key];
        return `
            <div class="alarm-item">
                <div class="alarm-header">
                    <span class="alarm-icon">${prayer.icon}</span>
                    <span class="alarm-name">${prayer.name}</span>
                    <label class="toggle-switch">
                        <input type="checkbox"
                               ${setting.enabled ? 'checked' : ''}
                               onchange="toggleAlarm('${prayer.key}', this.checked)">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                ${setting.enabled ? `
                    <div class="alarm-options">
                        <label>
                            <span>Kaç dakika önce:</span>
                            <select onchange="setAlarmBefore('${prayer.key}', this.value)" class="alarm-select">
                                <option value="0" ${setting.beforeMinutes === 0 ? 'selected' : ''}>Tam vaktinde</option>
                                <option value="5" ${setting.beforeMinutes === 5 ? 'selected' : ''}>5 dk önce</option>
                                <option value="10" ${setting.beforeMinutes === 10 ? 'selected' : ''}>10 dk önce</option>
                                <option value="15" ${setting.beforeMinutes === 15 ? 'selected' : ''}>15 dk önce</option>
                                <option value="30" ${setting.beforeMinutes === 30 ? 'selected' : ''}>30 dk önce</option>
                            </select>
                        </label>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

function toggleAlarm(prayer, enabled) {
    vibrate('short');
    const settings = getAlarmSettings();
    settings[prayer].enabled = enabled;
    saveAlarmSettings(settings);
    loadAlarmSettings();
}

function setAlarmBefore(prayer, minutes) {
    const settings = getAlarmSettings();
    settings[prayer].beforeMinutes = parseInt(minutes);
    saveAlarmSettings(settings);
    showMessage('Alarm ayarlandı', 'success');
}

// Check alarms every minute
function checkAlarms() {
    const settings = getAlarmSettings();
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    Object.keys(settings).forEach(prayer => {
        const setting = settings[prayer];
        if (!setting.enabled) return;

        const prayerTimeEl = document.getElementById(prayer);
        if (!prayerTimeEl) return;

        const prayerTime = prayerTimeEl.textContent;
        if (!prayerTime || prayerTime === '--:--') return;

        const [hours, minutes] = prayerTime.split(':').map(Number);
        const prayerMinutes = hours * 60 + minutes;
        const alarmTime = prayerMinutes - setting.beforeMinutes;

        // Check if it's alarm time (within this minute)
        if (currentTime === alarmTime) {
            triggerAlarm(prayer, setting.beforeMinutes);
        }
    });
}

function triggerAlarm(prayer, beforeMinutes) {
    const alarmKey = `alarm_${prayer}_${new Date().toDateString()}`;
    if (sessionStorage.getItem(alarmKey)) return; // Already triggered today

    sessionStorage.setItem(alarmKey, 'true');

    vibrate('triple');

    const prayerNames = {
        imsak: 'İmsak',
        gunes: 'Güneş',
        ogle: 'Öğle',
        ikindi: 'İkindi',
        aksam: 'Akşam',
        yatsi: 'Yatsı'
    };

    const message = beforeMinutes > 0
        ? `${prayerNames[prayer]} namazına ${beforeMinutes} dakika kaldı!`
        : `${prayerNames[prayer]} namazı vakti girdi!`;

    if (Notification.permission === 'granted') {
        new Notification('⏰ Namaz Vakti Alarmı', {
            body: message,
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            tag: `alarm-${prayer}`,
            vibrate: [200, 100, 200]
        });
    }

    showMessage(message, 'info');

    // Play alarm sound
    const audio = document.getElementById('adhanAudio');
    if (audio && beforeMinutes === 0) {
        audio.play().catch(e => console.log('Audio play failed:', e));
    }
}

setInterval(checkAlarms, 60000);

// ========== AR QIBLA COMPASS ==========
let arMode = false;
let videoStream = null;

async function toggleARQibla() {
    const arContainer = document.getElementById('arContainer');
    const arButton = document.getElementById('arToggleBtn');

    if (!arContainer || !arButton) return;

    if (!arMode) {
        try {
            // Request camera access
            videoStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });

            const video = document.getElementById('arVideo');
            video.srcObject = videoStream;

            arContainer.style.display = 'flex';
            arButton.textContent = '📷 AR Modunu Kapat';
            arMode = true;

            vibrate('short');
            showMessage('AR modu aktif', 'success');
        } catch (err) {
            console.error('Camera access denied:', err);
            showMessage('Kamera erişimi reddedildi', 'error');
        }
    } else {
        stopARMode();
    }
}

function stopARMode() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
    }

    const arContainer = document.getElementById('arContainer');
    const arButton = document.getElementById('arToggleBtn');

    if (arContainer) arContainer.style.display = 'none';
    if (arButton) arButton.textContent = '📷 AR Modunu Aç';

    arMode = false;
}

// ========== VOICE ADHAN SETTINGS ==========
const ADHAN_SETTINGS_KEY = 'ezanvakti_adhan_settings';

function getAdhanSettings() {
    const stored = localStorage.getItem(ADHAN_SETTINGS_KEY);
    return stored ? JSON.parse(stored) : {
        enabled: true,
        volume: 0.7,
        prayers: {
            imsak: true,
            gunes: false,
            ogle: true,
            ikindi: true,
            aksam: true,
            yatsi: true
        },
        sound: 'default'
    };
}

function saveAdhanSettings(settings) {
    localStorage.setItem(ADHAN_SETTINGS_KEY, JSON.stringify(settings));
}

function loadAdhanSettings() {
    const container = document.getElementById('adhanSettingsContainer');
    if (!container) return;

    const settings = getAdhanSettings();

    container.innerHTML = `
        <div class="adhan-settings-section">
            <div class="setting-item">
                <div class="setting-label">
                    <span>Otomatik Ezan</span>
                    <p class="setting-description">Vakit girdiğinde ezan okunsun</p>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="adhanEnabled"
                           ${settings.enabled ? 'checked' : ''}
                           onchange="updateAdhanEnabled(this.checked)">
                    <span class="toggle-slider"></span>
                </label>
            </div>

            <div class="setting-item">
                <div class="setting-label">
                    <span>Ses Seviyesi</span>
                    <p class="setting-description">Ezan ses yüksekliği</p>
                </div>
                <input type="range" id="adhanVolume"
                       min="0" max="100" value="${settings.volume * 100}"
                       onchange="updateAdhanVolume(this.value)"
                       class="volume-slider">
            </div>
        </div>

        <div class="adhan-prayers-section">
            <h4>Hangi Vakitlerde Ezan Okusun?</h4>
            <div class="adhan-prayers-list">
                ${Object.keys(settings.prayers).map(prayer => {
                    const names = {
                        imsak: '🌅 İmsak',
                        gunes: '☀️ Güneş',
                        ogle: '🌞 Öğle',
                        ikindi: '🌤️ İkindi',
                        aksam: '🌆 Akşam',
                        yatsi: '🌙 Yatsı'
                    };
                    return `
                        <div class="adhan-prayer-item">
                            <span>${names[prayer]}</span>
                            <label class="toggle-switch">
                                <input type="checkbox"
                                       ${settings.prayers[prayer] ? 'checked' : ''}
                                       onchange="updateAdhanPrayer('${prayer}', this.checked)">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function updateAdhanEnabled(enabled) {
    const settings = getAdhanSettings();
    settings.enabled = enabled;
    saveAdhanSettings(settings);
    vibrate('short');
    showMessage(enabled ? 'Otomatik ezan açıldı' : 'Otomatik ezan kapatıldı', 'success');
}

function updateAdhanVolume(value) {
    const settings = getAdhanSettings();
    settings.volume = value / 100;
    saveAdhanSettings(settings);

    const audio = document.getElementById('adhanAudio');
    if (audio) audio.volume = settings.volume;
}

function updateAdhanPrayer(prayer, enabled) {
    const settings = getAdhanSettings();
    settings.prayers[prayer] = enabled;
    saveAdhanSettings(settings);
    vibrate('short');
}

// Auto-play adhan at prayer time
function checkAdhanTime() {
    const settings = getAdhanSettings();
    if (!settings.enabled) return;

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    Object.keys(settings.prayers).forEach(prayer => {
        if (!settings.prayers[prayer]) return;

        const prayerTimeEl = document.getElementById(prayer);
        if (!prayerTimeEl) return;

        const prayerTime = prayerTimeEl.textContent;
        if (prayerTime === currentTime) {
            const adhanKey = `adhan_${prayer}_${new Date().toDateString()}`;
            if (!sessionStorage.getItem(adhanKey)) {
                playAdhan();
                sessionStorage.setItem(adhanKey, 'true');
            }
        }
    });
}

function playAdhan() {
    const settings = getAdhanSettings();
    const audio = document.getElementById('adhanAudio');
    if (audio) {
        audio.volume = settings.volume;
        audio.play().catch(e => console.log('Adhan play failed:', e));
    }
}

setInterval(checkAdhanTime, 60000);

// Button handlers for advanced features
document.getElementById('ramadanBtn')?.addEventListener('click', () => {
    openModal('ramadanModal');
    loadRamadanCalendar();
});

document.getElementById('alarmBtn')?.addEventListener('click', () => {
    openModal('alarmModal');
    loadAlarmSettings();
});

document.getElementById('adhanSettingsBtn')?.addEventListener('click', () => {
    openModal('adhanModal');
    loadAdhanSettings();
});

// ========== CATEGORY B: CONTENT EXPANSION ==========

// ========== DAILY HADITH ==========
const LAST_HADITH_DATE_KEY = 'ezanvakti_last_hadith_date';

function getTodaysHadith() {
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem(LAST_HADITH_DATE_KEY);

    // Calculate index based on day of year
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const index = dayOfYear % dailyHadiths.length;

    return dailyHadiths[index];
}

function loadDailyHadith() {
    const container = document.getElementById('dailyHadithContainer');
    if (!container) {
        console.error('dailyHadithContainer not found');
        return;
    }

    // Check if dailyHadiths array exists
    if (typeof dailyHadiths === 'undefined' || !dailyHadiths || dailyHadiths.length === 0) {
        container.innerHTML = '<p style="padding: 20px; text-align: center;">Hadisler yüklenemedi.</p>';
        console.error('dailyHadiths array not found');
        return;
    }

    const hadith = getTodaysHadith();

    container.innerHTML = `
        <div class="hadith-card">
            <div class="hadith-header">
                <span class="hadith-icon">📖</span>
                <h3>Günün Hadisi</h3>
            </div>
            <div class="hadith-arabic">${hadith.arabic}</div>
            <div class="hadith-turkish">${hadith.turkish}</div>
            <div class="hadith-source">Kaynak: ${hadith.source}</div>
            <div class="hadith-explanation">
                <strong>Açıklama:</strong> ${hadith.explanation}
            </div>
            <div class="item-actions">
                <button class="action-btn favorite-btn" onclick="handleFavorite('hadith', ${hadith.id}, this)" title="Favorilere ekle">
                    <span class="action-icon">☆</span>
                </button>
                <button class="action-btn speak-btn" onclick="handleSpeak('${hadith.arabic.replace(/'/g, "\\'")}', this)" title="Sesli oku">
                    <span class="action-icon">🔊</span>
                </button>
                <button class="action-btn share-btn" onclick="handleShare('Günün Hadisi', '${hadith.arabic}\\n\\n${hadith.turkish}\\n\\nKaynak: ${hadith.source}')" title="Paylaş">
                    <span class="action-icon">📤</span>
                </button>
            </div>
        </div>
    `;
}

// ========== 40 HADITH COLLECTION ==========
function loadFortyHadiths() {
    const container = document.getElementById('fortyHadithsList');
    if (!container) {
        console.error('fortyHadithsList not found');
        return;
    }

    if (typeof fortyHadiths === 'undefined' || !fortyHadiths || fortyHadiths.length === 0) {
        container.innerHTML = '<p style="padding: 20px; text-align: center;">40 Hadis yüklenemedi.</p>';
        console.error('fortyHadiths array not found');
        return;
    }

    container.innerHTML = fortyHadiths.map(hadith => {
        const favorited = isFavorited('fortyHadiths', hadith.id);
        return `
            <div class="hadith-item">
                <div class="hadith-number">Hadis ${hadith.number}</div>
                <div class="hadith-title">${hadith.title}</div>
                <div class="hadith-arabic">${hadith.arabic}</div>
                <div class="hadith-turkish">${hadith.turkish}</div>
                <div class="hadith-source">Kaynak: ${hadith.source}</div>
                <div class="hadith-explanation">${hadith.explanation}</div>
                <div class="item-actions">
                    <button class="action-btn favorite-btn ${favorited ? 'favorited' : ''}"
                            onclick="handleFavorite('fortyHadiths', ${hadith.id}, this)"
                            title="Favorilere ekle">
                        <span class="action-icon">${favorited ? '⭐' : '☆'}</span>
                    </button>
                    <button class="action-btn speak-btn"
                            onclick="handleSpeak('${hadith.arabic.replace(/'/g, "\\'")}', this)"
                            title="Sesli oku">
                        <span class="action-icon">🔊</span>
                    </button>
                    <button class="action-btn share-btn"
                            onclick="handleShare('${hadith.title}', '${hadith.arabic}\\n\\n${hadith.turkish}\\n\\nKaynak: ${hadith.source}')"
                            title="Paylaş">
                        <span class="action-icon">📤</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// ========== PROPHET STORIES ==========
function loadProphetStories() {
    const container = document.getElementById('prophetStoriesList');
    if (!container) {
        console.error('prophetStoriesList not found');
        return;
    }

    if (typeof prophetStories === 'undefined' || !prophetStories || prophetStories.length === 0) {
        container.innerHTML = '<p style="padding: 20px; text-align: center;">Kıssalar yüklenemedi.</p>';
        console.error('prophetStories array not found');
        return;
    }

    container.innerHTML = prophetStories.map(story => {
        const favorited = isFavorited('stories', story.id);
        return `
            <div class="story-item">
                <div class="story-header">
                    <div class="story-prophet">${story.prophet}</div>
                    <div class="story-date">${story.date}</div>
                </div>
                <div class="story-title">${story.title}</div>
                <div class="story-content">${story.story}</div>
                <div class="story-lesson">
                    <strong>📚 Ders:</strong> ${story.lesson}
                </div>
                <div class="item-actions">
                    <button class="action-btn favorite-btn ${favorited ? 'favorited' : ''}"
                            onclick="handleFavorite('stories', ${story.id}, this)"
                            title="Favorilere ekle">
                        <span class="action-icon">${favorited ? '⭐' : '☆'}</span>
                    </button>
                    <button class="action-btn share-btn"
                            onclick="handleShare('${story.title}', '${story.prophet}\\n${story.title}\\n\\n${story.story}\\n\\nDers: ${story.lesson}')"
                            title="Paylaş">
                        <span class="action-icon">📤</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// ========== ISLAMIC EVENTS CALENDAR ==========
function loadIslamicEvents() {
    const container = document.getElementById('islamicEventsList');
    if (!container) {
        console.error('islamicEventsList not found');
        return;
    }

    if (typeof islamicEvents === 'undefined' || !islamicEvents || islamicEvents.length === 0) {
        container.innerHTML = '<p style="padding: 20px; text-align: center;">Dini günler yüklenemedi.</p>';
        console.error('islamicEvents array not found');
        return;
    }

    const hijriDate = getCurrentHijriDate();

    container.innerHTML = islamicEvents.map(event => {
        const isCurrentMonth = event.hijriMonth === hijriDate.month;
        const monthName = getHijriMonthName(event.hijriMonth);

        return `
            <div class="event-item ${isCurrentMonth ? 'current-month' : ''}">
                <div class="event-badge">${isCurrentMonth ? '📍 Bu Ay' : '📅'}</div>
                <div class="event-name">${event.name}</div>
                <div class="event-date">
                    ${monthName} ${event.hijriDay}
                </div>
                <div class="event-description">${event.description}</div>
                <div class="event-significance">
                    <strong>⭐ Önemi:</strong> ${event.significance}
                </div>
                <div class="event-prayers">
                    <strong>🤲 İbadetler:</strong> ${event.prayers}
                </div>
            </div>
        `;
    }).join('');
}

// ========== JUZ TRACKER ==========
const JUZ_TRACKER_KEY = 'ezanvakti_juz_tracker';

function getJuzProgress() {
    const stored = localStorage.getItem(JUZ_TRACKER_KEY);
    return stored ? JSON.parse(stored) : Array(30).fill(false);
}

function saveJuzProgress(progress) {
    localStorage.setItem(JUZ_TRACKER_KEY, JSON.stringify(progress));
}

function loadJuzTracker() {
    const container = document.getElementById('juzTrackerGrid');
    if (!container) return;

    const progress = getJuzProgress();
    const completed = progress.filter(Boolean).length;

    // Update stats
    document.getElementById('juzCompleted').textContent = completed;
    document.getElementById('juzRemaining').textContent = 30 - completed;
    document.getElementById('juzPercentage').textContent = Math.round((completed / 30) * 100);

    // Update progress bar
    const progressBar = document.getElementById('juzProgressBar');
    if (progressBar) {
        progressBar.style.width = `${(completed / 30) * 100}%`;
    }

    container.innerHTML = Array.from({ length: 30 }, (_, i) => {
        const juzNum = i + 1;
        const isCompleted = progress[i];

        return `
            <div class="juz-item ${isCompleted ? 'completed' : ''}"
                 onclick="toggleJuz(${i})">
                <div class="juz-number">${juzNum}</div>
                <div class="juz-check">${isCompleted ? '✓' : ''}</div>
            </div>
        `;
    }).join('');
}

function toggleJuz(index) {
    vibrate('short');
    const progress = getJuzProgress();
    progress[index] = !progress[index];
    saveJuzProgress(progress);
    loadJuzTracker();
}

function resetJuzTracker() {
    if (confirm('Tüm cüz takibini sıfırlamak istediğinize emin misiniz?')) {
        saveJuzProgress(Array(30).fill(false));
        loadJuzTracker();
        showMessage('Cüz takibi sıfırlandı', 'success');
    }
}

// ========== CATEGORY E: TECHNICAL IMPROVEMENTS ==========

// ========== MULTI-LANGUAGE SUPPORT ==========
const LANGUAGE_KEY = 'ezanvakti_language';

const translations = {
    tr: {
        appTitle: 'Ezan Vakti Pro',
        nextPrayer: 'Bir Sonraki Namaz',
        prayerTimes: 'Namaz Vakitleri',
        settings: 'Ayarlar',
        language: 'Dil',
        fontSize: 'Font Boyutu',
        backup: 'Yedekleme',
        restore: 'Geri Yükle',
        imsak: 'İmsak',
        gunes: 'Güneş',
        ogle: 'Öğle',
        ikindi: 'İkindi',
        aksam: 'Akşam',
        yatsi: 'Yatsı'
    },
    en: {
        appTitle: 'Prayer Times Pro',
        nextPrayer: 'Next Prayer',
        prayerTimes: 'Prayer Times',
        settings: 'Settings',
        language: 'Language',
        fontSize: 'Font Size',
        backup: 'Backup',
        restore: 'Restore',
        imsak: 'Fajr',
        gunes: 'Sunrise',
        ogle: 'Dhuhr',
        ikindi: 'Asr',
        aksam: 'Maghrib',
        yatsi: 'Isha'
    },
    ar: {
        appTitle: 'أوقات الصلاة',
        nextPrayer: 'الصلاة القادمة',
        prayerTimes: 'أوقات الصلاة',
        settings: 'الإعدادات',
        language: 'اللغة',
        fontSize: 'حجم الخط',
        backup: 'النسخ الاحتياطي',
        restore: 'استعادة',
        imsak: 'الإمساك',
        gunes: 'الشروق',
        ogle: 'الظهر',
        ikindi: 'العصر',
        aksam: 'المغرب',
        yatsi: 'العشاء'
    }
};

function getCurrentLanguage() {
    return localStorage.getItem(LANGUAGE_KEY) || 'tr';
}

function setLanguage(lang) {
    localStorage.setItem(LANGUAGE_KEY, lang);
    applyLanguage(lang);
    showMessage('Dil değiştirildi / Language changed / تم تغيير اللغة', 'success');
}

function applyLanguage(lang) {
    const t = translations[lang];
    if (!t) return;

    // Update prayer names (keep times as is)
    const prayerNames = document.querySelectorAll('.prayer-name');
    const prayerKeys = ['imsak', 'gunes', 'ogle', 'ikindi', 'aksam', 'yatsi'];
    prayerNames.forEach((el, i) => {
        if (prayerKeys[i] && t[prayerKeys[i]]) {
            el.textContent = t[prayerKeys[i]];
        }
    });

    // Update other UI elements
    const logoH1 = document.querySelector('.logo h1');
    if (logoH1 && t.appTitle) {
        logoH1.textContent = t.appTitle;
    }

    const nextPrayerLabel = document.querySelector('.next-prayer-label');
    if (nextPrayerLabel && t.nextPrayer) {
        nextPrayerLabel.textContent = t.nextPrayer;
    }
}

// ========== FONT SIZE CONTROL ==========
const FONT_SIZE_KEY = 'ezanvakti_font_size';

function getFontSize() {
    return localStorage.getItem(FONT_SIZE_KEY) || 'medium';
}

function setFontSize(size) {
    localStorage.setItem(FONT_SIZE_KEY, size);
    applyFontSize(size);
}

function applyFontSize(size) {
    const root = document.documentElement;
    const sizes = {
        small: {
            arabic: '1.2rem',
            turkish: '0.9rem'
        },
        medium: {
            arabic: '1.5rem',
            turkish: '1rem'
        },
        large: {
            arabic: '1.8rem',
            turkish: '1.1rem'
        },
        xlarge: {
            arabic: '2.2rem',
            turkish: '1.3rem'
        }
    };

    const selectedSize = sizes[size] || sizes.medium;

    root.style.setProperty('--arabic-font-size', selectedSize.arabic);
    root.style.setProperty('--turkish-font-size', selectedSize.turkish);

    showMessage('Font boyutu değiştirildi', 'success');
}

// ========== BACKUP AND RESTORE ==========
function exportData() {
    const data = {
        favorites: getFavorites(),
        juzProgress: getJuzProgress(),
        alarms: getAlarmSettings(),
        adhanSettings: getAdhanSettings(),
        language: getCurrentLanguage(),
        fontSize: getFontSize(),
        theme: document.body.classList.contains('dark-theme') ? 'dark' : 'light',
        prayerTracking: JSON.parse(localStorage.getItem(TRACKING_KEY) || '{}'),
        exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `ezan-vakti-yedek-${new Date().toISOString().split('T')[0]}.json`;
    a.click();

    URL.revokeObjectURL(url);
    vibrate('double');
    showMessage('Veriler dışa aktarıldı', 'success');
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);

                // Restore all data
                if (data.favorites) saveFavorites(data.favorites);
                if (data.juzProgress) saveJuzProgress(data.juzProgress);
                if (data.alarms) saveAlarmSettings(data.alarms);
                if (data.adhanSettings) saveAdhanSettings(data.adhanSettings);
                if (data.language) setLanguage(data.language);
                if (data.fontSize) setFontSize(data.fontSize);
                if (data.prayerTracking) localStorage.setItem(TRACKING_KEY, JSON.stringify(data.prayerTracking));

                if (data.theme === 'dark' && !document.body.classList.contains('dark-theme')) {
                    toggleTheme();
                }

                vibrate('triple');
                showMessage('Veriler geri yüklendi! Sayfa yenileniyor...', 'success');

                setTimeout(() => {
                    location.reload();
                }, 2000);

            } catch (err) {
                console.error('Import error:', err);
                showMessage('Veri içe aktarma başarısız!', 'error');
            }
        };

        reader.readAsText(file);
    };

    input.click();
}

// ========== AUTO THEME SCHEDULING ==========
const AUTO_THEME_KEY = 'ezanvakti_auto_theme';

function getAutoThemeSettings() {
    const stored = localStorage.getItem(AUTO_THEME_KEY);
    return stored ? JSON.parse(stored) : {
        enabled: false,
        mode: 'time', // 'time' or 'prayer'
        timeStart: '20:00',
        timeEnd: '06:00'
    };
}

function saveAutoThemeSettings(settings) {
    localStorage.setItem(AUTO_THEME_KEY, JSON.stringify(settings));
}

function checkAutoTheme() {
    const settings = getAutoThemeSettings();
    if (!settings.enabled) return;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    let shouldBeDark = false;

    if (settings.mode === 'time') {
        const [startH, startM] = settings.timeStart.split(':').map(Number);
        const [endH, endM] = settings.timeEnd.split(':').map(Number);
        const startTime = startH * 60 + startM;
        const endTime = endH * 60 + endM;

        if (startTime > endTime) {
            // Crosses midnight
            shouldBeDark = currentTime >= startTime || currentTime < endTime;
        } else {
            shouldBeDark = currentTime >= startTime && currentTime < endTime;
        }
    } else if (settings.mode === 'prayer') {
        // Dark between Maghrib and Fajr
        const aksamTime = document.getElementById('aksam')?.textContent;
        const imsakTime = document.getElementById('imsak')?.textContent;

        if (aksamTime && imsakTime) {
            const [aksamH, aksamM] = aksamTime.split(':').map(Number);
            const [imsakH, imsakM] = imsakTime.split(':').map(Number);
            const aksamMinutes = aksamH * 60 + aksamM;
            const imsakMinutes = imsakH * 60 + imsakM;

            if (aksamMinutes > imsakMinutes) {
                shouldBeDark = currentTime >= aksamMinutes || currentTime < imsakMinutes;
            } else {
                shouldBeDark = currentTime >= aksamMinutes && currentTime < imsakMinutes;
            }
        }
    }

    const isDark = document.body.classList.contains('dark-theme');

    if (shouldBeDark && !isDark) {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
        document.getElementById('themeIcon').textContent = '☀️';
    } else if (!shouldBeDark && isDark) {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
        document.getElementById('themeIcon').textContent = '🌙';
    }
}

// Check auto theme every minute
setInterval(checkAutoTheme, 60000);
checkAutoTheme();

function loadAutoThemeSettings() {
    const settings = getAutoThemeSettings();

    document.getElementById('autoThemeEnabled').checked = settings.enabled;
    document.getElementById('autoThemeMode').value = settings.mode;
    document.getElementById('themeStartTime').value = settings.timeStart;
    document.getElementById('themeEndTime').value = settings.timeEnd;

    toggleAutoThemeOptions();
}

function toggleAutoThemeOptions() {
    const enabled = document.getElementById('autoThemeEnabled').checked;
    const mode = document.getElementById('autoThemeMode').value;
    const timeInputs = document.getElementById('themeTimeInputs');

    if (timeInputs) {
        timeInputs.style.display = enabled && mode === 'time' ? 'flex' : 'none';
    }
}

function saveAutoTheme() {
    const settings = {
        enabled: document.getElementById('autoThemeEnabled').checked,
        mode: document.getElementById('autoThemeMode').value,
        timeStart: document.getElementById('themeStartTime').value,
        timeEnd: document.getElementById('themeEndTime').value
    };

    saveAutoThemeSettings(settings);
    checkAutoTheme();
    showMessage('Otomatik tema ayarları kaydedildi', 'success');
}

// ========== ISLAMIC LIBRARY FUNCTIONS ==========
let currentLibraryTab = 'books';
let previewAudio = null;

function loadLibraryContent(type) {
    currentLibraryTab = type;
    const container = document.getElementById('libraryContent');

    // Update active tab
    document.querySelectorAll('.prayer-tab[data-library]').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.library === type);
    });

    let content = '';

    switch(type) {
        case 'books':
            content = libraryBooks.map(book => `
                <div class="library-item">
                    <div class="library-item-header">
                        <span class="library-icon">${book.cover}</span>
                        <div class="library-info">
                            <h4>${book.title}</h4>
                            <p class="library-meta">${book.author} • ${book.pages} sayfa</p>
                        </div>
                    </div>
                    <p class="library-description">${book.description}</p>
                    <div class="library-tags">
                        <span class="tag">${book.category}</span>
                        <span class="tag">${book.language}</span>
                    </div>
                </div>
            `).join('');
            break;

        case 'articles':
            content = libraryArticles.map(article => `
                <div class="library-item">
                    <div class="library-item-header">
                        <span class="library-icon">📰</span>
                        <div class="library-info">
                            <h4>${article.title}</h4>
                            <p class="library-meta">${article.author} • ${article.readTime}</p>
                        </div>
                    </div>
                    <p class="library-description">${article.excerpt}</p>
                    <div class="library-tags">
                        <span class="tag">${article.category}</span>
                        <span class="tag">${article.date}</span>
                    </div>
                </div>
            `).join('');
            break;

        case 'videos':
            content = libraryVideos.map(video => `
                <div class="library-item">
                    <div class="library-item-header">
                        <span class="library-icon">${video.thumbnail}</span>
                        <div class="library-info">
                            <h4>${video.title}</h4>
                            <p class="library-meta">${video.speaker} • ${video.duration}</p>
                        </div>
                    </div>
                    <div class="library-tags">
                        <span class="tag">${video.category}</span>
                        <span class="tag">${video.views} görüntülenme</span>
                    </div>
                </div>
            `).join('');
            break;

        case 'podcasts':
            content = libraryPodcasts.map(podcast => `
                <div class="library-item">
                    <div class="library-item-header">
                        <span class="library-icon">${podcast.cover}</span>
                        <div class="library-info">
                            <h4>${podcast.title}</h4>
                            <p class="library-meta">${podcast.host} • ${podcast.episodes} bölüm</p>
                        </div>
                    </div>
                    <p class="library-description">${podcast.description}</p>
                    <div class="library-tags">
                        <span class="tag">${podcast.category}</span>
                        <span class="tag">${podcast.duration}</span>
                    </div>
                </div>
            `).join('');
            break;
    }

    container.innerHTML = content;

    // Add tab click listeners
    document.querySelectorAll('.prayer-tab[data-library]').forEach(tab => {
        tab.addEventListener('click', () => {
            loadLibraryContent(tab.dataset.library);
        });
    });
}

// ========== RADIO PLAYER FUNCTIONS ==========
let radioAudio = null;
let currentRadioStation = null;
let isRadioPlaying = false;

function loadRadioStations() {
    const container = document.getElementById('radioStationsList');

    container.innerHTML = radioStations.map(station => `
        <div class="radio-station-item" data-station-id="${station.id}">
            <div class="radio-station-info">
                <span class="radio-icon">${station.icon}</span>
                <div>
                    <h4>${station.name}</h4>
                    <p>${station.description}</p>
                </div>
            </div>
            <button class="btn-primary" onclick="playRadioStation(${station.id})">
                ▶️ Dinle
            </button>
        </div>
    `).join('');
}

function playRadioStation(stationId) {
    const station = radioStations.find(s => s.id === stationId);
    if (!station) return;

    currentRadioStation = station;

    // Create or update audio element
    if (!radioAudio) {
        radioAudio = new Audio();
        radioAudio.addEventListener('error', () => {
            showError('Radyo yüklenirken hata oluştu. Lütfen tekrar deneyin.');
            stopRadio();
        });
    }

    radioAudio.src = station.url;
    radioAudio.volume = 0.7;
    radioAudio.play().catch(err => {
        showError('Radyo çalmaya başlanamadı: ' + err.message);
        return;
    });

    isRadioPlaying = true;

    // Show player
    const player = document.getElementById('radioPlayer');
    player.style.display = 'block';

    // Update player info
    document.getElementById('currentRadioName').textContent = station.name;
    document.getElementById('currentRadioDesc').textContent = station.description;

    // Update play/pause button
    updateRadioPlayPauseButton();

    // Setup control listeners
    setupRadioControls();
}

function setupRadioControls() {
    const playPauseBtn = document.getElementById('radioPlayPauseBtn');
    const stopBtn = document.getElementById('radioStopBtn');
    const volumeSlider = document.getElementById('radioVolumeSlider');

    // Remove existing listeners
    const newPlayPauseBtn = playPauseBtn.cloneNode(true);
    playPauseBtn.parentNode.replaceChild(newPlayPauseBtn, playPauseBtn);

    const newStopBtn = stopBtn.cloneNode(true);
    stopBtn.parentNode.replaceChild(newStopBtn, stopBtn);

    // Play/Pause
    newPlayPauseBtn.addEventListener('click', () => {
        if (isRadioPlaying) {
            radioAudio.pause();
            isRadioPlaying = false;
        } else {
            radioAudio.play();
            isRadioPlaying = true;
        }
        updateRadioPlayPauseButton();
    });

    // Stop
    newStopBtn.addEventListener('click', () => {
        stopRadio();
    });

    // Volume
    volumeSlider.addEventListener('input', (e) => {
        if (radioAudio) {
            radioAudio.volume = e.target.value / 100;
        }
    });
}

function updateRadioPlayPauseButton() {
    const btn = document.getElementById('radioPlayPauseBtn');
    if (btn) {
        btn.textContent = isRadioPlaying ? '⏸️' : '▶️';
    }
}

function stopRadio() {
    if (radioAudio) {
        radioAudio.pause();
        radioAudio.src = '';
        isRadioPlaying = false;
        currentRadioStation = null;
    }

    const player = document.getElementById('radioPlayer');
    if (player) {
        player.style.display = 'none';
    }
}

// ========== ADHAN SOUNDS FUNCTIONS ==========
function loadAdhanSounds() {
    const container = document.getElementById('adhanSoundsList');
    const selectedSound = localStorage.getItem('selectedAdhanSound') || '1';

    container.innerHTML = adhanSounds.map(sound => `
        <div class="adhan-sound-item ${sound.id == selectedSound ? 'selected' : ''}" data-sound-id="${sound.id}">
            <div class="adhan-sound-info">
                <div class="adhan-sound-header">
                    <h4>${sound.name}</h4>
                    <span class="adhan-duration">${sound.duration}</span>
                </div>
                <p class="adhan-country">🌍 ${sound.country}</p>
            </div>
            <div class="adhan-sound-actions">
                <button class="btn-secondary" onclick="previewAdhanSound('${sound.url}')">
                    🔊 Dinle
                </button>
                <button class="btn-primary ${sound.id == selectedSound ? 'active' : ''}"
                        onclick="selectAdhanSound(${sound.id}, '${sound.url}')">
                    ${sound.id == selectedSound ? '✓ Seçili' : 'Seç'}
                </button>
            </div>
        </div>
    `).join('');
}

function previewAdhanSound(url) {
    // Stop any existing preview
    if (previewAudio) {
        previewAudio.pause();
        previewAudio = null;
    }

    previewAudio = new Audio(url);
    previewAudio.volume = 0.5;
    previewAudio.play().catch(err => {
        showError('Ses çalınamadı: ' + err.message);
    });

    // Auto-stop after 15 seconds
    setTimeout(() => {
        if (previewAudio) {
            previewAudio.pause();
            previewAudio = null;
        }
    }, 15000);
}

function selectAdhanSound(soundId, url) {
    // Save selection
    localStorage.setItem('selectedAdhanSound', soundId);

    // Update main adhan audio
    const adhanAudio = document.getElementById('adhanAudio');
    if (adhanAudio) {
        adhanAudio.src = url;
    }

    // Reload the list to update UI
    loadAdhanSounds();

    showMessage('Ezan sesi seçildi', 'success');
}

// ========== ENHANCED NOTIFICATIONS FUNCTIONS ==========
let notificationHistory = [];

function loadNotificationPresets() {
    const container = document.getElementById('notificationPresetsList');

    container.innerHTML = notificationPresets.map(preset => `
        <div class="notification-preset-item" onclick="applyNotificationPreset('${preset.id}')">
            <div class="preset-info">
                <h4>${preset.name}</h4>
                <p>${preset.description}</p>
            </div>
            <button class="btn-primary">Uygula</button>
        </div>
    `).join('');

    // Setup DND mode
    setupDNDMode();

    // Load notification history
    loadNotificationHistory();
}

function applyNotificationPreset(presetId) {
    const preset = notificationPresets.find(p => p.id === presetId);
    if (!preset) return;

    // Apply settings
    Object.keys(preset.settings).forEach(key => {
        localStorage.setItem(`notification_${key}`, preset.settings[key]);
    });

    showMessage(`${preset.name} profili uygulandı`, 'success');

    // Add to history
    addNotificationHistory(`${preset.name} profili uygulandı`);
}

function setupDNDMode() {
    const dndToggle = document.getElementById('dndMode');
    const dndSettings = document.getElementById('dndSettings');
    const startTime = document.getElementById('dndStartTime');
    const endTime = document.getElementById('dndEndTime');

    // Load saved settings
    const dndEnabled = localStorage.getItem('dndMode') === 'true';
    dndToggle.checked = dndEnabled;
    dndSettings.style.display = dndEnabled ? 'block' : 'none';

    if (localStorage.getItem('dndStartTime')) {
        startTime.value = localStorage.getItem('dndStartTime');
    }
    if (localStorage.getItem('dndEndTime')) {
        endTime.value = localStorage.getItem('dndEndTime');
    }

    // Toggle event
    dndToggle.addEventListener('change', (e) => {
        const enabled = e.target.checked;
        localStorage.setItem('dndMode', enabled);
        dndSettings.style.display = enabled ? 'block' : 'none';

        if (enabled) {
            addNotificationHistory('Rahatsız Etme Modu açıldı');
        } else {
            addNotificationHistory('Rahatsız Etme Modu kapatıldı');
        }
    });

    // Time changes
    startTime.addEventListener('change', (e) => {
        localStorage.setItem('dndStartTime', e.target.value);
    });

    endTime.addEventListener('change', (e) => {
        localStorage.setItem('dndEndTime', e.target.value);
    });
}

function addNotificationHistory(message) {
    const timestamp = new Date().toLocaleString('tr-TR');
    notificationHistory.unshift({ message, timestamp });

    // Keep only last 20 items
    if (notificationHistory.length > 20) {
        notificationHistory = notificationHistory.slice(0, 20);
    }

    // Save to localStorage
    localStorage.setItem('notificationHistory', JSON.stringify(notificationHistory));

    // Update display
    loadNotificationHistory();
}

function loadNotificationHistory() {
    const container = document.getElementById('notificationHistory');
    if (!container) return;

    // Load from localStorage
    const saved = localStorage.getItem('notificationHistory');
    if (saved) {
        notificationHistory = JSON.parse(saved);
    }

    if (notificationHistory.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Henüz bildirim geçmişi yok</p>';
        return;
    }

    container.innerHTML = notificationHistory.map(item => `
        <div class="notification-history-item">
            <p>${item.message}</p>
            <span class="notification-time">${item.timestamp}</span>
        </div>
    `).join('');
}

// Check if current time is in DND period
function isDNDActive() {
    const dndEnabled = localStorage.getItem('dndMode') === 'true';
    if (!dndEnabled) return false;

    const startTime = localStorage.getItem('dndStartTime');
    const endTime = localStorage.getItem('dndEndTime');
    if (!startTime || !endTime) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    const start = startHour * 60 + startMin;
    const end = endHour * 60 + endMin;

    // Handle overnight periods (e.g., 22:00 to 07:00)
    if (start > end) {
        return currentTime >= start || currentTime <= end;
    } else {
        return currentTime >= start && currentTime <= end;
    }
}

// Button handlers for new features - Moved to DOMContentLoaded
// Apply saved settings on load
document.addEventListener('DOMContentLoaded', () => {
    // Apply language and font size
    const lang = getCurrentLanguage();
    applyLanguage(lang);
    const fontSize = getFontSize();
    applyFontSize(fontSize);

    // Add event listeners for new buttons
    const hadithBtn = document.getElementById('hadithBtn');
    if (hadithBtn) {
        hadithBtn.addEventListener('click', () => {
            openModal('hadithModal');
            loadDailyHadith();
        });
    }

    const fortyHadithBtn = document.getElementById('fortyHadithBtn');
    if (fortyHadithBtn) {
        fortyHadithBtn.addEventListener('click', () => {
            openModal('fortyHadithModal');
            loadFortyHadiths();
        });
    }

    const storiesBtn = document.getElementById('storiesBtn');
    if (storiesBtn) {
        storiesBtn.addEventListener('click', () => {
            openModal('storiesModal');
            loadProphetStories();
        });
    }

    const eventsBtn = document.getElementById('eventsBtn');
    if (eventsBtn) {
        eventsBtn.addEventListener('click', () => {
            openModal('eventsModal');
            loadIslamicEvents();
        });
    }

    const juzBtn = document.getElementById('juzBtn');
    if (juzBtn) {
        juzBtn.addEventListener('click', () => {
            openModal('juzModal');
            loadJuzTracker();
        });
    }

    // NEW FEATURES - Library, Radio, Adhan Sounds Event Listeners
    const libraryBtn = document.getElementById('libraryBtn');
    if (libraryBtn) {
        libraryBtn.addEventListener('click', () => {
            openModal('libraryModal');
            loadLibraryContent('books');
        });
    }

    const radioBtn = document.getElementById('radioBtn');
    if (radioBtn) {
        radioBtn.addEventListener('click', () => {
            openModal('radioModal');
            loadRadioStations();
        });
    }

    const adhanSoundsBtn = document.getElementById('adhanSoundsBtn');
    if (adhanSoundsBtn) {
        adhanSoundsBtn.addEventListener('click', () => {
            openModal('adhanSoundsModal');
            loadAdhanSounds();
        });
    }

    console.log('B+E features initialized successfully');
});
