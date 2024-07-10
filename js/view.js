let objectCount = 0;
const maxObjects = 10;

function createFallingObject() {
  const container = document.getElementById("container");

  if (objectCount >= maxObjects) {
    // Reset ulang objek
    container.innerHTML = "";
    objectCount = 0;
  }

  const object = document.createElement("img");

  // Mengacak antara dua gambar
  const randomImage = Math.random() < 0.5 ? "img/X.png" : "img/O.png";
  object.src = randomImage;
  object.alt = "";
  object.classList.add("falling-object", "w-[50px]", "absolute");

  // Set posisi horizontal acak
  const randomLeft = Math.floor(Math.random() * window.innerWidth) + "px";
  object.style.left = randomLeft;

  container.appendChild(object);
  objectCount++;

  // Hapus objek setelah selesai animasi
  object.addEventListener("animationend", () => {
    object.remove();
    objectCount--;
  });
}

// Buat objek jatuh setiap 1 detik
setInterval(createFallingObject, 3000);
