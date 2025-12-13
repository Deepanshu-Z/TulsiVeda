"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ProductType } from "../page";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import RemoveProduct from "./RemoveProductModal";
import { useSession } from "next-auth/react";
import { useDebouncedCallback } from "use-debounce";
import axios from "axios";
import EmptyCartPage from "./EmptyCart";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
type PropType = {
  loading: boolean;
  products: ProductType[];
  setProducts: Dispatch<SetStateAction<ProductType[]>>;
};
export type Details = {
  cartItemId: string;
  productId: number;
};

export const CartItems = ({ loading, products, setProducts }: PropType) => {
  const [coupon, setCoupon] = useState<boolean>(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [modal, setModal] = useState<boolean>(false);
  const [details, setDetails] = useState<Details>({
    cartItemId: "",
    productId: 0,
  });
  const router = useRouter();
  const { data: session, status } = useSession();
  useEffect(() => {
    const total = products.reduce((sum, p) => {
      const price = p.discountPrice ?? p.price;
      return sum + price * p.quantity;
    }, 0);

    setTotalAmount(total);
  }, [products]);

  const updateQuantity = async (
    productId: number,
    productQuantity: number,
    cartItemId: string
  ) => {
    const response = await axios.put("/api/cart/updatequantity", {
      cartItemId,
      productId,
      productQuantity,
    });

    if (response.data.success) console.log("Updated quantity in DB");
    else console.log("Failed to update quantity");
  };

  const debouncedServer = useDebouncedCallback(updateQuantity, 1000);
  const decreaseQuantity = (productId: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.productId !== productId) return p;
        if (p.quantity >= 1) {
          const updated = p.quantity - 1;
          if (updated == 0) {
            setModal(true);
            setDetails({
              cartItemId: p.cartItemId,
              productId: p.productId,
            });
            return p;
          }
          debouncedServer(p.productId, updated, p.cartItemId);
          return { ...p, quantity: updated };
        }

        if (p.quantity == 0) setModal(true);
        return p;
      })
    );
  };

  const increaseQuantity = (productId: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.productId !== productId) return p;
        debouncedServer(p.productId, p.quantity + 1, p.cartItemId);
        return { ...p, quantity: p.quantity + 1 };
      })
    );
  };

  if (products.length === 0 && !loading) {
    return <EmptyCartPage />;
  }

  if (products.length === 0 && status != "loading")
    return (
      <div className="p-10 space-y-4">
        <div className="bg-gray-200 h-6 w-1/3 rounded animate-pulse"></div>
        <div className="bg-gray-200 h-64 rounded animate-pulse"></div>
        <div className="bg-gray-200 h-4 w-1/2 rounded animate-pulse"></div>
      </div>
    );

  return (
    <div className="overflow-x-hidden lg:max-w-5xl max-lg:max-w-2xl mx-auto  ">
      <div className="grid w-screen lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2    p-6 rounded-md">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="cursor-pointer " />
            </Button>
            {/* <p className=" font-semibold text-slate-900 ">Back to Home</p> */}
            <h3 className="text-lg font-semibold text-slate-900 ">Your Cart</h3>
          </div>
          <hr className="border-gray-300 mt-4 mb-8" />

          {products.map((p: ProductType, i: number) => {
            const price = p.discountPrice ?? p.price;

            return (
              <div key={i} className="bg-white sm:space-y-6 space-y-8">
                <div className="grid sm:grid-cols-3 items-center gap-4">
                  <div className="sm:col-span-2 flex sm:items-center max-sm:flex-col gap-6">
                    <div className="w-40 h-40 shrink-0 bg-white p-2 rounded-md">
                      <img
                        src={p.image[0]}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div>
                      <h4 className="text-[25px] font-semibold text-slate-900">
                        {p.name}
                      </h4>

                      <h6
                        onClick={() => {
                          setModal(true);

                          setDetails({
                            cartItemId: p.cartItemId,
                            productId: p.productId,
                          });
                        }}
                        className="text-xs font-medium text-red-500 cursor-pointer mt-1"
                      >
                        Remove
                      </h6>

                      <div className="flex gap-4 mt-4">
                        <div>
                          <div className="flex items-center px-2.5 py-1.5 border border-gray-300 text-slate-900 text-xs rounded-md">
                            {/* minus */}
                            <span
                              onClick={() => decreaseQuantity(p.productId)}
                              className="cursor-pointer"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-2.5 fill-current"
                                viewBox="0 0 124 124"
                              >
                                <path d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z" />
                              </svg>
                            </span>

                            <span className="mx-3">{p.quantity}</span>

                            {/* plus */}
                            <span
                              onClick={() => increaseQuantity(p.productId)}
                              className="cursor-pointer"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-2.5 fill-current"
                                viewBox="0 0 42 42"
                              >
                                <path d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PRICE */}
                  <div className="sm:ml-auto">
                    <h4 className="text-[15px] font-semibold text-slate-900">
                      ₹{price * p.quantity}
                    </h4>
                  </div>
                </div>
                <br />
              </div>
            );
          })}

          {/* ORDER DETAILS */}
          <div className="bg-white rounded-md p-6 md:sticky top-0 h-max">
            <h3 className="text-lg font-semibold text-slate-900">
              Order details
            </h3>
            <hr className="border-gray-300 mt-4 mb-8" />

            <ul className="text-slate-500 font-medium mt-8 space-y-4">
              <li className="flex flex-wrap gap-4 text-sm">
                Discount{" "}
                <span className="ml-auto text-slate-900 font-semibold"></span>
              </li>
              <li className="flex flex-wrap gap-4 text-sm">
                Shipping{" "}
                <span className="ml-auto text-slate-900 font-semibold">
                  ₹0.00
                </span>
              </li>
              <li className="flex flex-wrap gap-4 text-sm">
                Tax{" "}
                <span className="ml-auto text-slate-900 font-semibold">
                  ₹0.00
                </span>
              </li>
              <li className="flex flex-wrap gap-4 text-sm text-slate-900">
                Total{" "}
                <span className="ml-auto font-semibold">₹{totalAmount}</span>
              </li>
            </ul>
            <div className="mt-8 space-y-3">
              <Link href={"/checkout"}>
                <Button
                  type="button"
                  className="text-sm px-4 py-2.5 w-full font-medium tracking-wide bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer"
                >
                  Checkout
                </Button>
              </Link>
              <Link href={"/"}>
                <Button
                  type="button"
                  className="text-sm px-4 py-2.5 w-full font-medium tracking-wide bg-transparent text-slate-900 hover:bg-white border border-gray-300 rounded-md cursor-pointer"
                >
                  Continue Shopping{" "}
                </Button>
              </Link>
            </div>
            <div className="mt-6">
              <p className="text-slate-900 text-sm font-medium mb-2">
                Do you have a promo code?
              </p>
              <div className="flex border border-blue-600 overflow-hidden rounded-md">
                <input
                  type="email"
                  placeholder="Promo code"
                  className="w-full outline-0 bg-white text-slate-600 text-sm px-4 py-2.5"
                />
                <Button
                  type="button"
                  className="flex items-center justify-center font-medium tracking-wide bg-blue-600 hover:bg-blue-700 px-4 text-sm text-white cursor-pointer"
                  onClick={(prev) => setCoupon(true)}
                >
                  Apply
                </Button>
              </div>
              {coupon && (
                <p className="text-red-500 font-bold">Coupon not valid</p>
              )}
            </div>
          </div>
        </div>
        {modal && (
          <RemoveProduct
            setProducts={setProducts}
            details={details}
            setDetails={setDetails}
            modal={modal}
            setModal={setModal}
          />
        )}
      </div>
    </div>
  );
};
