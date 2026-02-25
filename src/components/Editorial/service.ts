import api from "@/lib/api/axios";

export interface Editorial {
  id: number;
  name: string;
  designation: string;
  company_name: string;
  place: string;
  image: string;
  status: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface EditorialResponse {
  data: Editorial;
}

export async function getEditorial(): Promise<Editorial> {
  const response = await api.get<EditorialResponse>(
    "/editorial-settings"
  );
  return response.data.data;
}