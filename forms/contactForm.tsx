import React from 'react';
import { useForm } from 'react-hook-form';
import { AddContactusRequest, AddContactusSchema } from '@/schema/contactus.schema';
import { yupResolver } from "@hookform/resolvers/yup";
import InputGroup from '@/components/common/input-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const ContactForm = () => {
  const form = useForm<AddContactusRequest>({
    resolver: yupResolver(AddContactusSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phonenumber: "",
      message: "",
      subject: ""
    },
  });

  const handleSubmit = (values: AddContactusRequest) => {
    // Handle form submission
    console.log(values);
  };

  // Common input class to reduce duplication
  const inputClass = 'text-xs border-b-black border-l-white border-r-white border-t-white rounded-none outline-none h-6 focus-visible:outline-none focus-visible:ring-0';

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
        <InputGroup>
          <FormField
            name="firstName"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className='text-xs'>First Name <span className='text-red-500'>*</span></FormLabel>
                <FormControl>
                  <Input {...field} className={inputClass} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="lastName"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className='text-xs'>Last Name <span className='text-red-500'>*</span></FormLabel>
                <FormControl>
                  <Input {...field} className={inputClass} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </InputGroup>
        <InputGroup>
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className='text-xs'>Email <span className='text-red-500'>*</span></FormLabel>
                <FormControl>
                  <Input type='email' {...field} className={inputClass} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="phonenumber"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className='text-xs'>Phone Number <span className='text-red-500'>*</span></FormLabel>
                <FormControl>
                  <Input type='tel' {...field} className={inputClass} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </InputGroup>
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className='text-xs'>Select Subject? <span className='text-red-500'>*</span></FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row gap-4"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Customer Care Enquiry (Toll Free)" />
                    </FormControl>
                    <FormLabel className="text-xs font-normal">
                      Customer Care Enquiry (Toll Free)
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Media Enquiry" />
                    </FormControl>
                    <FormLabel className="text-xs font-normal">
                      Media Enquiry
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Career Enquiry" />
                    </FormControl>
                    <FormLabel className="text-xs font-normal">Career Enquiry</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Investment Enquiry" />
                    </FormControl>
                    <FormLabel className="text-xs font-normal">Investment Enquiry</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="message"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className='text-xs'>Write your notes here <span className='text-red-500'>*</span></FormLabel>
              <FormControl>
                <Input>
                  <textarea
                    {...field}
                    className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </Input>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" className='bg-orange-500 text-white text-xs px-6 rounded-full hover:bg-orange-600'>
            Send Message
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ContactForm;
