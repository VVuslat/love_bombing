// D3.js ile hareketli neon bordo kalpler, tıklanınca büyüme, dil döngüsü ve particle efekti
const LANGUAGES = [
    "Seni seviyorum", "I love you", "Te quiero", "Je t'aime", "Ich liebe dich",
    "أحبك", "Eu te amo", "Я люблю тебя", "わたしはあなたを愛しています",
    "사랑해요", "Ti amo", "Te iubesc"
];
const HEART_COLORS = ["#7B1626"];
const HEART_GLOW = "0 0 32px #7B1626, 0 0 64px #7B1626, 0 0 128px #fff";
// Metin için neon lacivert (orta koyu -> parlak glow ile)
const TEXT_COLOR = "#05204A"; // neon lacivert
const TEXT_GLOW = `0 0 40px ${TEXT_COLOR}, 0 0 90px ${TEXT_COLOR}, 0 0 160px #ffffff`;
const ANIMATION_DURATION = 8000;
const FADE_DURATION = 300;
const PARTICLE_COLORS = ["#ff2a4d", "#a020f0", "#7B1626", "#ff4f8b"];
const HEART_COUNT = 400;
let isAnimating = false;
let currentLangIdx = 0;
let activeHeart = null;
let heartData = [];

// SVG setup
const svg = d3.select("#love-container").append("svg")
    .attr("width", window.innerWidth)
    .attr("height", window.innerHeight)
    .style("position", "absolute")
    .style("top", 0)
    .style("left", 0)
    .style("width", "100vw")
    .style("height", "100vh");

function heartPath(x, y, size) {
    const s = size / 32;
    return `M${x},${y} c${-8*s},${-8*s} ${-16*s},${8*s} 0,${16*s} c${16*s},${-8*s} ${8*s},${-24*s} 0,${-16*s}z`;
}

function generateHeartData(count) {
    const w = window.innerWidth, h = window.innerHeight;
    const margin = Math.min(w, h) * 0.12;
    let data = [];
        for (let i = 0; i < count; i++) {
            // Rastgele pozisyon
            let x = Math.random() * (w * 0.8) + w * 0.1;
            let y = Math.random() * (h * 0.8) + h * 0.1;
            // Her kalp için tamamen bağımsız yön ve hız (daha rastgele, daha geniş aralık)
            let angle = Math.random() * 2 * Math.PI;
            let speed = 0.05 + Math.random() * 1.8;
            let vx = Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 2 + 0.5);
            let vy = Math.sin(angle) * speed * (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 2 + 0.5);
            let size = Math.min(w, h) * (0.07 + Math.random()*0.11); // irili ufaklı
            let color = HEART_COLORS[0];
            data.push({
                id: i,
                x: Math.max(margin, Math.min(w - margin, x)),
                y: Math.max(margin, Math.min(h - margin, y)),
                size,
                vx, vy,
                color
            });
        }
    return data;
}

function renderHearts() {
    svg.selectAll(".heart").remove();
    svg.selectAll(".heart-text").remove();
    heartData = generateHeartData(HEART_COUNT);
    svg.selectAll(".heart")
        .data(heartData, d => d.id)
        .enter()
        .append("path")
        .attr("class", "heart")
        .attr("d", d => heartPath(d.x, d.y, d.size))
        .attr("fill", d => d.color)
        .style("filter", `drop-shadow(${HEART_GLOW})`)
        .on("click", (event, d) => onHeartClick(d, event));
}

function moveHearts() {
    if (isAnimating) return;
    for (let d of heartData) {
        d.x += d.vx;
        d.y += d.vy;
        // Kenarlardan sekme
        if (d.x < d.size) d.vx = Math.abs(d.vx);
        if (d.x > window.innerWidth - d.size) d.vx = -Math.abs(d.vx);
        if (d.y < d.size) d.vy = Math.abs(d.vy);
        if (d.y > window.innerHeight - d.size) d.vy = -Math.abs(d.vy);
    }
    svg.selectAll(".heart")
        .data(heartData, d => d.id)
        .attr("d", d => heartPath(d.x, d.y, d.size))
        .attr("fill", d => d.color);
    requestAnimationFrame(moveHearts);
}

function onHeartClick(d, event) {
    if (isAnimating) return;
    isAnimating = true;
    activeHeart = d;
    // Her tıklamada bir sonraki dili göster
    currentLangIdx = (currentLangIdx + 1) % LANGUAGES.length;
    animateHeart(d);
}

