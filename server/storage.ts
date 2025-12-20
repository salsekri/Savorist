import {
  type Restaurant,
  type InsertRestaurant,
  type Review,
  type InsertReview,
  restaurants,
  reviews,
} from "@shared/schema";
import { db } from "./db";
import { eq, ilike, and, gte, or } from "drizzle-orm";

export interface IStorage {
  getRestaurants(): Promise<Restaurant[]>;
  getRestaurant(id: string): Promise<Restaurant | undefined>;
  searchRestaurants(query: string): Promise<Restaurant[]>;
  filterRestaurants(filters: {
    cuisineType?: string;
    minRating?: number;
    priceRange?: string;
  }): Promise<Restaurant[]>;
  getTrendingRestaurants(): Promise<Restaurant[]>;
  getNearbyRestaurants(): Promise<Restaurant[]>;
  createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant>;
  getReviews(restaurantId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  seedData(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getRestaurants(): Promise<Restaurant[]> {
    return db.select().from(restaurants);
  }

  async getRestaurant(id: string): Promise<Restaurant | undefined> {
    const [restaurant] = await db
      .select()
      .from(restaurants)
      .where(eq(restaurants.id, id));
    return restaurant || undefined;
  }

  async searchRestaurants(query: string): Promise<Restaurant[]> {
    return db
      .select()
      .from(restaurants)
      .where(
        or(
          ilike(restaurants.name, `%${query}%`),
          ilike(restaurants.cuisineType, `%${query}%`)
        )
      );
  }

  async filterRestaurants(filters: {
    cuisineType?: string;
    minRating?: number;
    priceRange?: string;
  }): Promise<Restaurant[]> {
    const conditions = [];

    if (filters.cuisineType && filters.cuisineType !== "All") {
      conditions.push(eq(restaurants.cuisineType, filters.cuisineType));
    }

    if (filters.minRating) {
      conditions.push(gte(restaurants.rating, String(filters.minRating)));
    }

    if (filters.priceRange) {
      conditions.push(eq(restaurants.priceRange, filters.priceRange));
    }

    if (conditions.length === 0) {
      return this.getRestaurants();
    }

    return db
      .select()
      .from(restaurants)
      .where(and(...conditions));
  }

  async getTrendingRestaurants(): Promise<Restaurant[]> {
    return db
      .select()
      .from(restaurants)
      .where(eq(restaurants.isTrending, 1));
  }

  async getNearbyRestaurants(): Promise<Restaurant[]> {
    return db.select().from(restaurants).limit(10);
  }

  async createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant> {
    const [newRestaurant] = await db
      .insert(restaurants)
      .values(restaurant)
      .returning();
    return newRestaurant;
  }

  async getReviews(restaurantId: string): Promise<Review[]> {
    return db
      .select()
      .from(reviews)
      .where(eq(reviews.restaurantId, restaurantId));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }

  async seedData(): Promise<void> {
    const existingRestaurants = await this.getRestaurants();
    if (existingRestaurants.length > 0) return;

    const sampleRestaurants: InsertRestaurant[] = [
      {
        name: "Bella Vista Italian",
        cuisineType: "Italian",
        description: "Experience authentic Italian cuisine in an elegant atmosphere. Our chefs use only the finest imported ingredients to create traditional dishes with a modern twist.",
        imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
        rating: "4.8",
        reviewCount: 234,
        priceRange: "$325",
        address: "123 Main Street, Downtown",
        phone: "+1 234 567 8900",
        distance: "0.3 km",
        isTrending: 1,
      },
      {
        name: "Sushi Zen",
        cuisineType: "Japanese",
        description: "Premium sushi and sashimi prepared by master chefs. Fresh fish flown in daily from Tokyo's famous Tsukiji market.",
        imageUrl: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=400",
        rating: "4.6",
        reviewCount: 189,
        priceRange: "$250",
        address: "456 Ocean Avenue",
        phone: "+1 234 567 8901",
        distance: "0.8 km",
        isTrending: 1,
      },
      {
        name: "Spice Garden",
        cuisineType: "Indian",
        description: "Authentic Indian flavors from across the subcontinent. From fiery vindaloos to creamy butter chicken, experience the diversity of Indian cuisine.",
        imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
        rating: "4.5",
        reviewCount: 156,
        priceRange: "$180",
        address: "789 Curry Lane",
        phone: "+1 234 567 8902",
        distance: "1.2 km",
        isTrending: 0,
      },
      {
        name: "Al Amir",
        cuisineType: "Arabian",
        description: "Traditional Middle Eastern cuisine with a royal touch. Savor our signature lamb dishes and freshly baked pita bread.",
        imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400",
        rating: "4.7",
        reviewCount: 198,
        priceRange: "$220",
        address: "321 Oasis Boulevard",
        phone: "+1 234 567 8903",
        distance: "0.5 km",
        isTrending: 1,
      },
      {
        name: "The American Grill",
        cuisineType: "American",
        description: "Classic American comfort food at its finest. Juicy steaks, gourmet burgers, and the best apple pie in town.",
        imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
        rating: "4.4",
        reviewCount: 312,
        priceRange: "$150",
        address: "555 Liberty Street",
        phone: "+1 234 567 8904",
        distance: "0.9 km",
        isTrending: 0,
      },
      {
        name: "Le Petit Bistro",
        cuisineType: "French",
        description: "Charming French bistro serving classic Parisian dishes. From coq au vin to crème brûlée, every dish tells a story.",
        imageUrl: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=400",
        rating: "4.9",
        reviewCount: 267,
        priceRange: "$380",
        address: "88 Rue de Paris",
        phone: "+1 234 567 8905",
        distance: "1.5 km",
        isTrending: 1,
      },
    ];

    for (const restaurant of sampleRestaurants) {
      const created = await this.createRestaurant(restaurant);

      const sampleReviews: InsertReview[] = [
        {
          restaurantId: created.id,
          reviewerName: "Jessica Williams",
          rating: 5,
          comment: "Amazing place! The ambiance was perfect for our anniversary dinner. Highly recommend the truffle risotto.",
          date: "15 Dec 2024",
        },
        {
          restaurantId: created.id,
          reviewerName: "Ruben Bator",
          rating: 4,
          comment: "Great food and service. The tiramisu was exceptional. Will definitely come back.",
          date: "12 Nov 2024",
        },
        {
          restaurantId: created.id,
          reviewerName: "Maria Siphon",
          rating: 5,
          comment: "Best restaurant in town! Fresh ingredients, authentic flavors, and wonderful staff.",
          date: "14 Nov 2024",
        },
      ];

      for (const review of sampleReviews) {
        await this.createReview(review);
      }
    }
  }
}

export const storage = new DatabaseStorage();
