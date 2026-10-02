const project = document.body.dataset.project;

// Halaman utama: membuka proyek terpilih tanpa mencampur gaya dan fungsi teman lain.
if (project === 'home') {
  const names = ['abdul', 'abid', 'nouva', 'risky', 'selly'];
  const home = document.getElementById('home');
  const viewer = document.getElementById('viewer');
  const frame = document.getElementById('project-frame');
  let current = '';

  function route() {
    const name = location.hash.slice(1).toLowerCase();
    const selected = names.includes(name) ? name : 'home';
    if (selected === current) return;
    const previous = current;
    current = selected;
    const isHome = selected === 'home';
    home.hidden = !isHome;
    viewer.hidden = isHome;
    frame.removeAttribute('srcdoc');
    if (isHome) {
      frame.src = 'about:blank';
      document.title = 'Ucapan dari Teman | Project Pameran';
      if (previous !== 'home') document.querySelector(`a[href="#${previous}"]`)?.focus();
      return;
    }
    const author = selected[0].toUpperCase() + selected.slice(1);
    document.getElementById('author').textContent = author;
    frame.title = `Ucapan dari ${author}`;
    document.title = `${author} | Project Pameran`;
    const body = document.getElementById(`project-${selected}`).innerHTML;
    const css = new URL('style.css', location.href).href;
    const js = new URL('script.js', location.href).href;
    frame.srcdoc = `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${author}</title><link rel="stylesheet" href="${css}"></head><body data-project="${selected}">${body}<script src="${js}"><\/script></body></html>`;
    viewer.querySelector('a').focus();
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);
  route();
}

