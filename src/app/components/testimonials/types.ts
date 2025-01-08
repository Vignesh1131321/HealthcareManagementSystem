export interface TestimonialData {
  author: string;
  rating: string;
  text: string;
}

export interface TestimonialCardProps {
  data: TestimonialData;
  size: "small" | "large";
}
