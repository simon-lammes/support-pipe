export interface Issue {
  id: number;
  creatorId: number;
  title: string;
  description: string;
  doesRequireHelp: boolean;
  closedTimestamp?: string;
}
