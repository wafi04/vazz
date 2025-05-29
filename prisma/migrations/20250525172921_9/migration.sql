-- CreateTable
CREATE TABLE "beritas" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "tipe" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "beritas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deposits" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "metode" VARCHAR(50) NOT NULL,
    "deposit_id" TEXT,
    "no_pembayaran" TEXT NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "log" TEXT,

    CONSTRAINT "deposits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "footer" (
    "id" SERIAL NOT NULL,
    "nama_footer" TEXT NOT NULL,
    "url_footer" TEXT,
    "parent" INTEGER,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "footer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kategoris" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "sub_nama" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "kode" TEXT,
    "isChecknickname" BOOLEAN NOT NULL DEFAULT false,
    "server_id" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "thumbnail" TEXT NOT NULL,
    "tipe" TEXT NOT NULL DEFAULT 'game',
    "petunjuk" TEXT,
    "ket_layanan" TEXT,
    "ket_id" TEXT,
    "placeholder_1" TEXT NOT NULL,
    "placeholder_2" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "bannerlayanan" TEXT NOT NULL,

    CONSTRAINT "kategoris_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "layanans" (
    "id" SERIAL NOT NULL,
    "kategori_id" INTEGER NOT NULL,
    "sub_category_id" INTEGER NOT NULL DEFAULT 1,
    "provider_id" TEXT NOT NULL,
    "layanan" TEXT NOT NULL,
    "harga" INTEGER NOT NULL,
    "hargaFromDigi" INTEGER NOT NULL,
    "harga_reseller" INTEGER NOT NULL,
    "harga_platinum" INTEGER NOT NULL,
    "harga_flash_sale" INTEGER DEFAULT 0,
    "harga_suggest" INTEGER NOT NULL,
    "profit" INTEGER NOT NULL,
    "profit_reseller" INTEGER NOT NULL,
    "profit_platinum" INTEGER NOT NULL,
    "profit_sugggest" INTEGER NOT NULL,
    "profit_fixed" BOOLEAN NOT NULL DEFAULT false,
    "is_flash_sale" BOOLEAN NOT NULL DEFAULT false,
    "is_suggest" BOOLEAN NOT NULL DEFAULT false,
    "judul_flash_sale" VARCHAR(255),
    "banner_flash_sale" VARCHAR(255),
    "expired_flash_sale" DATE,
    "catatan" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "provider" TEXT NOT NULL,
    "product_logo" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "layanans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "methods" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(55) NOT NULL,
    "images" VARCHAR(250) NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "keterangan" VARCHAR(250) NOT NULL,
    "tipe" VARCHAR(225) NOT NULL,
    "min" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "type_tax" TEXT,
    "tax_admin" INTEGER,
    "min_expired" INTEGER DEFAULT 0,
    "max_expired" INTEGER DEFAULT 0,
    "max" INTEGER,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pembayarans" (
    "id" SERIAL NOT NULL,
    "order_id" TEXT NOT NULL,
    "harga" TEXT NOT NULL,
    "no_pembayaran" TEXT,
    "no_pembeli" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "metode" TEXT NOT NULL,
    "reference" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "pembayarans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pembelians" (
    "id" SERIAL NOT NULL,
    "order_id" TEXT NOT NULL,
    "username" TEXT,
    "user_id" TEXT,
    "zone" VARCHAR(50),
    "nickname" VARCHAR(100),
    "email_vilog" TEXT,
    "password_vilog" TEXT,
    "loginvia_vilog" TEXT,
    "layanan" TEXT NOT NULL,
    "harga" INTEGER NOT NULL,
    "profit" INTEGER NOT NULL,
    "profit_rupiah" INTEGER NOT NULL,
    "provider_order_id" TEXT,
    "status" VARCHAR(20) NOT NULL,
    "log" VARCHAR(1000),
    "sn" TEXT,
    "is_re_order" BOOLEAN NOT NULL DEFAULT false,
    "tipe_transaksi" VARCHAR(20) NOT NULL DEFAULT 'game',
    "is_digi" BOOLEAN NOT NULL,
    "ref_id" TEXT,
    "success_report_sended" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "pembelians_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PembelianManual" (
    "id" SERIAL NOT NULL,
    "order_id" TEXT,
    "pembelian_manual_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "nickname" TEXT,
    "harga" INTEGER NOT NULL,
    "profitRupiah" INTEGER NOT NULL,
    "profit" INTEGER NOT NULL,
    "zone" TEXT,
    "whatsapp" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "created_by" TEXT,
    "sn" TEXT,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PembelianManual_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "benefit" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_categories" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "sub_category_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "sub_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "whatsapp" VARCHAR(20),
    "balance" INTEGER NOT NULL,
    "role" VARCHAR(20) NOT NULL,
    "otp" VARCHAR(6),
    "api_key" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "last_payment_at" TIMESTAMP(3),
    "token" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "vouchers" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "discountType" TEXT NOT NULL,
    "discountValue" DOUBLE PRECISION NOT NULL,
    "maxDiscount" DOUBLE PRECISION,
    "minPurchase" DOUBLE PRECISION,
    "usageLimit" INTEGER,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "is_for_all_categories" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiry_date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vouchers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voucher_categories" (
    "id" SERIAL NOT NULL,
    "voucher_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "voucher_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voucher_usages" (
    "id" SERIAL NOT NULL,
    "voucher_id" INTEGER NOT NULL,
    "order_id" TEXT NOT NULL,
    "username" TEXT,
    "whatsapp" TEXT,
    "amount" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),

    CONSTRAINT "voucher_usages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_log" (
    "id" TEXT NOT NULL,
    "parentLogId" TEXT,
    "orderId" TEXT,
    "ref" TEXT,
    "type" VARCHAR(20) NOT NULL,
    "action" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "details" TEXT,
    "errorMessage" TEXT,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Messages" (
    "id" SERIAL NOT NULL,
    "title" CHAR(300) NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "beritas_tipe_idx" ON "beritas"("tipe");

-- CreateIndex
CREATE UNIQUE INDEX "deposits_deposit_id_key" ON "deposits"("deposit_id");

-- CreateIndex
CREATE INDEX "deposits_username_status_idx" ON "deposits"("username", "status");

-- CreateIndex
CREATE INDEX "deposits_status_created_at_idx" ON "deposits"("status", "created_at");

-- CreateIndex
CREATE INDEX "deposits_no_pembayaran_idx" ON "deposits"("no_pembayaran");

-- CreateIndex
CREATE INDEX "footer_parent_idx" ON "footer"("parent");

-- CreateIndex
CREATE UNIQUE INDEX "kategoris_kode_key" ON "kategoris"("kode");

-- CreateIndex
CREATE INDEX "kategoris_tipe_status_idx" ON "kategoris"("tipe", "status");

-- CreateIndex
CREATE INDEX "layanans_kategori_id_status_idx" ON "layanans"("kategori_id", "status");

-- CreateIndex
CREATE INDEX "layanans_sub_category_id_status_idx" ON "layanans"("sub_category_id", "status");

-- CreateIndex
CREATE INDEX "layanans_provider_id_status_idx" ON "layanans"("provider_id", "status");

-- CreateIndex
CREATE INDEX "layanans_is_flash_sale_expired_flash_sale_idx" ON "layanans"("is_flash_sale", "expired_flash_sale");

-- CreateIndex
CREATE INDEX "layanans_status_is_flash_sale_idx" ON "layanans"("status", "is_flash_sale");

-- CreateIndex
CREATE INDEX "methods_code_name_isActive_idx" ON "methods"("code", "name", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "pembayarans_order_id_key" ON "pembayarans"("order_id");

-- CreateIndex
CREATE INDEX "pembayarans_metode_idx" ON "pembayarans"("metode");

-- CreateIndex
CREATE INDEX "pembayarans_order_id_idx" ON "pembayarans"("order_id");

-- CreateIndex
CREATE INDEX "pembayarans_status_idx" ON "pembayarans"("status");

-- CreateIndex
CREATE INDEX "pembayarans_order_id_metode_status_idx" ON "pembayarans"("order_id", "metode", "status");

-- CreateIndex
CREATE UNIQUE INDEX "pembelians_order_id_key" ON "pembelians"("order_id");

-- CreateIndex
CREATE INDEX "pembelians_order_id_status_idx" ON "pembelians"("order_id", "status");

-- CreateIndex
CREATE INDEX "pembelians_username_created_at_idx" ON "pembelians"("username", "created_at");

-- CreateIndex
CREATE INDEX "pembelians_status_created_at_idx" ON "pembelians"("status", "created_at");

-- CreateIndex
CREATE INDEX "pembelians_order_id_username_status_idx" ON "pembelians"("order_id", "username", "status");

-- CreateIndex
CREATE INDEX "PembelianManual_order_id_idx" ON "PembelianManual"("order_id");

-- CreateIndex
CREATE INDEX "PembelianManual_status_idx" ON "PembelianManual"("status");

-- CreateIndex
CREATE INDEX "sub_categories_code_category_id_active_idx" ON "sub_categories"("code", "category_id", "active");

-- CreateIndex
CREATE INDEX "sub_categories_category_id_idx" ON "sub_categories"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_username_balance_idx" ON "users"("username", "balance");

-- CreateIndex
CREATE INDEX "users_role_balance_idx" ON "users"("role", "balance");

-- CreateIndex
CREATE INDEX "users_whatsapp_otp_idx" ON "users"("whatsapp", "otp");

-- CreateIndex
CREATE INDEX "users_username_role_whatsapp_idx" ON "users"("username", "role", "whatsapp");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "vouchers_code_key" ON "vouchers"("code");

-- CreateIndex
CREATE INDEX "vouchers_code_is_active_idx" ON "vouchers"("code", "is_active");

-- CreateIndex
CREATE INDEX "vouchers_expiry_date_idx" ON "vouchers"("expiry_date");

-- CreateIndex
CREATE INDEX "voucher_categories_voucher_id_idx" ON "voucher_categories"("voucher_id");

-- CreateIndex
CREATE INDEX "voucher_categories_category_id_idx" ON "voucher_categories"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "voucher_categories_voucher_id_category_id_key" ON "voucher_categories"("voucher_id", "category_id");

-- CreateIndex
CREATE INDEX "voucher_usages_voucher_id_idx" ON "voucher_usages"("voucher_id");

-- CreateIndex
CREATE INDEX "voucher_usages_order_id_idx" ON "voucher_usages"("order_id");

-- CreateIndex
CREATE INDEX "voucher_usages_username_idx" ON "voucher_usages"("username");

-- CreateIndex
CREATE INDEX "system_log_parentLogId_idx" ON "system_log"("parentLogId");

-- CreateIndex
CREATE INDEX "system_log_orderId_idx" ON "system_log"("orderId");

-- CreateIndex
CREATE INDEX "system_log_type_idx" ON "system_log"("type");

-- CreateIndex
CREATE INDEX "system_log_orderId_type_idx" ON "system_log"("orderId", "type");
