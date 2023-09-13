import { userStore } from '../store/userStore';
console.log("🚀 ~ file: auth.ts:2 ~ userStore:", userStore)

export const token = localStorage.getItem('accessToken');
console.log("🚀 ~ file: auth.ts:4 ~ token:", token)


