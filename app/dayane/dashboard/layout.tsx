import NavbarAdmin from "@/components/navbar-admin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarAdmin />
      {children}
    </div>
  );
}
