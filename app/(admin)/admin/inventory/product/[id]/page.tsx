"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Params = {
  id: string;
};
const page = () => {
  const params = useParams();
  const id = params.id;
  const [product, setProduct] = useState([]);
  const fetchProduct = async () => {
    const response = await axios.get("");
    setProduct(response.data.product);
  };
  useEffect(() => {
    fetchProduct();
  }, []);
  return (
    <div>
      {product.map((product: any, index: any) => (
        <div>{product.title}</div>
      ))}
    </div>
  );
};

export default page;
