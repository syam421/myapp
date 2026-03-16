import { z } from "zod";
import { users, files, folders, insertUserSchema } from "./schema";

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  unauthorized: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  auth: {
    register: {
      method: "POST" as const,
      path: "/api/auth/register" as const,
      input: z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().min(2),
      }),
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    login: {
      method: "POST" as const,
      path: "/api/auth/login" as const,
      input: z.object({
        email: z.string().email(),
        password: z.string(),
      }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: "POST" as const,
      path: "/api/auth/logout" as const,
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
    me: {
      method: "GET" as const,
      path: "/api/auth/me" as const,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  files: {
    list: {
      method: "GET" as const,
      path: "/api/files" as const,
      input: z.object({
        folderId: z.string().optional(),
        category: z.string().optional(),
        search: z.string().optional(),
        isFavorite: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof files.$inferSelect>()),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/files/:id" as const,
      responses: {
        200: z.custom<typeof files.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    update: {
      method: "PATCH" as const,
      path: "/api/files/:id" as const,
      input: z.object({
        filename: z.string().optional(),
        isFavorite: z.boolean().optional(),
        folderId: z.number().nullable().optional(),
      }),
      responses: {
        200: z.custom<typeof files.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: "DELETE" as const,
      path: "/api/files/:id" as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    }
  },
  folders: {
    list: {
      method: "GET" as const,
      path: "/api/folders" as const,
      input: z.object({
        parentId: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof folders.$inferSelect>()),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/folders" as const,
      input: z.object({
        name: z.string(),
        parentId: z.number().nullable().optional(),
      }),
      responses: {
        201: z.custom<typeof folders.$inferSelect>(),
      },
    },
    delete: {
      method: "DELETE" as const,
      path: "/api/folders/:id" as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  stats: {
    get: {
      method: "GET" as const,
      path: "/api/stats" as const,
      responses: {
        200: z.object({
          totalFiles: z.number(),
          totalSize: z.number(),
          categories: z.record(z.string(), z.number()), // space used by category
        }),
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
