import Banner from "@/components/Banner";
import Menu from "@/components/Menu";
export default function Home() {
  return (
    <div>
      <Menu/>
      <div className="md:pl-70 min-h-screen">
          <Banner/>
      </div>
    </div>
  );
}