function animateHeart(d) {
    const heart = svg.selectAll(".heart").filter(dd => dd.id === d.id);
    heart.raise();
    heart.transition()
        .duration(ANIMATION_DURATION)
        .attrTween("d", function() {
            const i = d3.interpolate(d.size, Math.max(window.innerWidth, window.innerHeight) * 1.2);
            return t => heartPath(d.x, d.y, i(t));
        })
        .on("start", () => showHeartText(d))
        .on("end", () => {
            heart.transition().duration(FADE_DURATION).style("opacity", 0).remove();
            svg.selectAll(".heart-text").transition().duration(FADE_DURATION).style("opacity", 0).remove();
            setTimeout(resetState, FADE_DURATION);
        });
    startParticleSpawn(d.x, d.y, ANIMATION_DURATION);
}

function showHeartText(d) {
    // Önce varsa eski metinleri temizle
    svg.selectAll(".heart-text").remove();

    // Merkezi hesapla
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Metin boyutu: ekranın yarısını kaplayacak şekilde (min boyutun %50'si)
        const fontSize = Math.floor(Math.min(window.innerWidth, window.innerHeight) * 0.16);

    // SVG text ekle (orta hiza)
    svg.append("text")
        .attr("class", "heart-text")
        .attr("x", centerX)
        .attr("y", centerY)
        .attr("fill", TEXT_COLOR) // sabitten al
        .style("font-weight", 900)
        .style("font-family", "Poppins, Inter, system-ui, sans-serif")
        .style("font-size", fontSize + "px")
        .style("letter-spacing", "0.015em")
        .style("filter", `drop-shadow(0 0 40px ${TEXT_COLOR}) drop-shadow(0 0 90px ${TEXT_COLOR}) drop-shadow(0 0 160px #fff)`)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("opacity", 0)
        .text(LANGUAGES[currentLangIdx].toUpperCase())
        .transition().duration(400).style("opacity", 1);

    // Erişilebilirlik: görünmez aria-live alanına yaz (love-container'ın içeriğini bozmaz)
    let live = document.getElementById("aria-live");
    if (!live) {
        live = document.createElement("div");
        live.id = "aria-live";
        live.setAttribute("aria-live", "polite");
        live.style.position = "absolute";
        live.style.left = "-9999px";
        live.style.width = "1px";
        live.style.height = "1px";
        live.style.overflow = "hidden";
        live.style.clip = "rect(1px, 1px, 1px, 1px)";
        document.body.appendChild(live);
    }
    live.textContent = LANGUAGES[currentLangIdx];
}

function resetState() {
    isAnimating = false;
    activeHeart = null;
    renderHearts();
    moveHearts();
}

// Particle sistemi (canvas)
const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");
let particles = [];
let particlePool = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    svg.attr("width", window.innerWidth).attr("height", window.innerHeight);
}
window.addEventListener("resize", () => {
    resizeCanvas();
    renderHearts();
});
resizeCanvas();

function startParticleSpawn(x, y, duration) {
    let spawnRate = 60;
    let elapsed = 0;
    let start = performance.now();
    function spawnLoop(now) {
        if (!isAnimating) return;
        elapsed = now - start;
        if (elapsed > duration) return;
        for (let i = 0; i < Math.floor(spawnRate * ((now - (spawnLoop.lastTime||now))/1000)); i++) {
            spawnParticle(x, y);
        }
        spawnLoop.lastTime = now;
        requestAnimationFrame(spawnLoop);
    }
    requestAnimationFrame(spawnLoop);
}

function spawnParticle(x, y) {
    let p = particlePool.pop() || {};
    p.x = x;
    p.y = y;
    let angle = Math.random() * 2 * Math.PI;
    let speed = 2 + Math.random() * 1.5;
    p.vx = Math.cos(angle) * speed;
    p.vy = Math.sin(angle) * speed;
    p.size = 8 + Math.random() * 8;
    p.color = PARTICLE_COLORS[Math.random() < 0.5 ? 0 : 1];
    p.life = 0;
    p.maxLife = 0.8 + Math.random() * 0.7;
    particles.push(p);
}

function updateParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life += dt/1000;
        if (p.life > p.maxLife) {
            particlePool.push(particles.splice(i, 1)[0]);
        }
    }
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let p of particles) {
        ctx.globalAlpha = 1 - (p.life / p.maxLife);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.bezierCurveTo(p.x - p.size/2, p.y - p.size/2, p.x - p.size, p.y + p.size/3, p.x, p.y + p.size);
        ctx.bezierCurveTo(p.x + p.size, p.y + p.size/3, p.x + p.size/2, p.y - p.size/2, p.x, p.y);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 16;
        ctx.fill();
    }
    ctx.globalAlpha = 1;
}

let lastTime = performance.now();
function particleLoop(now) {
    let dt = now - lastTime;
    lastTime = now;
    updateParticles(dt);
    drawParticles();
    requestAnimationFrame(particleLoop);
}
requestAnimationFrame(particleLoop);

// Başlat
renderHearts();
moveHearts();
