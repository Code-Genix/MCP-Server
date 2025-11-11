export const metadata = {
  title: 'Notes ChatGPT App',
  description: 'MCP Notes Server for ChatGPT',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


