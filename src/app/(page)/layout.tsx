import Menu from "@/components/Menu";
export default function HomeLayout({children}:{children:React.ReactNode}) {
    return (
        <div>
            <Menu/>
            <div className="md:pl-70 min-h-screen">
                {children}
            </div>
        </div>
    );
}