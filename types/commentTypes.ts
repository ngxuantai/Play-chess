export interface Comment {
    id: string;
    idParentCmt?: string;
    text: string;
    user: {
      id: number;
      username: string; 
    };
  }