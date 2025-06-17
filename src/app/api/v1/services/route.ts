import { NextResponse } from "next/server";
import { Digiflazz } from "@/lib/digiflazz";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const username = process.env.DIGI_USERNAME;
    const apiKey = process.env.DIGI_API_KEY;

    if (!username || !apiKey) {
      return NextResponse.json(
        { error: "Missing API credentials" },
        { status: 500 }
      );
    }

    const digiflazz = new Digiflazz(username, apiKey);

    let rawResponse;
    try {
      rawResponse = await digiflazz.checkPrice();
    } catch (e) {
      return NextResponse.json(
        {
          error:
            "Failed to fetch price list: " +
            (e instanceof Error ? e.message : e),
        },
        { status: 500 }
      );
    }

    if (typeof rawResponse === "string") {
      try {
        rawResponse = JSON.parse(rawResponse);
      } catch (e) {
        return NextResponse.json(
          { error: "Failed to parse JSON response" },
          { status: 500 }
        );
      }
    }

    let dataArray: any;
    if (Array.isArray(rawResponse)) {
      dataArray = rawResponse;
    } else if (rawResponse?.data && Array.isArray(rawResponse.data)) {
      dataArray = rawResponse.data;
    } else if (
      rawResponse?.response?.data &&
      Array.isArray(rawResponse.response.data)
    ) {
      dataArray = rawResponse.response.data;
    } else {
      return NextResponse.json(
        { error: "Invalid response format - data array not found" },
        { status: 500 }
      );
    }

    const categories = await prisma.categories.findMany();
    if (categories.length === 0) {
      return NextResponse.json({
        message: "No categories to process",
        stats: { processed: 0, created: 0, updated: 0 },
      });
    }

    let stats = { processed: 0, created: 0, updated: 0 };
    let categoryMatches: Record<string, number> = {};

    // Solusi 1: Proses per batch untuk menghindari transaction timeout
    const BATCH_SIZE = 50; // Kurangi batch size untuk menghindari timeout
    
    for (const category of categories) {
      if (!category.brand) continue;

      let matchCount = 0;
      const matchingItems = dataArray.filter((item: any) => 
        item && 
        typeof item === "object" && 
        item.brand?.toUpperCase() === category.brand.toUpperCase()
      );

      // Process in smaller batches
      for (let i = 0; i < matchingItems.length; i += BATCH_SIZE) {
        const batch = matchingItems.slice(i, i + BATCH_SIZE);
        
        try {
          await prisma.$transaction(async (tx) => {
            for (const item of batch) {
              // Extract provider code dari buyer_sku_code
              const match = item.buyer_sku_code.match(/^([A-Z]+)/);
              const matchedProvider = match ? match[1] : item.buyer_sku_code;

              // Cari subcategory berdasarkan code
              const subCategory = await tx.subCategory.findFirst({
                where: {
                  code: matchedProvider,
                  categoryId: category.id,
                },
              });

              matchCount++;
              stats.processed++;

              const existingService = await tx.layanan.findFirst({
                where: { providerId: item.buyer_sku_code },
              });

              // Default profit settings
              let defaultProfits = {
                profit: 4,
                profitReseller: 3,
                profitPlatinum: 2,
                isProfitFixed: false,
              };

              if (item.category === "Voucher" || item.category === "PLN") {
                defaultProfits.isProfitFixed = true;
              }

              const hargaModal = item.price;
              let regularPrice, resellerPrice, platinumPrice;

              if (existingService) {
                // Hitung harga berdasarkan profit settings
                if (existingService.isProfitFixed) {
                  regularPrice = hargaModal + existingService.profit;
                  resellerPrice = hargaModal + existingService.profitReseller;
                  platinumPrice = hargaModal + existingService.profitPlatinum;
                } else {
                  regularPrice = Math.round(
                    hargaModal + (hargaModal * existingService.profit) / 100
                  );
                  resellerPrice = Math.round(
                    hargaModal + (hargaModal * existingService.profitReseller) / 100
                  );
                  platinumPrice = Math.round(
                    hargaModal + (hargaModal * existingService.profitPlatinum) / 100
                  );
                }

                // Update existing service
                await tx.layanan.update({
                  where: { id: existingService.id },
                  data: {
                    harga: regularPrice,
                    hargaFromDigi: hargaModal,
                    hargaReseller: resellerPrice,
                    hargaPlatinum: platinumPrice,
                    status: item.seller_product_status,
                    ...(subCategory && { subCategoryId: subCategory.id }),
                  },
                });
                stats.updated++;
              } else {
                // Hitung harga untuk service baru
                if (defaultProfits.isProfitFixed) {
                  regularPrice = hargaModal + defaultProfits.profit;
                  resellerPrice = hargaModal + defaultProfits.profitReseller;
                  platinumPrice = hargaModal + defaultProfits.profitPlatinum;
                } else {
                  regularPrice = Math.round(
                    hargaModal + (hargaModal * defaultProfits.profit) / 100
                  );
                  resellerPrice = Math.round(
                    hargaModal + (hargaModal * defaultProfits.profitReseller) / 100
                  );
                  platinumPrice = Math.round(
                    hargaModal + (hargaModal * defaultProfits.profitPlatinum) / 100
                  );
                }

                // Create new service
                await tx.layanan.create({
                  data: {
                    layanan: item.product_name,
                    kategoriId: category.id,
                    subCategoryId: subCategory?.id || 1,
                    providerId: item.buyer_sku_code,
                    harga: regularPrice,
                    hargaFromDigi: hargaModal,
                    hargaReseller: resellerPrice,
                    hargaPlatinum: platinumPrice,
                    hargaSuggest: 0,
                    profit: defaultProfits.profit,
                    profitReseller: defaultProfits.profitReseller,
                    profitPlatinum: defaultProfits.profitPlatinum,
                    isProfitFixed: defaultProfits.isProfitFixed,
                    profitSuggest: 0,
                    isSuggest: false,
                    catatan: item.desc || "",
                    status: item.seller_product_status,
                    provider: "digiflazz",
                    productLogo: null,
                    isFlashSale: false,
                  },
                });
                stats.created++;
              }
            }
          }, {
            timeout: 30000, // 30 detik timeout
            maxWait: 5000,  // 5 detik max wait
          });
        } catch (error) {
          console.error(`Batch processing error for category ${category.brand}:`, error);
          // Continue with next batch instead of failing completely
          continue;
        }
      }

      categoryMatches[category.brand] = matchCount;
    }

    return NextResponse.json({
      message: "Data processed successfully",
      stats,
      categoryMatches,
    });
  } catch (error: any) {
    console.error("Unhandled error in API route:", error);
    return NextResponse.json(
      {
        error: error.message || "Unknown error",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}