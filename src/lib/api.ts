import axios from 'axios';

// Configuração base da API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Criar instância do axios
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// TIPOS
// ============================================

export interface User {
  id: string;
  email: string;
  name: string;
  user_type: 'adopter' | 'ong' | 'admin';
  cpf?: string;
  cnpj?: string;
  birth_date?: string;
  description?: string;
  city?: string;
  state?: string;
  phone?: string;
  created_at?: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  user_type: 'adopter' | 'ong' | 'admin';
  cpf?: string;
  cnpj?: string;
  birth_date?: string;
  description?: string;
  city?: string;
  state?: string;
  phone?: string;
}

export interface Pet {
  id: string;
  name: string;
  species: 'dog' | 'cat' | 'other';
  breed?: string;
  age_years?: number;
  age_months?: number;
  size: 'small' | 'medium' | 'large';
  gender: 'male' | 'female';
  description?: string;
  health_info?: string;
  temperament?: string;
  personality?: string; // Alias para temperament no banco
  photos?: string[];
  additional_images?: string[]; // Nome real do campo no banco
  image_url?: string;
  city: string;
  state: string;
  status: 'available' | 'in_process' | 'adopted';
  ong_id: string;
  ong_name?: string;
  ong_contact?: string;
  created_at?: string;
}

export interface AdoptionApplication {
  id: string;
  pet_id: string;
  user_id: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'cancelled';

  // Fields from joined view
  pet_name?: string;
  pet_image_url?: string;
  ong_name?: string;
  submitted_at?: string; // or created_at

  // Step 1
  has_experience: boolean;
  has_other_pets: boolean;
  other_pets_description?: string;

  // Step 2
  residence_type: 'house' | 'apartment' | 'farm' | 'other';
  has_yard: boolean;
  yard_fenced?: boolean;

  // Step 3
  family_agreed: boolean;
  can_afford_expenses: boolean;
  aware_of_responsibilities: boolean;

  // Step 4
  additional_info?: string;

  created_at?: string;
  updated_at?: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  pet_id: string;
  created_at: string;
  pet?: Pet; // Join result
}

// ============================================
// SERVIÇOS DE AUTENTICAÇÃO
// ============================================

export const authService = {
  async login(email: string, password: string, user_type: 'adopter' | 'ong' | 'admin'): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/auth/login', {
      email,
      password,
      user_type,
    });

    // Salvar token e usuário no localStorage
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));

    return data;
  },

  async register(userData: RegisterDto): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/auth/register', userData);

    // Salvar token e usuário no localStorage
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));

    return data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },
};

// ============================================
// SERVIÇOS DE USUÁRIOS
// ============================================

export const userService = {
  async getMe(): Promise<User> {
    const { data } = await api.get<User>('/users/me');
    return data;
  },

  async updateMe(userData: Partial<User>): Promise<User> {
    const { data } = await api.patch<User>('/users/me', userData);

    // Atualizar usuário no localStorage
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      localStorage.setItem('user', JSON.stringify({ ...currentUser, ...data }));
    }

    return data;
  },

  async getONGs(): Promise<User[]> {
    const { data } = await api.get<User[]>('/users/ongs');
    return data;
  },

  async getONGStatistics(ongId: string): Promise<any> {
    const { data } = await api.get(`/users/ong/${ongId}/statistics`);
    return data;
  },
};

// ============================================
// SERVIÇOS DE PETS
// ============================================

export const petService = {
  async getPets(params?: {
    species?: string;
    size?: string;
    city?: string;
    search?: string;
  }): Promise<Pet[]> {
    const { data } = await api.get<Pet[]>('/pets', { params });
    return data;
  },

  async getPetById(id: string): Promise<Pet> {
    const { data } = await api.get<Pet>(`/pets/${id}`);
    return data;
  },

  async getMyPets(): Promise<Pet[]> {
    const { data } = await api.get<Pet[]>('/pets/my-pets');
    return data;
  },

  async createPet(petData: Partial<Pet>): Promise<Pet> {
    const { data } = await api.post<Pet>('/pets', petData);
    return data;
  },

  async updatePet(id: string, petData: Partial<Pet>): Promise<Pet> {
    const { data } = await api.patch<Pet>(`/pets/${id}`, petData);
    return data;
  },

  async updatePetStatus(id: string, status: Pet['status']): Promise<Pet> {
    const { data } = await api.patch<Pet>(`/pets/${id}/status`, { status });
    return data;
  },

  async deletePet(id: string): Promise<void> {
    await api.delete(`/pets/${id}`);
  },
};

