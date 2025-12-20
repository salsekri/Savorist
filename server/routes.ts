import type { Express } from "express";
import { createServer, type Server } from "node:http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  await storage.seedData();

  app.get("/api/restaurants", async (_req, res) => {
    try {
      const restaurants = await storage.getRestaurants();
      res.json(restaurants);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch restaurants" });
    }
  });

  app.get("/api/restaurants/trending", async (_req, res) => {
    try {
      const restaurants = await storage.getTrendingRestaurants();
      res.json(restaurants);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trending restaurants" });
    }
  });

  app.get("/api/restaurants/nearby", async (_req, res) => {
    try {
      const restaurants = await storage.getNearbyRestaurants();
      res.json(restaurants);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch nearby restaurants" });
    }
  });

  app.get("/api/restaurants/search", async (req, res) => {
    try {
      const query = (req.query.q as string) || "";
      const restaurants = await storage.searchRestaurants(query);
      res.json(restaurants);
    } catch (error) {
      res.status(500).json({ error: "Failed to search restaurants" });
    }
  });

  app.get("/api/restaurants/filter", async (req, res) => {
    try {
      const cuisineType = req.query.cuisineType as string | undefined;
      const minRating = req.query.minRating
        ? parseFloat(req.query.minRating as string)
        : undefined;
      const priceRange = req.query.priceRange as string | undefined;

      const restaurants = await storage.filterRestaurants({
        cuisineType,
        minRating,
        priceRange,
      });
      res.json(restaurants);
    } catch (error) {
      res.status(500).json({ error: "Failed to filter restaurants" });
    }
  });

  app.get("/api/restaurants/:id", async (req, res) => {
    try {
      const restaurant = await storage.getRestaurant(req.params.id);
      if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
      }
      res.json(restaurant);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch restaurant" });
    }
  });

  app.get("/api/restaurants/:id/reviews", async (req, res) => {
    try {
      const reviews = await storage.getReviews(req.params.id);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  app.post("/api/restaurants/:id/reviews", async (req, res) => {
    try {
      const review = await storage.createReview({
        restaurantId: req.params.id,
        ...req.body,
      });
      res.json(review);
    } catch (error) {
      res.status(500).json({ error: "Failed to create review" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
