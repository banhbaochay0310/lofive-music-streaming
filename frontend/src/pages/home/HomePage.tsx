import Topbar from "@/components/Topbar";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect } from "react";
import FeaturedSection from "./components/FeaturedSection.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import SectionGrid from "./components/SectionGrid.tsx";

const HomePage = () => {
  const {
    fetchFeaturedSongs,
    fetchMadeForYouSongs,
    fetchTrendingSongs,
    isLoading,
    madeForYouSongs,
    featuredSongs,
    trendingSongs,
  } = useMusicStore();

  useEffect(() => {
    fetchFeaturedSongs();
    fetchMadeForYouSongs();
    fetchTrendingSongs();
  }, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs]);

  return (
    <main className="rounded-md overflow-hidden h-full bg-gradient-to-b from-green-900 to-zinc-800/40">
      <Topbar />
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">
            Good afternoon
          </h1>
          <FeaturedSection />
        </div>
        <div className="space-y-8">
          <SectionGrid title="Made For You" songs={madeForYouSongs} isLoading={isLoading}/>
          <SectionGrid title="Trending" songs={trendingSongs} isLoading={isLoading}/>

        </div>
      </ScrollArea>
    </main>
  );
};

export default HomePage;
