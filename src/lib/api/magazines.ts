import api from "./axios";
import { Magazine } from "../types.ts";
// Types


interface Paging {
  current_page: number;
  last_page: number;
  total: number;
}

interface PaginationMeta {
  paging: Paging;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}


export async function getMagazines(
  year_id?: number,
  page: number = 1,
  limit: number = 10,
  per_page: number = 10,
): Promise<PaginatedResponse<Magazine>> {

  try {
    const params: Record<string, number> = { page, limit, per_page };

    if (year_id) {
      params.year_id = year_id;
    }

    const response = await api.get("/magazines", { params });
    return response.data;

  } catch (error) {
    console.error("Error fetching magazines:", error);
    return {
      data: [],
      meta: {
        paging: {
          current_page: 1,
          last_page: 1,
          total: 0,
        },
      },
    };
  }
}



export async function getSingleMagazine(slugOrId: string): Promise<Magazine> {
  try {
    // Try direct endpoint first
  const response = await api.get(`/magazines/${slugOrId}`);

const result = response.data;

// handle all possible response shapes
const magazine =
  result?.data?.data ??
  result?.data ??
  result;

return magazine;

  } catch (error: any) {
    // If 404 → fallback to slug search
    if (error.response?.status === 404) {
      try {
        const listRes = await api.get("/magazines");
        const magazines: Magazine[] = listRes.data?.data ?? [];

        const magazine = magazines.find(
          (mag) => mag.slug === slugOrId || mag.id === parseInt(slugOrId, 10),
        );

        if (!magazine) {
          throw new Error(`Magazine "${slugOrId}" not found`);
        }

        return magazine;
      } catch (err) {
        console.error("Slug lookup failed:", err);
        throw err;
      }
    }

    console.error("Error:", error.message);
    throw error;
  }
}

export async function getLatestMagazines(options?: {
  skipId?: number | string;
  limit?: number;
}): Promise<Magazine[]> {
  try {
    const response = await api.get("/magazines", {
      params: {
        page: 1,
        limit: options?.limit ?? 5,
        latest: 1,        // ensure sorted latest
        skip_id: options?.skipId,
      },
    });

    const result = response.data;
    const magazines =
      result?.data?.data ?? result?.data ?? result ?? [];

    return magazines;
  } catch (error) {
    console.error("Error fetching latest magazines:", error);
    return [];
  }
}



export async function getLatestSingleMagazines(): Promise<Magazine | null> {
  try {
    const response = await api.get("/magazines", {
      params: {
        page: 1,
        limit: 1,
        latest: 1, // ensure latest order
      },
    });

    const result = response.data;
    const magazines =
      result?.data?.data ?? result?.data ?? result ?? [];

    return magazines[0] ?? null;
  } catch (error) {
    console.error("Error fetching latest magazine:", error);
    return null;
  }
}


// new code-------------

// import { skip } from "node:test";
// import api from "./axios";

// // Types
// interface Magazine {
//   id: number | string;
//   slug: string;
//   title: string;
//   image?: string;
//   magazine_name?: string;
//   description?: string;
// }

// interface PaginationMeta {
//   current_page: number;
//   last_page: number;
//   total: number;
// }

// interface PaginatedResponse<T> {
//   data: T[];
//   meta?: PaginationMeta;
// }

// export async function getMagazines(
//   year_id?: number,
//   page: number = 1,
//   limit: number = 10,
// ): Promise<PaginatedResponse<Magazine>> {
//   try {
//     const params: Record<string, number> = { page, limit };

//     if (year_id) {
//       params.year_id = year_id;
//     }

//     const response = await api.get("/magazines", { params });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching magazines:", error);
//     return {
//       data: [],
//       meta: { current_page: 1, last_page: 1, total: 0 },
//     };
//   }
// }

// export async function getSingleMagazine(slugOrId: string): Promise<Magazine> {
//   try {
//     // Try direct endpoint first
//     const response = await api.get(`/magazines/${slugOrId}`);
//     return response.data;
//   } catch (error: any) {
//     // If 404 → fallback to slug search
//     if (error.response?.status === 404) {
//       try {
//         const listRes = await api.get("/magazines");
//         const magazines: Magazine[] = listRes.data?.data ?? [];

//         const magazine = magazines.find(
//           (mag) => mag.slug === slugOrId || mag.id === parseInt(slugOrId, 10),
//         );

//         if (!magazine) {
//           throw new Error(`Magazine "${slugOrId}" not found`);
//         }

//         return magazine;
//       } catch (err) {
//         console.error("Slug lookup failed:", err);
//         throw err;
//       }
//     }

//     console.error("Error:", error.message);
//     throw error;
//   }
// }

// export async function getLatestMagazines(): Promise<Magazine[]> {
//   try {
//     const response = await api.get("/magazines", {
//       params: {
//         page: 1,
//         limit: 5,
//         sort: 'created_at',
//         latest: 1,
//         skip_id: 12,    // Latest first
//       },
//     });

//     const result = response.data;
//     const magazines = result?.data?.data ?? result?.data ?? result ?? [];
//     // console.log(magazines)
//     return magazines;
//   } catch (error) {
//     console.error("Error fetching latest magazines:", error);
//     return [];
//   }
// }

// export async function getLatestSingleMagazines(): Promise<Magazine | null> {
//   try {
//     const response = await api.get("/magazines", {
//       params: {
//         page: 1,
//         limit: 1,
//         sort: 'created_at',
//         latest: 1,    // Gets the absolute latest (no skip)
//       },
//     });

//     const result = response.data;
//     const magazine = result?.data?.data ?? result?.data ?? result ?? [];
//     console.log(magazine)
//     return magazine[0] ?? null;
//   } catch (error) {
//     console.error("Error fetching latest magazine:", error);
//     return null;
//   }
// }
