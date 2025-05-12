#!/bin/bash

# Konfigurasi koneksi - SESUAIKAN DENGAN HATI-HATI
HOST="103.127.98.128"
PORT="3306"
USER="root"  # Idealnya gunakan user read-only khusus untuk backup
PASSWORD="rootpassword" # Jangan gunakan password root atau user dengan akses penuh
DATABASE="vazzuniverse_local"

# Direktori untuk menyimpan hasil ekspor
EXPORT_DIR="./db"
DATE=$(date +%Y%m%d_%H%M%S)  # Format lebih lengkap untuk mencegah overwrite
FILENAME="backup_${DATABASE}_$DATE.sql"
FILEPATH="$EXPORT_DIR/$FILENAME"

# Buat direktori jika belum ada
mkdir -p $EXPORT_DIR

echo "Memulai ekspor database produksi $DATABASE dari $HOST:$PORT..."
echo "PERHATIAN: Ini adalah operasi pada database PRODUKSI."
echo "Tekan Ctrl+C dalam 5 detik untuk membatalkan jika ragu."
sleep 5

# Periksa apakah mysqldump terinstal
if ! command -v mysqldump &> /dev/null; then
    echo "ERROR: mysqldump tidak ditemukan."
    echo "MySQL client tools perlu diinstal untuk melanjutkan."
    echo "Untuk menginstal: apt-get update && apt-get install -y mysql-client"
    exit 1
fi

# Gunakan opsi yang aman untuk produksi
echo "Menjalankan ekspor dengan opsi yang aman untuk database produksi..."
mysqldump -h $HOST -P $PORT -u $USER -p$PASSWORD \
  --single-transaction \
  --quick \
  --lock-tables=false \
  --set-gtid-purged=OFF \
  --databases $DATABASE > "$FILEPATH"

# Periksa status eksekusi
if [ $? -eq 0 ]; then
    if [ -s "$FILEPATH" ]; then
        echo "✅ Database $DATABASE berhasil diekspor ke $FILEPATH"
        echo "   Ukuran file: $(du -h $FILEPATH | cut -f1)"
        
        # Tambahkan timestamp pada file
        CHECKSUM=$(md5sum "$FILEPATH" | cut -d' ' -f1)
        echo "   MD5 Checksum: $CHECKSUM"
        echo "   Timestamp: $(date)"
        
        # Atur izin file agar aman
        chmod 600 "$FILEPATH"
        
        echo
        echo "PENTING: File backup berisi data sensitif."
        echo "         Simpan dengan aman dan batasi akses."
    else
        echo "⚠️ PERINGATAN: File ekspor dibuat tetapi ukurannya 0 byte."
        echo "   Kemungkinan masalah koneksi atau izin database."
    fi
else
    echo "❌ ERROR: Ekspor database gagal."
    echo "   Periksa kredensial dan koneksi ke database."
fi