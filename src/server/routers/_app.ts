import { router } from "../trpc";
import { categoriesRouter } from "./categories/get";
import { Deposits } from "./deposits";
import { Layanans } from "./layanans";
import { mainRouter } from "./main";
import { member } from "./member";
import { MembershipRouter } from "./membership/router";
import { Messages } from "./messages/message";
import { Methods } from "./methods/get";
import { order } from "./order";
import { Products } from "./products/routes";
import { subCategory } from "./sub-category";
import { subCategories } from "./subCategory/routes";
import { adminStats, PembelianAll } from "./transaction";
import { manualOrder } from "./transaction/manualOrder";
import { Vouchers } from "./voucher/routes";
import { WhatsappMessage } from "./whatsapp";

export const appRouter = router({
  main: mainRouter,
  categories: categoriesRouter,
  method: Methods,
  subCategory: subCategories,
  products: Products,
  layanans: Layanans,
  sub: subCategory,
  transaction: adminStats,
  order: order,
  manualOrder: manualOrder,
  membership: MembershipRouter,
  voucher: Vouchers,
  deposits: Deposits,
  pembelian: PembelianAll,
  messages: Messages,
  member: member,
  whatsapp: WhatsappMessage,
});

export type AppRouter = typeof appRouter;
