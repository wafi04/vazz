import { router } from "../trpc";
import { categoriesRouter } from "./categories/get";
import { ConfigWeb } from "./config";
import { Deposits } from "./deposits";
import { Layanans } from "./layanans";
import { mainRouter } from "./main";
import { member } from "./member";
import { methods } from "./method";
import { Methods } from "./methods/get";
import { order } from "./order";
import { Products } from "./products/routes";
import { subCategory } from "./sub-category";
import { subCategories } from "./subCategory/routes";
import { adminStats, PembelianAll } from "./transaction";
import { Vouchers } from "./voucher/routes";
import { WhatsappMessage } from "./whatsapp";

export const appRouter = router({
  main: mainRouter,
  categories: categoriesRouter,
  method: Methods,
  subCategory: subCategories,
  methods: methods,
  products: Products,
  layanans: Layanans,
  sub: subCategory,
  transaction: adminStats,
  order: order,
  voucher: Vouchers,
  deposits: Deposits,
  setting: ConfigWeb,
  pembelian: PembelianAll,
  member: member,
  whatsapp: WhatsappMessage,
});

export type AppRouter = typeof appRouter;
