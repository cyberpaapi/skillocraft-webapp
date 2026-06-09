'use client'
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import Link from "next/link";
import z from "zod";
import { AddReferalSchema } from "@/lib/validation/referal.schema";
import { Checkbox } from "../ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type AddReferalRequest = z.infer<typeof AddReferalSchema>;


export function ReferalForm () {
  const form = useForm<AddReferalRequest>({
    resolver: zodResolver(AddReferalSchema),
    defaultValues: {
      name: "",
      email: "",
      tandc: false,
    },
  });

  // const {mutate:addNote,isLoading} = useMutation({
  //     mutationKey:"addNote",
  //     mutationFn: (body:AddNoteRequest)=> axiosClient.post("/notes/add",body),
  //     async onSuccess() {
  //       toast.success("New note added successfully")
  //       router.push("/teacher/notes/list")
  //     },
  //     async onError(err:any) {
  //       toast.error(err.response.data.message)
  //     },
  //   })

  const handleSubmit = (values: AddReferalRequest) => {
    console.log("values is:",values)
    //addNote(values)
  };

  return (
    <Form {...form}>
      <form className="max-w-xl mx-auto space-y-4 text-center" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  {...field}
                  className="w-full bg-white rounded-full text-xs outline-none focus-visible:outline-none focus-visible:ring-0"
                  placeholder="name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  className="w-full bg-white rounded-full text-xs outline-none focus-visible:outline-none focus-visible:ring-0"
                  placeholder="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="tandc"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full flex-row flex space-x-3 space-y-0">
              <FormControl className="flex justify-center">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-x-3 leading-none">
                <FormLabel className="text-xs">
                I agree to <Link className="text-xs hover:underline" href="/examples/forms">Term & Conditions</Link>
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-center">
          <Button className="bg-orange-500 text-white text-xs px-6 rounded-full hover:bg-indigo-800 w-full max-w-md">
            {/* {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              "Save"
            )} */}
            start Refering
          </Button>
        </div>
      </form>
    </Form>
  );
};