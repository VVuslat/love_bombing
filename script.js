// Aşk mesajları - Love quotes in Turkish
const loveQuotes = [
    "Aşk, iki ruhun tek bir bedende yaşamasıdır.",
    "Seni sevmek bir sanat, seninle olmak bir mucize.",
    "Her şey seninle daha güzel, her an seninle daha anlamlı.",
    "Aşk, bir bakışta başlar, bir gülümsemeyle büyür.",
    "Sen benim en güzel şiirimin, en tatlı melodimin.",
    "Seninle geçirdiğim her an, bir ömür gibi değerli.",
    "Aşk, kelimelerle anlatılamaz, sadece hissedilir.",
    "Sen benim dünyadaki en güzel tesadüfümsün.",
    "Kalbim senin için atar, ruhum sana aittir.",
    "Seninle olmak, cennette olmak gibi.",
    "Aşk, hayatın en güzel rengidir.",
    "Sen benim için güneş, ay ve yıldızlarsın.",
    "Her gün seni daha çok seviyorum.",
    "Aşk, iki kalbin tek bir ritimde atmasıdır.",
    "Seninle her şey mümkün, sensiz hiçbir şey anlamlı değil."
];

// Sayfa yüklendiğinde ilk mesajı göster
window.onload = function() {
    getNewQuote();
};

// Yeni aşk mesajı getir
function getNewQuote() {
    const quoteElement = document.getElementById('loveQuote');
    const randomIndex = Math.floor(Math.random() * loveQuotes.length);
    quoteElement.textContent = loveQuotes[randomIndex];
    
    // Animasyon ekle
    quoteElement.style.opacity = '0';
    setTimeout(() => {
        quoteElement.style.transition = 'opacity 0.5s';
        quoteElement.style.opacity = '1';
    }, 100);
}

// Aşk uyumluluğunu hesapla
function calculateLove() {
    const name1 = document.getElementById('name1').value.trim();
    const name2 = document.getElementById('name2').value.trim();
    const resultDiv = document.getElementById('result');
    
    if (!name1 || !name2) {
        resultDiv.textContent = "Lütfen her iki ismi de girin! ❤️";
        return;
    }
    
    // Basit bir algoritma ile aşk yüzdesini hesapla
    const combined = name1.toLowerCase() + name2.toLowerCase();
    let sum = 0;
    for (let i = 0; i < combined.length; i++) {
        sum += combined.charCodeAt(i);
    }
    
    // Yüzdeyi hesapla (her zaman %50-100 arası olsun ki pozitif olsun)
    const lovePercentage = 50 + (sum % 51);
    
    // Mesajı oluştur
    let message = `${name1} ❤️ ${name2}\n\n`;
    message += `Aşk Uyumluluğu: ${lovePercentage}% 💕\n\n`;
    
    if (lovePercentage >= 90) {
        message += "Mükemmel bir uyum! Birbiriniz için yaratılmışsınız! 💕";
    } else if (lovePercentage >= 75) {
        message += "Harika bir uyum! Çok güzel bir çift olursunuz! 💖";
    } else if (lovePercentage >= 60) {
        message += "İyi bir uyum! Güzel bir ilişki sizi bekliyor! 💗";
    } else {
        message += "Umut var! Aşk her engeli aşar! 💓";
    }
    
    resultDiv.textContent = message;
}

// Birlikte geçirilen günleri hesapla
function calculateDays() {
    const startDate = document.getElementById('startDate').value;
    const resultDiv = document.getElementById('daysResult');
    
    if (!startDate) {
        resultDiv.textContent = "Lütfen bir tarih seçin! 📅";
        return;
    }
    
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = Math.abs(today - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = Math.floor((diffDays % 365) % 30);
    
    let message = "💕 Birlikte Geçirilen Zaman 💕\n\n";
    message += `Toplam: ${diffDays} gün\n\n`;
    
    if (years > 0) {
        message += `${years} yıl, `;
    }
    if (months > 0) {
        message += `${months} ay, `;
    }
    message += `${days} gün\n\n`;
    message += "Her gün sizinle daha özel! ❤️";
    
    resultDiv.textContent = message;
}

// Kalp yağmuru animasyonu
function showHearts() {
    const container = document.getElementById('heartsContainer');
    const hearts = ['❤️', '💕', '💖', '💗', '💓', '💘', '💝'];
    
    // 30 kalp oluştur
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDuration = (2 + Math.random() * 2) + 's';
            container.appendChild(heart);
            
            // Animasyon bitince kaldır
            setTimeout(() => {
                heart.remove();
            }, 4000);
        }, i * 100);
    }
}

// Enter tuşu ile form gönderimi
document.addEventListener('DOMContentLoaded', function() {
    const name1 = document.getElementById('name1');
    const name2 = document.getElementById('name2');
    
    if (name1 && name2) {
        name1.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateLove();
            }
        });
        
        name2.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateLove();
            }
        });
    }
});
