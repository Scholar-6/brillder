export interface DragItem {
  type: string
  name: string
}
  
export interface DropResult {
  value: number
  dropEffect: string
  allowedDropEffect: string
}
