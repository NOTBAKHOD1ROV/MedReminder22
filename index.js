const medicineImages = {
  paracetamol: "img/paracetamol.jpg",
  ibuprofen: "img/iboprofen.webp",
  amoxicillin: "img/amoxicillin.png",
  aspirin: "img/aspirin.jpg"
};

function showImage() {
  const name  = document.getElementById("medicine").value.toLowerCase().trim();
  const img = document.getElementById("medicineImage");
  if (medicineImages[name]) {
    img.src = medicineImages[name];
    img.style.display = "block";
  } else {
    img.src = "img/default.jpg";
    img.style.display = "block";
  }
}

function setReminder() {
  const medicine = document.getElementById("medicine").value.trim();
  const time = document.getElementById("time").value;

  if (!medicine || !time) {
    alert("Iltimos, dori nomi va vaqtni kiriting.");
    return;
  }

  localStorage.setItem("reminder", JSON.stringify({ medicine, time }));
  document.getElementById("reminderText").textContent =
    `✅ ${medicine} uchun eslatma saqlandi: ${time}`;
}

function showNotification(medicine) {
  const icon = medicineImages[medicine.toLowerCase()] || "img/default.jpg";

  if (Notification.permission === "granted") {
    new Notification(`💊 ${medicine} ichish vaqti keldi!`, {
      body: "Iltimos, doringizni o‘z vaqtida iching.",
      icon: icon
    });
  }
}

function playSoundRepeatedly() {
  const audio = document.getElementById("alertSound");
  let count = 0;
  const interval = setInterval(() => {
    audio.play();
    count++;
    if (count >= 5) clearInterval(interval);
  }, 60000); // 1 daqiqa oralig‘ida 5 marta
}

setInterval(() => {
  const data = JSON.parse(localStorage.getItem("reminder"));
  if (data) {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    if (currentTime === data.time) {
      showNotification(data.medicine);
      playSoundRepeatedly();
    }
  }
}, 10000); // 10 sekundda tekshirish

// Notification ruxsatini so‘rash
if ("Notification" in window) {
  Notification.requestPermission();
}

Notification.requestPermission().then(permission => {
  if (permission === "granted") {
    console.log("Bildirishnoma ruxsati berildi.");
  } else {
    alert("Bildirishnoma uchun ruxsat kerak.");
  }
});
