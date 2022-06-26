export interface ServerSentEvent<Data> {
  data: Data;
  id?: string;
  type?: string;
  retry?: number;
}