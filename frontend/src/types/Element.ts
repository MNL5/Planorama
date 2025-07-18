interface Element {
  id: string;
  type: "square" | "rectangle" | "circle";
  elementType: "text" | "table";
  label: string;
  width: number;
  height: number;
  x: number;
  y: number;
  color: string;
  seatCount?: number;
}

export default Element;
