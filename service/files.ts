import axiosInstance from "@/lib/axios";
import { File } from "@/interfaces/file";
class FileService {
  private readonly BASE_URL = "/api/v1/files";

  async list(): Promise<File[]> {
    const { data } = await axiosInstance.get<File[]>(`${this.BASE_URL}`);
    return data;
  }

  async update(fileId: string, params: {
    name?: string;
  }): Promise<File> {
    const { data } = await axiosInstance.put<File>(
      `${this.BASE_URL}/${fileId}`,
      params
    );
    return data;
  }

  async delete(fileId: string): Promise<void> {
    await axiosInstance.delete(`${this.BASE_URL}/${fileId}`);
  }
}

export const fileService = new FileService();