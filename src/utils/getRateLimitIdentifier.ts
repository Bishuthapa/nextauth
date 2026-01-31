import { NextRequest } from "next/server";

export function getIpAddress(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const real = req.headers.get("x-real-ip");
  const cfConnecting = req.headers.get("cf-connecting-ip");
  
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  
  if (real) {
    return real.trim();
  }
  
  if (cfConnecting) {
    return cfConnecting.trim();
  }
  
  // FOR TESTING: Use a random IP in development
  if (process.env.NODE_ENV === "development") {
    return `192.168.1.${Math.floor(Math.random() * 255)}`;
  }
  
  return "127.0.0.1";
}



/*
On Custom Server:
Make sure your reverse proxy (Nginx, Apache) is configured to pass the real IP:
Nginx example:
location / {
    proxy_pass http://localhost:3000;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Real-IP $remote_addr;
}
*/