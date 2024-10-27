<?php

// Fungsi untuk membaca input dari terminal
function readInput($prompt) {
    echo $prompt;
    return trim(fgets(STDIN));
}

// Fungsi untuk memvalidasi input numerik
function validateNumber($input) {
    return is_numeric($input) && $input >= 0;
}

// Fungsi untuk memvalidasi input hari
function validateDay($input) {
    $input = strtolower($input);
    return $input === 'weekday' || $input === 'weekend';
}

// Fungsi untuk menghitung harga tiket
function calculateTicketPrice($adultQuantity, $childQuantity, $isWeekend) {
    $adultPrice = 50000;
    $childPrice = 30000;
    $weekendSurcharge = $isWeekend ? 10000 : 0;
    
    $totalAdult = ($adultPrice + $weekendSurcharge) * $adultQuantity;
    $totalChild = ($childPrice + $weekendSurcharge) * $childQuantity;
    $totalPrice = $totalAdult + $totalChild;
    
    // Hitung diskon jika total melebihi 150000
    $discount = 0;
    if ($totalPrice > 150000) {
        $discount = $totalPrice * 0.1;
        $totalPrice -= $discount;
    }
    
    return [
        'totalPrice' => $totalPrice,
        'discount' => $discount,
        'adultTotal' => $totalAdult,
        'childTotal' => $totalChild,
        'priceBeforeDiscount' => $totalPrice + $discount
    ];
}

// Fungsi untuk format harga dalam Rupiah
function formatRupiah($amount) {
    return "Rp" . number_format($amount, 0, ',', '.');
}

// Main Program
echo "=== Sistem Pemesanan Tiket Bioskop ===\n\n";

// Input jumlah tiket dewasa
do {
    $adultQuantity = readInput("Masukkan jumlah tiket dewasa: ");
    if (!validateNumber($adultQuantity)) {
        echo "Input tidak valid. Masukkan angka 0 atau lebih.\n";
    }
} while (!validateNumber($adultQuantity));

// Input jumlah tiket anak
do {
    $childQuantity = readInput("Masukkan jumlah tiket anak-anak: ");
    if (!validateNumber($childQuantity)) {
        echo "Input tidak valid. Masukkan angka 0 atau lebih.\n";
    }
} while (!validateNumber($childQuantity));

// Validasi setidaknya ada 1 tiket yang dipesan
if ($adultQuantity == 0 && $childQuantity == 0) {
    echo "Error: Anda harus memesan minimal 1 tiket!\n";
    exit;
}

// Input hari pemesanan
do {
    $day = readInput("Masukkan hari pemesanan (weekday/weekend): ");
    if (!validateDay($day)) {
        echo "Input tidak valid. Masukkan 'weekday' atau 'weekend'.\n";
    }
} while (!validateDay($day));

$isWeekend = strtolower($day) === 'weekend';

// Hitung harga
$result = calculateTicketPrice($adultQuantity, $childQuantity, $isWeekend);

// Tampilkan ringkasan pemesanan
echo "\n=== Ringkasan Pemesanan ===\n";
echo "Tiket Dewasa: " . $adultQuantity . " tiket\n";
echo "Tiket Anak-anak: " . $childQuantity . " tiket\n";
echo "Hari Pemesanan: " . ucfirst($day) . "\n\n";

echo "Rincian Biaya:\n";
if ($adultQuantity > 0) {
    echo "Total Tiket Dewasa: " . formatRupiah($result['adultTotal']) . "\n";
}
if ($childQuantity > 0) {
    echo "Total Tiket Anak-anak: " . formatRupiah($result['childTotal']) . "\n";
}

if ($result['discount'] > 0) {
    echo "Subtotal: " . formatRupiah($result['priceBeforeDiscount']) . "\n";
    echo "Diskon (10%): -" . formatRupiah($result['discount']) . "\n";
}

echo "\nTotal Akhir: " . formatRupiah($result['totalPrice']) . "\n";

?>