// ============================================
// SERVIÇOS DE CANDIDATURAS
// ============================================

export const applicationService = {
  async createApplication(applicationData: Partial<AdoptionApplication>): Promise<AdoptionApplication> {
    const { data } = await api.post<AdoptionApplication>('/applications', applicationData);
    return data;
  },

  async getMyApplications(): Promise<AdoptionApplication[]> {
    const { data } = await api.get<AdoptionApplication[]>('/applications');
    return data;
  },

  async getApplicationById(id: string): Promise<AdoptionApplication> {
    const { data } = await api.get<AdoptionApplication>(`/applications/${id}`);
    return data;
  },

  async updateApplicationStatus(
    id: string,
    status: AdoptionApplication['status']
  ): Promise<AdoptionApplication> {
    const { data } = await api.patch<AdoptionApplication>(`/applications/${id}/status`, { status });
    return data;
  },

  async deleteApplication(id: string): Promise<void> {
    await api.delete(`/applications/${id}`);
  },

  async getPetApplicationStats(petId: string): Promise<any> {
    const { data } = await api.get(`/applications/pet/${petId}/stats`);
    return data;
  },
};

// ============================================
// SERVIÇOS DE FAVORITOS
// ============================================

export const favoriteService = {
  async getFavorites(): Promise<Favorite[]> {
    const { data } = await api.get<Favorite[]>('/favorites');
    return data;
  },

  async getFavoriteIds(): Promise<string[]> {
    const { data } = await api.get<string[]>('/favorites/ids');
    return data;
  },

  async addFavorite(petId: string): Promise<Favorite> {
    const { data } = await api.post<Favorite>(`/favorites/${petId}`);
    return data;
  },

  async removeFavorite(petId: string): Promise<void> {
    await api.delete(`/favorites/${petId}`);
  },

  async checkIsFavorite(petId: string): Promise<boolean> {
    const { data } = await api.get<{ is_favorite: boolean }>(`/favorites/check/${petId}`);
    return data.is_favorite;
  },
};

// ============================================
// SERVIÇOS DE UPLOAD
// ============================================

export const uploadService = {
  async uploadPetImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await api.post<{ url: string }>('/upload/pet-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data.url;
  },
};

export const adminService = {
  async getDashboardStats(): Promise<any> {
    const { data } = await api.get('/admin/dashboard');
    return data;
  },

  async getAllUsers(): Promise<User[]> {
    const { data } = await api.get<User[]>('/admin/users');
    return data;
  },

  async createUser(userData: RegisterDto): Promise<User> {
    const { data } = await api.post<User>('/admin/users', userData);
    return data;
  },

  async updateUser(id: string, userData: Partial<User & { password?: string }>): Promise<User> {
    const { data } = await api.patch<User>(`/admin/users/${id}`, userData);
    return data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/admin/users/${id}`);
  },

  async getAllPets(): Promise<Pet[]> {
    const { data } = await api.get<Pet[]>('/admin/pets');
    return data;
  },

  async createPet(petData: Partial<Pet>): Promise<Pet> {
    const { data } = await api.post<Pet>('/admin/pets', petData);
    return data;
  },

  async updatePet(id: string, petData: Partial<Pet>): Promise<Pet> {
    const { data } = await api.patch<Pet>(`/admin/pets/${id}`, petData);
    return data;
  },

  async deletePet(id: string): Promise<void> {
    await api.delete(`/admin/pets/${id}`);
  },
};

export default api;
