export interface categoryList {
  data: {
    createdAt: string;
    id: string;
    name: string;
    type: {
      id: string;
      name: string;
    };
  }[];
  currentPage: number;
  totalCategories: number;
  totalPages: number;
}

export interface typesList {
  id: string;
  name: string;
}
