import './globals.css';
import { Providers } from './providers'; 
 
export default function RootLayout()
{
  return (
    <html lang="en">
      <body>
        <Providers> 
          {children}
        </Providers>
      </body>
    </html>
  );
}