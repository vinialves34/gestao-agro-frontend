export interface IPaginationData {
  current_page: number
  last_page: number
  per_page: number
  total: number
  links: Link[]
}

interface Link {
  url: string | null
  label: string
  page: number | null
  active: boolean
}