// Efek kertas untuk ucapan dan kado Nouva.
function confetti(options = {}) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let canvas = document.getElementById('canvas-confetti');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:999';
    document.body.append(canvas);
  }
  const context = canvas.getContext('2d');
  if (!context) return;
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  const colors = options.colors || ['#ffcc00', '#4caf50', '#ffffff'];
  const pieces = Array.from({ length: options.particleCount || 80 }, () => ({
    x: Math.random() * canvas.width,
    y: -Math.random() * canvas.height,
    speed: 3 + Math.random() * 4,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
  const started = performance.now();
  function draw(now) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (const piece of pieces) {
      piece.y += piece.speed;
      context.fillStyle = piece.color;
      context.fillRect(piece.x, piece.y, 6, 10);
    }
    if (now - started < 3000) requestAnimationFrame(draw);
    else context.clearRect(0, 0, canvas.width, canvas.height);
  }
  requestAnimationFrame(draw);
}

// Popup dan efek ketik Abdul dibuat lokal agar tidak perlu pustaka JavaScript eksternal.
function initializeBirthdayLibraries() {
  window.Swal = {
    mixin: defaults => ({
      fire: options => new Promise(resolve => {
        const settings = { ...defaults, ...options };
        const dialog = document.createElement('dialog');
        dialog.className = 'birthday-dialog';
        const image = document.createElement('img');
        image.src = settings.imageUrl;
        image.alt = '';
        const heading = document.createElement('h2');
        heading.textContent = settings.title;
        const message = document.createElement('p');
        message.innerHTML = settings.html || '';
        const actions = document.createElement('div');
        const confirm = document.createElement('button');
        confirm.textContent = settings.confirmButtonText || 'OK';
        function finish(isConfirmed) {
          dialog.close();
          dialog.remove();
          resolve({ isConfirmed });
        }
        confirm.addEventListener('click', () => finish(true));
        actions.append(confirm);
        if (settings.showCancelButton) {
          const cancel = document.createElement('button');
          cancel.textContent = settings.cancelButtonText || 'Batal';
          cancel.addEventListener('click', () => finish(false));
          actions.append(cancel);
        }
        dialog.addEventListener('cancel', event => {
          event.preventDefault();
          finish(false);
        });
        dialog.append(image, heading, message, actions);
        document.body.append(dialog);
        dialog.showModal();
      }),
    }),
  };
  window.TypeIt = class {
    constructor(selector, options) {
      this.element = document.querySelector(selector);
      this.options = options;
    }
    go() {
      this.element.innerHTML = this.options.strings.join('');
      const walker = document.createTreeWalker(this.element, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push({ node: walker.currentNode, text: walker.currentNode.textContent });
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        this.options.afterComplete?.();
        return this;
      }
      nodes.forEach(item => { item.node.textContent = ''; });
      let index = 0;
      let count = 0;
      const type = () => {
        if (index >= nodes.length) {
          this.options.afterComplete?.();
          return;
        }
        const item = nodes[index];
        item.node.textContent = item.text.slice(0, ++count);
        if (count >= item.text.length) { index++; count = 0; }
        setTimeout(type, this.options.speed || 54);
      };
      setTimeout(type, this.options.startDelay || 50);
      return this;
    }
  };
}
// Bagian Abdul: musik, slide ulang tahun, pilihan kado, dan pesan akhir yang diketik.
if (project === 'abdul') {
initializeBirthdayLibraries();
'use strict';

/* ===== Pengaturan (edit di sini) ===== */
const NAMA = 'Kamu';
const TOMBOL_YA = 'Mau';
const TOMBOL_TIDAK = 'Gamau';

/* ===== Elemen ===== */
const $ = (id) => document.getElementById(id);
const content = $('Content');
const pergeseran = $('pergeseran');
const tombol = $('Tombol');
const kalimat = $('kalimat');
const judul = $('teksnim');
const pesanAkhir = $('bq');
const stikerAkhir = $('fotostiker');

const audio = new Audio($('linkmp3').src);
const swals = Swal.mixin({
  allowOutsideClick: false,
  showConfirmButton: true,
  imageHeight: 90,
});

/* ===== Status ===== */
const totalPesan = pergeseran.children.length;
let sudahMulai = false;
let bisaGeser = false;
let slideSekarang = 1;
let jawabanSetuju = false;

function aturContent(marginTop) {
  content.style.opacity = 1;
  content.style.marginTop = marginTop;
}

/* ===== Tanggal di pojok kiri bawah ===== */
function pasangTanggal() {
  const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli',
                 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const sekarang = new Date();
  const el = document.createElement('div');
  el.className = 'tanggal';
  el.textContent = `${hari[sekarang.getDay()]}, ${sekarang.getDate()} ${bulan[sekarang.getMonth()]} ${sekarang.getFullYear()}`;
  content.appendChild(el);
}

/* ===== Hati berjatuhan ===== */
function hatiJatuh() {
  const hati = document.createElement('div');
  hati.className = 'fas fa-heart';
  hati.textContent = '♥';
  hati.style.left = Math.random() * 90 + 'vw';
  hati.style.animationDuration = Math.random() * 3 + 2 + 's';
  hati.addEventListener('animationend', () => hati.remove());
  document.body.appendChild(hati);
}

/* ===== Tahap 1: sentuh LOVE ===== */
$('loveIn').addEventListener('click', () => {
  if (sudahMulai) return;
  sudahMulai = true;
  audio.play().catch(() => {});

  ['loveIn', 'ftAwal', 'ket'].forEach((id) => {
    const el = $(id);
    el.style.transition = 'all .5s ease';
    el.style.opacity = 0;
  });
  setTimeout(mulaiPesan, 300);
});

function mulaiPesan() {
  ['loveIn', 'ftAwal', 'ket'].forEach((id) => { $(id).style.display = 'none'; });
  aturContent('10vh');
  setTimeout(() => {
    pergeseran.classList.add('tampil');
    setTimeout(munculkanTombol, 500);
  }, 200);
}

/* ===== Tahap 2: geser pesan ===== */
function munculkanTombol() {
  if (slideSekarang <= totalPesan) {
    tombol.classList.add('tampil');
    bisaGeser = true;
  }
}

function geser() {
  if (!bisaGeser) return;
  bisaGeser = false;
  tombol.classList.remove('tampil');

  if (slideSekarang === totalPesan) setTimeout(tanyaKado, 500);

  pergeseran.scrollLeft = slideSekarang * pergeseran.clientWidth;
  slideSekarang++;
  setTimeout(munculkanTombol, 500);
}

tombol.addEventListener('click', geser);
$('bodyblur').addEventListener('click', geser);

/* ===== Tahap 3: popup kado ===== */
async function tanyaKado() {
  const { isConfirmed } = await swals.fire({
    title: `${NAMA} Mau Kado Gak Nih? 🤭❤️`,
    imageUrl: $('fotostikerPopup').src,
    showCancelButton: true,
    confirmButtonText: TOMBOL_YA,
    cancelButtonText: TOMBOL_TIDAK,
  });

  if (isConfirmed) {
    await swals.fire({
      title: 'Tapi Boong! 🤣',
      html: 'Gajadi ngasih kado ah<br>soalnya kamu bau 😜❤️',
      imageUrl: $('fotostikerPopupCon').src,
    });
    jawabanSetuju = true;
  } else {
    await swals.fire({
      title: 'Yaaahh!',
      html: 'Yaudah kalo gamau 😜❤️',
      imageUrl: $('fotostikerPopupCan').src,
    });
  }
  tampilkanPesanAkhir();
}

/* ===== Tahap 4: pesan akhir ===== */
function tampilkanPesanAkhir() {
  if (!jawabanSetuju) $('klganti').innerHTML = 'Udah ah segitu aja 🤣<br><br>';
  const isi = kalimat.innerHTML;
  kalimat.innerHTML = '';

  aturContent('8vh');
  pergeseran.style.display = 'none';
  tombol.classList.remove('tampil');
  pesanAkhir.classList.add('tampil');

  setTimeout(() => ketikPesan(isi), 200);
  munculkanStiker();
}

function ketikPesan(isi) {
  new TypeIt('#kalimat', {
    strings: [isi],
    startDelay: 50,
    speed: 54,
    cursor: true,
    afterComplete: () => {
      kalimat.innerHTML = isi;
      setTimeout(munculkanJudul, 300);
    },
  }).go();
}

function munculkanJudul() {
  const pengganti = $('klganti');
  if (pengganti) pengganti.style.display = 'none';
  judul.classList.add('tampil');
  setTimeout(() => judul.classList.add('berdenyut'), 550);
  setInterval(hatiJatuh, 250);
}

function munculkanStiker() {
  Object.assign(stikerAkhir.style, { display: 'inline-flex', opacity: 0, transform: 'scale(0)' });
  setTimeout(() => {
    Object.assign(stikerAkhir.style, { opacity: 1, transform: 'scale(1)' });
  }, 250);
}

/* ===== Mulai ===== */
pasangTanggal();
aturContent('14vh');
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;700&family=Caveat&display=swap';
document.head.append(fontLink);

}

// Bagian Abid: membuka atau menutup pesan dan memunculkan hati.
if (project === 'abid') {
function showLove() {
    const message = document.getElementById("love-message");
    const button = document.querySelector(".button-love");

    message.classList.toggle("show");

    if (message.classList.contains("show")) {
        button.textContent = "Pesan Terbuka ❤️";

        
        for (let i = 0; i < 15; i++) {
            createHeart();
        }

    } else {
        button.textContent = "Buka Pesanku 💌";

        
        const paragraphs = message.querySelectorAll("p");

        paragraphs.forEach((paragraph) => {
            paragraph.style.animation = "none";

            
            paragraph.offsetHeight;

            paragraph.style.animation = "";
        });
    }
}


function createHeart() {
    const heart = document.createElement("div");

    heart.innerHTML = "❤️";

    heart.style.position = "fixed";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.bottom = "-30px";

    heart.style.fontSize =
        Math.random() * 15 + 15 + "px";

    heart.style.pointerEvents = "none";
    heart.style.zIndex = "999";

    document.body.appendChild(heart);

    heart.animate(
        [
            {
                transform: "translateY(0) rotate(0deg)",
                opacity: 1
            },
            {
                transform:
                    `translateY(-100vh) rotate(${Math.random() * 360}deg)`,
                opacity: 0
            }
        ],
        {
            duration: Math.random() * 2000 + 2500,
            easing: "ease-out"
        }
    );

    setTimeout(() => {
        heart.remove();
    }, 5000);
}
window.showLove = showLove;
}

// Bagian Nouva: membuka ucapan wisuda dan kado dengan efek kertas.
if (project === 'nouva') {
//Mengambil elemen tombol dan kotak ucapan dari HTML
const tombolBuka = document.getElementById('surprise-btn');
const kotakUcapan = document.getElementById('quotes-box');

//Menambahkan aksi ketika tombol diklik
tombolBuka.addEventListener('click', function() {

    //1. Menampilkan kotak ucapan yang tadinya tersembunyi 
    kotakUcapan.classList.remove('quotes-box-hidden');
    confetti();

    // 2. Menyembunyikan tombol setelah diklik agar rapi
    tombolBuka.style.display = 'none';
})

// Mengambil elemen kado dari HTML
const giftBtn = document.getElementById('gift-btn');
const giftBox = document.getElementById('gift-box');

// Fungsi ketika tombol kado diklik
if (giftBtn && giftBox) {
    giftBtn.addEventListener('click', () => {
        // Memunculkan kotak kado virtual
        giftBox.classList.remove('hidden');
        giftBtn.innerText = "Kado Telah Dibuka! 🔓";
        
        // Memunculkan efek ledakan kertas warna-warni khusus kado
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 80,
                spread: 60,
                colors: ['#4caf50', '#ffeb3b', '#ffffff']
            });
        }
    });
}


    
}

