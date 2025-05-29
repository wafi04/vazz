export interface Variable {
  key: string;
  label: string;
  example: string;
}

export interface MessageTemplate {
  category: string;
  templates: string[];
}

export interface MessageDetails {
  created_at: string;
  word_count: number;
  variables_used: string[];
  character_count: number;
}

export interface MessageWithDetails {
  id: number;
  title: string;
  text: string;
  details: MessageDetails;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// PENTING: Definisikan return type secara eksplisit
export interface GetAllMessagesResult {
  data: MessageWithDetails[];
  meta: PaginationMeta;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export interface FormData {
  title: string;
  text: string;
  details: {
    variables_used: string[];
    character_count: number;
    word_count: number;
    created_at: string;
  };
}

export interface FormMessagesProps {
  onSubmit?: (data: FormData) => void;
  initialData?: Partial<Pick<FormData, "title" | "text">>;
  isLoading?: boolean;
}

export type FormatType = "bold" | "italic" | "strikethrough";

// Input schemas
export interface GetMessagesInput {
  page: number;
  limit: number;
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "title";
  sortOrder?: "asc" | "desc";
}

export function parseMessageDetails(details: any): MessageDetails {
  if (typeof details === "string") {
    try {
      details = JSON.parse(details);
    } catch {
      return {
        created_at: new Date().toISOString(),
        word_count: 0,
        variables_used: [],
        character_count: 0,
      };
    }
  }

  return {
    created_at: details?.created_at || new Date().toISOString(),
    word_count: details?.word_count || 0,
    variables_used: Array.isArray(details?.variables_used)
      ? details.variables_used
      : [],
    character_count: details?.character_count || 0,
  };
}
