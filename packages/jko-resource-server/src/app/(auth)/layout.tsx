export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-dvw h-dvh flex content-center justify-center">
      {children}
    </div>
  );
}
