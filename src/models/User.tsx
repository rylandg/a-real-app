export interface User {
  provider: string;
  id: string;
  displayName: string;
  emails?: string[];
  picture?: string;
}
