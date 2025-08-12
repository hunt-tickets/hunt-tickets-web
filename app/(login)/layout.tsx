
import LoginImg from "@/components/site/LoginImg";
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex w-full grow min-h-screen shrink-0 basis-0 flex-wrap items-start mobile:flex-col mobile:flex-wrap mobile:gap-0">
      {children}
      <LoginImg />
    </section>
  );
}
