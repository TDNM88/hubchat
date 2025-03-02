import { customAlphabet } from "nanoid"

// Create a custom nanoid function with a specific alphabet
export const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 10)

