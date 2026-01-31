// import { Ratelimit } from "@upstash/ratelimit";
// import { Redis } from "@upstash/redis";


// const redis = new Redis({
//     url : process.env.UPSTASH_REDIS_REST_URL!,
//     token: process.env.UPSTASH_REDIS_REST_TOKEN!,
// });

// //login rate limit: 5 attempts per 15 min per IP

// export const loginRateLimit = new Ratelimit({
//     redis,
//     limiter: Ratelimit.slidingWindow(5, "15 m"),
//     analytics : true,
//     prefix: "ratelimit:login",
// });

// //Signup rate limit: 3 signup per hour per IP

// export const signupRateLimit = new Ratelimit({
//     redis,
//     limiter: Ratelimit.slidingWindow(3, "1 h"),
//     analytics: true,
//     prefix: "ratelimit:signup",
// });


// export const emailLoginRateLimit = new Ratelimit({
//     redis,
//     limiter: Ratelimit.slidingWindow(10, "1 h"),
//     analytics: true,
//     prefix: "ratelimit:email:login",
// });


import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create Redis instance
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Login rate limit: 5 attempts per 15 minutes per IP
export const loginRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  analytics: true,
  prefix: "ratelimit:login",
});

// Signup rate limit: 3 signups per hour per IP
export const signupRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  analytics: true,
  prefix: "ratelimit:signup",
});

// Email-based rate limit for login: 10 attempts per hour per email
export const emailLoginRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 h"),
  analytics: true,
  prefix: "ratelimit:email:login",
});
 