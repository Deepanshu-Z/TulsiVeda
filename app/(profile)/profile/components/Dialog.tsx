import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DialogDemo() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button className="cursor-pointer" variant="default">
            Open Dialog
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" defaultValue="81238XXXXX" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="house">House no./Building Name</Label>
              <Input id="house" name="house" defaultValue="" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="road">Road name/Area/ Colony</Label>
              <Input id="road" name="road" defaultValue="" />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="pincode">Pincode</Label>
              <Input id="pincode" name="pincode" defaultValue="" />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" defaultValue="" />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="state">State</Label>
              <select id="state" name="state" defaultValue="" />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
