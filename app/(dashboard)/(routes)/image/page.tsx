"use client";

import { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Download, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-hot-toast";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import Heading from "@/components/headings";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { amountOptions, formSchema, resolutionOptions } from "./constant";
import EmptyPage from "@/components/empty";
import Loader from "@/components/loader";
import ImageEditor from "@/components/image-editor";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { SelectTrigger } from "@/components/ui/select";
import { Card, CardFooter } from "@/components/ui/card";
import { useProModal } from "@/hooks/use-pro-modal";

const ImagePage = () => {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [currentEditImageUrl, setCurrentEditImageUrl] = useState<string | null>(
    null
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      amount: "1",
      resolution: "512x512",
    },
  });

  const proModal = useProModal();

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setCurrentEditImageUrl(null);
      setImages([]);
      const response = await axios.post("/api/image", values);
      const urls = response.data.map((image: { url: string }) => image.url);
      setImages(urls);
      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        const errorMessage = error?.response?.data || "Something went wrong.";
        toast.error(errorMessage);
      }
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Image Generation"
        description="Turn your prompt into your image."
        icon={ImageIcon}
        iconColor="text-pink-700"
        bgColor="bg-pink-700/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid w-full grid-cols-12 gap-2 p-4 px-3 border rounded-lg md:px-4 focus-within:shadow-sm"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-6">
                    <FormControl className="p-0 m-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="A picture of the dolphin on the sea"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {amountOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="resolution"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {resolutionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <Button
                className="w-full col-span-12 lg:col-span-2"
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="mt-4 space-y-4">
          {isLoading && (
            <div className="flex items-start justify-center w-full p-20 rounded-lg bg-muted">
              <Loader />
            </div>
          )}
          {images.length === 0 && !isLoading && (
            <EmptyPage label="No images generated." />
          )}

          <div className="grid grid-cols-1 gap-4 mt-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {images.map((src, index) => (
              <Card key={src} className="overflow-hidden rounded-lg">
                <div className="relative aspect-square">
                  <Image
                    src={src}
                    alt={`Image ${index}`}
                    layout="responsive"
                    width={1024} // Adjust based on your needs
                    height={1024} // Adjust based on your needs
                    className="w-full h-auto md:w-auto md:h-auto" // Adjust these classes as needed
                  />
                </div>
                <CardFooter className="flex items-center justify-between p-2">
                  <Button
                    onClick={() => window.open(src)}
                    variant="secondary"
                    className="w-full mr-2"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    onClick={() => setCurrentEditImageUrl(src)} // Set the URL for editing
                    variant="secondary"
                    className="w-full"
                  >
                    Edit
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          {currentEditImageUrl && !isLoading && (
            <ImageEditor initialImageUrl={currentEditImageUrl} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagePage;
