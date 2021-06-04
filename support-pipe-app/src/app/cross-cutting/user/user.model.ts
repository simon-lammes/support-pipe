export interface User {
  id: number;
  givenName: string;
  familyName: string;
  subjectClaim: string;
  currentlySupportedIssueId: number;
  currentlyExhibitedIssueId: number;
}
