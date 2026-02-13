import api from "@/lib/api/axios";

export interface Author {
  id: number;
  name: string;
  email?: string;
  slug?: string;
  image?: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Post {
  id: number;
  title: string;
  slug?: string;
  image?: string; // ✅ ADD THIS
  publish_date?: string;
  category?: Category;
  author?: Author;
}

export const get1LatestPost = async () => {
  const response = await api.get("/posts", {
    params: {
      limit: 1,
      latest: 1,
    },
  });
  // console.log(response)

  return response.data?.data?.[0] || response.data?.[0] || null;
};

export const get2LatestPost = async () => {
  const response = await api
    .get("/posts", {
      params: {
        limit: 2,
        latest: 1,
        skip_limit: 1,
      },
    })

  return response?.data?.data || [];
};

export const get4LatestPost = async () => {
  const response = await api.get("/posts", {
    params: {
      limit: 4,
      latest: 1,
      skip_limit: 3,
    },
  });

  // console.log("skip 3", response)
  return response?.data?.data || [];
};
