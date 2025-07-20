document.addEventListener('DOMContentLoaded', () => {



    document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
  });

  const formUlasan = document.getElementById('form-ulasan');
  if (formUlasan) {
    formUlasan.addEventListener('submit', function (e) {
      e.preventDefault();
      const nama = this.nama.value;
      const ulasan = this.ulasan.value;
      const div = document.createElement('div');
      div.className = 'ulasan-item';
      div.innerHTML = `<strong>${nama}</strong><p>${ulasan}</p>`;
      document.getElementById('list-ulasan').prepend(div);
      this.reset();
    });
  }

  let kamus = {};
  fetch("assets/json/kamus.json")
    .then(res => res.json())
    .then(data => kamus = data)
    .catch(err => console.error("Gagal load kamus.json:", err));

  window.terjemahkan = function () {
    if (Object.keys(kamus).length === 0) {
      alert("Kamus belum dimuat, coba lagi.");
      return;
    }
    const input = document.getElementById('input-indo').value.toLowerCase().trim();
    const words = input.split(" ");
    let hasilLatin = [], hasilAksara = [];

    for (let word of words) {
      if (kamus[word]) {
        hasilLatin.push(kamus[word].batak);
        hasilAksara.push(kamus[word].aksara);
      } else {
        hasilLatin.push(`[${word}]`);
        hasilAksara.push(`[?]`);
      }
    }

    document.getElementById('batak-word').textContent = hasilLatin.join(" ");
    document.getElementById('aksara-batak').textContent = hasilAksara.join(" ");
  };

let currentSlide = 0;
const slides = document.querySelectorAll(".carousel-slide");

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });
}

  function nextSlide() {
    if (currentSlide === slides.length - 1) {
      goToSlide(0);
    } else {
      goToSlide(currentSlide + 1);
    }
  }

  function prevSlide() {
    if (currentSlide === 0) {
      goToSlide(slides.length - 1);
    } else {
      goToSlide(currentSlide - 1);
    }
  }

function toggleText(button) {
  const text = button.previousElementSibling;
  text.classList.toggle("expanded");
  button.textContent = text.classList.contains("expanded") ? "Tutup" : "Selengkapnya";
}

// Tampilkan slide pertama
showSlide(currentSlide);


  window.playSound = function (id) {
    const audio = document.getElementById('audio-' + id);
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
  };

  const kartuData = [
    { aksara: "ᯀᯂᯮ", baca: "ahu", soal: "ahu", jawaban: "ahu" },
    { aksara: "ᯀ", baca: "a", soal: "a", jawaban: "a" },
    { aksara: "ᯘ", baca: "sa", soal: "sa", jawaban: "sa" },
    { aksara: "ᯋᯩ", baca: "wé", soal: "wé", jawaban: "wé" },
    { aksara: "ᯋ", baca: "wa", soal: "wa", jawaban: "wa" }
  ];

  let current = 0;

  function buatFlipcard(data) {
    const flip = document.createElement("div");
    flip.className = "flipcard";
    flip.onclick = () => flip.classList.toggle("flipped");

    const front = document.createElement("div");
    front.className = "card-face card-front";
    front.textContent = data.aksara;

    const back = document.createElement("div");
    back.className = "card-face card-back";
    back.textContent = data.baca;

    flip.appendChild(front);
    flip.appendChild(back);
    return flip;
  }

  function loadFlipcard(index) {
    const container = document.getElementById("flipcard-container");
    if (!container) return;
    container.innerHTML = "";
    const card = buatFlipcard(kartuData[index]);
    container.appendChild(card);
  }

  window.nextFlipcard = function () {
    current = (current + 1) % kartuData.length;
    loadFlipcard(current);
  };



  window.nextQuestion = function () {
    current = (current + 1) % kartuData.length;
    loadSoal(current);
    loadFlipcard(current);
  };

  loadFlipcard(current);
  loadSoal(current);

});

document.querySelectorAll('.toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const parent = btn.closest('.carousel-text');
    parent.classList.toggle('expanded');
  });
});

// Carousel
const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
let currentIndex = 0;

function updateCarousel() {
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
}

document.getElementById('next').addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % slides.length;
  updateCarousel();
});

document.getElementById('prev').addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateCarousel();
});

// Expand / Collapse
document.querySelectorAll('.toggle-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    const textContent = this.previousElementSibling;
    textContent.classList.toggle('expanded');
    this.textContent = textContent.classList.contains('expanded')
      ? 'keyboard_arrow_up'
      : 'keyboard_arrow_down';
  });
});


