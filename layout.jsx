
export const metadata = {
  title: 'GarageFlow',
  description: 'Garage door service SaaS',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
