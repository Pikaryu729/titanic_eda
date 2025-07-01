"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  sex: z.string(),
  pClass: z.string().min(1).max(3),
  age: z.string().min(1).max(99),
  fare: z.string().min(1).min(0).max(200000),
});

export default function SurvivalPredictForm() {
  const [survivalChance, setSurvivalChance] = useState<number | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sex: "male",
      pClass: "3",
      age: "18",
      fare: "1017",
    },
  });

  function revertTo1912Dollars(amountDollars: number) {
    return amountDollars * 0.03;
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch("https://129.153.180.132/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Pclass: values.pClass,
          Sex: values.sex,
          Age: Number(values.age),
          Fare: revertTo1912Dollars(Number(values.fare)),
        }),
      });
      if (!res.ok) {
        throw new Error("Request failed");
      }
      const data = await res.json();
      setSurvivalChance(data.survival_chance);
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-3xl mx-auto py-10"
        >
          <FormField
            control={form.control}
            name="sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sex</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Male or Female" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>What is your sex?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pClass"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Passenger Class</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Passenger class" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">
                      First Class ($4,591-$133,132)
                    </SelectItem>
                    <SelectItem value="2">Second Class (~$1,834)</SelectItem>
                    <SelectItem value="3">Third Class (~$1,017)</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  What Passenger Class would you be?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input placeholder="Age" type="number" {...field} />
                    </FormControl>
                    <FormDescription>How old are you?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-6">
              <FormField
                control={form.control}
                name="fare"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fare ($)</FormLabel>
                    <FormControl>
                      <Input placeholder="Fare in USD" type="" {...field} />
                    </FormControl>
                    <FormDescription>
                      How much are you paying to get on?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      {survivalChance ? (
        <h3 className="text-2xl text-center">
          Your chance of survival: {survivalChance}%
        </h3>
      ) : (
        ""
      )}
    </>
  );
}
