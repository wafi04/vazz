import Categories from "./categories";
import { BannerSlider } from "./banner";
import { PopularSection } from "./_components/popular";
import { CategoriesAll } from "./_components/categoriesAll";

export default async function Home() {
  return (
    <>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* banner */}
        <BannerSlider />
        {/* popular */}
        <section className="py-8">
          <PopularSection />
        </section>
        <CategoriesAll />
      </main>
    </>
  );
}
