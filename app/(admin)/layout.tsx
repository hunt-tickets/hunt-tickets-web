import SidebarAdmin from "@/components/site/SidebarAdmin";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full items-start">
      <SidebarAdmin />
      {children ? (
        <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2 self-stretch overflow-y-auto bg-default-background">
          {children}
        </div>
      ) : null}
    </div>
  );
}
