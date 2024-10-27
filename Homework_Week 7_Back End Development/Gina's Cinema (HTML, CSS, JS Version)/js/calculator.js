document.getElementById("ticketForm").addEventListener("submit", function (e) {
  e.preventDefault();
  calculatePrice();
});

// Validasi bahwa minimal satu tiket dipilih
document.querySelectorAll('input[type="number"]').forEach((input) => {
  input.addEventListener("change", validateTotalTickets);
});

function validateTotalTickets() {
  const adultQuantity =
    parseInt(document.getElementById("adultQuantity").value) || 0;
  const childQuantity =
    parseInt(document.getElementById("childQuantity").value) || 0;
  const submitButton = document.querySelector('button[type="submit"]');

  if (adultQuantity + childQuantity <= 0) {
    submitButton.disabled = true;
    showMessage("Pilih setidaknya satu tiket!", "warning");
  } else {
    submitButton.disabled = false;
    document.getElementById("message").innerHTML = "";
  }
}

function calculatePrice() {
  // Ambil nilai dari form
  const adultQuantity =
    parseInt(document.getElementById("adultQuantity").value) || 0;
  const childQuantity =
    parseInt(document.getElementById("childQuantity").value) || 0;
  const day = document.getElementById("day").value;

  // Validasi input
  if (adultQuantity + childQuantity <= 0) {
    showMessage("Pilih setidaknya satu tiket!", "danger");
    return;
  }

  // Hitung harga dasar
  const adultBasePrice = 50000 * adultQuantity;
  const childBasePrice = 30000 * childQuantity;

  // Tambah biaya weekend jika hari Sabtu atau Minggu
  const isWeekend = day === "saturday" || day === "sunday";
  const totalTickets = adultQuantity + childQuantity;
  const weekendCharge = isWeekend ? 10000 * totalTickets : 0;

  // Hitung subtotal
  const subtotal = adultBasePrice + childBasePrice + weekendCharge;

  // Hitung diskon jika subtotal lebih dari 150.000
  let discount = 0;
  if (subtotal > 150000) {
    discount = subtotal * 0.1;
  }

  const finalPrice = subtotal - discount;

  // Tampilkan hasil
  displayResults({
    adultQuantity,
    childQuantity,
    adultBasePrice,
    childBasePrice,
    weekendCharge,
    subtotal,
    discount,
    finalPrice,
    isWeekend,
  });

  showMessage("Pemesanan berhasil diproses!", "success");
}

// Format harga ke format Rupiah
function formatPrice(price) {
  return "Rp" + price.toLocaleString("id-ID");
}

function displayResults(results) {
  const priceInfo = document.getElementById("priceInfo");

  // Tampilkan tiket dewasa jika ada
  const adultPriceRow = document.getElementById("adultPriceRow");
  if (results.adultQuantity > 0) {
    document.getElementById("adultCount").textContent = results.adultQuantity;
    document.getElementById("adultPrice").textContent = formatPrice(
      results.adultBasePrice
    );
    adultPriceRow.style.display = "flex";
  } else {
    adultPriceRow.style.display = "none";
  }

  // Tampilkan tiket anak-anak jika ada
  const childPriceRow = document.getElementById("childPriceRow");
  if (results.childQuantity > 0) {
    document.getElementById("childCount").textContent = results.childQuantity;
    document.getElementById("childPrice").textContent = formatPrice(
      results.childBasePrice
    );
    childPriceRow.style.display = "flex";
  } else {
    childPriceRow.style.display = "none";
  }

  // Tampilkan biaya weekend jika berlaku
  const weekendRow = document.getElementById("weekendRow");
  if (
    results.isWeekend &&
    (results.adultQuantity > 0 || results.childQuantity > 0)
  ) {
    document.getElementById("weekendCharge").textContent = formatPrice(
      results.weekendCharge
    );
    weekendRow.style.display = "flex";
  } else {
    weekendRow.style.display = "none";
  }

  // Tampilkan subtotal
  document.getElementById("subtotalPrice").textContent = formatPrice(
    results.subtotal
  );

  // Tampilkan diskon jika ada
  const discountRow = document.getElementById("discountRow");
  if (results.discount > 0) {
    document.getElementById("discountAmount").textContent =
      "-" + formatPrice(results.discount);
    document.getElementById("finalPrice").textContent = formatPrice(
      results.finalPrice
    );
    discountRow.style.display = "block";
  } else {
    discountRow.style.display = "none";
  }

  priceInfo.style.display = "block";
}

// Tampilkan pesan ke pengguna
function showMessage(message, type) {
  const messageDiv = document.getElementById("message");
  messageDiv.innerHTML = `<div class="alert alert-${type}">${message}</div>`;

  if (type === "success") {
    setTimeout(() => {
      messageDiv.innerHTML = "";
    }, 3000);
  }
}

// Inisialisasi validasi form
validateTotalTickets();