// Bagian Risky: memeriksa nama penerima, membuka kado, dan mengulang ucapan.
if (project === 'risky') {
function bukaKado() {

    // Mengambil data dari HTML

    let nama =
        document.getElementById("nama").value.trim();

    let gift =
        document.getElementById("gift");

    let message =
        document.getElementById("message");

    let judul =
        document.getElementById("judul");

    let reset =
        document.getElementById("reset");


    // Memeriksa nama

    if (nama === "") {

        document.getElementById('nama-error').hidden = false;
        document.getElementById('nama').focus();

        return;
    }


    document.getElementById('nama-error').hidden = true;

    // Mencegah kado dibuka berkali-kali

    if (
        gift.classList.contains("open")
    ) {

        return;
    }


    // Membuka kado

    gift.classList.add("open");


    // Mengubah judul pesan

    judul.textContent =
        "Untuk " + nama + " ❤️";


    // Menampilkan confetti

    buatConfetti();


    // Menampilkan pesan setelah
    // animasi kado selesai

    setTimeout(function() {

        message.style.display = "block";

        reset.style.display = "inline-block";


        // Scroll menuju pesan

        message.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }, 800);


}



/* =========================
   MEMBUAT CONFETTI
========================= */

function buatConfetti() {

    const simbol = [

        "❤️",
        "💖",
        "✨",
        "🎉",
        "🌸",
        "⭐",
        "💗",
        "🎊"

    ];


    // Membuat 100 confetti

    for (
        let i = 0;
        i < 100;
        i++
    ) {

        let confetti =
            document.createElement("div");


        // Memberikan class CSS

        confetti.classList.add(
            "confetti"
        );


        // Memilih simbol secara random

        confetti.innerHTML =
            simbol[
                Math.floor(
                    Math.random()
                    * simbol.length
                )
            ];


        // Posisi horizontal random

        confetti.style.left =
            Math.random() * 100 + "vw";


        // Ukuran random

        confetti.style.fontSize =
            (
                15 +
                Math.random() * 20
            ) + "px";


        // Kecepatan jatuh random

        confetti.style.animationDuration =
            (
                2 +
                Math.random() * 3
            ) + "s";


        // Delay random

        confetti.style.animationDelay =
            (
                Math.random() * 0.5
            ) + "s";


        // Masukkan confetti ke halaman

        document.body.appendChild(
            confetti
        );


        // Menghapus confetti
        // setelah animasi selesai

        setTimeout(function() {

            confetti.remove();

        }, 5000);

    }

}


/* =========================
   RESET KADO
========================= */

function resetKado() {

    let gift =
        document.getElementById("gift");

    let message =
        document.getElementById("message");

    let reset =
        document.getElementById("reset");


    // Menutup kembali kado

    gift.classList.remove("open");


    // Menyembunyikan pesan

    message.style.display = "none";


    // Menyembunyikan tombol reset

    reset.style.display = "none";


    // Kembali ke bagian atas

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


document.querySelector(".gift-container").addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); bukaKado(); } });
window.bukaKado = bukaKado;
window.resetKado = resetKado;
}

// Bagian Selly: menampilkan detail atau lokasi wisuda dan menyiapkan undangan WhatsApp.
if (project === 'selly') {
function lihatAcara() {

    document.getElementById("acara").style.display = "block";

    document.getElementById("lokasi").style.display = "none";
}


function lihatLokasi() {

    document.getElementById("lokasi").style.display = "block";

    document.getElementById("acara").style.display = "none";
}


function konfirmasi() {

    const pesan = `Halo! 

I invite you to my graduation ceremony ^_^

 Sabtu, 10 Oktober 2026
 08.00 WIB
 Gedung Sport Center

Your presence will be a special part of this moment!

See uuu guyss!`;


    const link =
        "https://wa.me/?text=" +
        encodeURIComponent(pesan);


    window.open(link, "_blank", "noopener,noreferrer");
}
window.lihatAcara = lihatAcara;
window.lihatLokasi = lihatLokasi;
window.konfirmasi = konfirmasi;
}
