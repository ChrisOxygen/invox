interface UserResult {
  success: boolean;
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
    country?: string | null;
    currency?: string | null;
    signature?: string | null;
    onboardingCompleted?: boolean;
  };
}

interface BasicResponse {
  success: boolean;
  message: string;
}
