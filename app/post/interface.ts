interface DataType {
  id: string;
  title: string;
  content: string;
  postedBy: string;
  postedAt: string;
  tags: string[]
}


interface Meta {
  itemCount: number;
  page: number;
  pageCount: number;
  take: number;
  search?: string;
  tags?: string | string[];
}
