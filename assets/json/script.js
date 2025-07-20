document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
  });

  const formUlasan = document.getElementById('form-ulasan');
  const listUlasan = document.getElementById('list-ulasan');

  function tampilkanUlasan(nama, ulasan) {
    const div = document.createElement('div');
    div.className = 'ulasan-item';
    div.innerHTML = `<strong>${nama}</strong><p>${ulasan}</p>`;
    listUlasan.prepend(div);
  }

  if (formUlasan) {
    formUlasan.addEventListener('submit', function (e) {
      e.preventDefault();
      const nama = this.nama.value.trim();
      const ulasan = this.ulasan.value.trim();
      if (!nama || !ulasan) return;

      const ulasanRef = firebase.database().ref('ulasan');
      const newUlasanRef = ulasanRef.push();
      newUlasanRef.set({
        nama,
        ulasan,
        waktu: new Date().toISOString()
      });

      this.reset();
    });
  }

  firebase.database().ref('ulasan').on('value', function(snapshot) {
    listUlasan.innerHTML = '';
    const data = snapshot.val();
    if (data) {
      const keys = Object.keys(data).reverse();
      keys.forEach(key => {
        const item = data[key];
        tampilkanUlasan(item.nama, item.ulasan);
      });
    }
  });


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


  const kartuData = [
    { aksara: "ᯀᯂᯮ", baca: "ahu" },
    { aksara: "ᯀ", baca: "a" },
    { aksara: "ᯘ", baca: "sa" },
    { aksara: "ᯋᯩ", baca: "wé" },
    { aksara: "ᯋ", baca: "wa" }
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

  loadFlipcard(current);

  // === CAROUSEL ===
  const track = document.querySelector('.carousel-track');
  if (track) {
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
  }

  window.playSound = function (id) {
    const audio = document.getElementById('audio-' + id);
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
  };
});
