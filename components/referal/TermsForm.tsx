"use client";

// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
//import Link from "next/link";
import { ReferalForm } from "../forms/referalForm";

const TermsForm = () => {
  return (
    <section className="relative py-12">
      <div className="container mx-auto">
        <div className="bg-gray-100/50 md:px-12 p-6 lg:rounded-3xl rounded-2xl">
          {/* <form className="max-w-xl mx-auto space-y-10 text-center">
            <div className="space-y-4">              
              <Input id="name" type="text" placeholder="Name" className="w-full bg-white rounded-full" />
              <Input id="email" type="email" placeholder="Email" className="w-full bg-white rounded-full" />
              <div className="flex items-start gap-2 text-sm text-black">
                <Checkbox id="terms" className="border-black" />
                <label htmlFor="terms" className="">
                  I agree to the{" "}
                  <Link href="/terms" className="font-semibold underline">
                    Terms & Conditions
                  </Link>
                </label>
              </div>
            </div>
            
            <Button type="submit" className="w-full max-w-md rounded-full">
              Start referring
            </Button>
          </form> */}
          <ReferalForm/>
        </div>
      </div>
    </section>
  );
};

export default TermsForm;
