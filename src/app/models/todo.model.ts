export interface ITodo {
  id?: string,
  description: string,
  createDate: Date,
  isCompleted: boolean,
  copletedDate: Date,
  deletedDate?: Date
}
