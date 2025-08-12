import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full min-h-screen flex-col items-start bg-black">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
