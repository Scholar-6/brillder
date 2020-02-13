export interface DragItem {
  type: string
  name: string
}
  
export interface DropResult {
  index: number
  value: number
  dropEffect: string
  allowedDropEffect: string
}
