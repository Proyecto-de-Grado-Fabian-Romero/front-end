export interface Tour360Request {
  publicId: string;
  environmentId: string;
  environmentName: string;
  ownerId: string;
  requestDate: number;
  scheduledDate?: number;
  status: number;
  technicianName?: string;
  notes?: string;
}
