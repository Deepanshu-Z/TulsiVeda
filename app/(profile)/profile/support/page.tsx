import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";

export default function page() {
  return (
    <div>
      {" "}
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="flex justify-center">Contact Support</CardTitle>
        </CardHeader>

        <CardContent className="flex justify-center ">
          <Link href={"/profile/support/submitticket"}>
            <Button>Create Ticket</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
