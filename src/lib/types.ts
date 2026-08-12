export type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN";
export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
export type ProviderCategory = "CLINIC" | "BARBER" | "SALON" | "FIELD" | "GYM" | "OTHER";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  image?: string;
  phone?: string;
  createdAt: string;
}

export interface Provider {
  id: string;
  userId: string;
  businessName: string;
  category: ProviderCategory;
  description: string;
  address: string;
  city: string;
  phone: string;
  rating: number;
  reviewCount: number;
  image: string;
  coverImage: string;
  isVerified: boolean;
  openTime: string;
  closeTime: string;
}

export interface Service {
  id: string;
  providerId: string;
  name: string;
  description: string;
  price: number;
  duration: number; // minutes
  image: string;
}

export interface Booking {
  id: string;
  userId: string;
  providerId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  providerId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface DB {
  users: User[];
  providers: Provider[];
  services: Service[];
  bookings: Booking[];
  reviews: Review[];
}
