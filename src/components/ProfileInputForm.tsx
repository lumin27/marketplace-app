"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { updateUser } from "@/lib/actions";
import { Edit, X } from "lucide-react";
import { toast } from "react-toastify";

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().optional(),
  profileImage: z.any().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileInputForm({ user }: { user: any }) {
  if (!user) {
    return null;
  }
  const [preview, setPreview] = useState<string>(user?.profileImageUrl || "");
  const [isPending, startTransition] = useTransition();
  const [isChanged, setIsChanged] = useState(false);
  const [update, setUpdate] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      phone: user?.phone || "",
    },
  });

  const watchedValues = watch();
  useEffect(() => {
    const hasChanges =
      watchedValues.fullName !== user.fullName ||
      watchedValues.phone !== user.phone ||
      preview !== (user.profileImageUrl || "");
    setIsChanged(hasChanges);
  }, [watchedValues, preview, user.fullName, user.phone, user.profileImageUrl]);

  const onSubmit = async (data: ProfileFormValues) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      if (data.phone) formData.append("phone", data.phone);
      if (data.profileImage?.[0])
        formData.append("profileImage", data.profileImage[0]);

      await updateUser(user.id, formData);
      setIsChanged(false);
      toast.success("Profile updated successfully");
    });
  };

  return (
    <div className='mx-auto md:w-1/2 shadow-lg rounded-xl relative p-8 border border-border mt-10 bg-[#0F2027] text-white'>
      {update ? (
        <button
          className='absolute top-4 right-4'
          onClick={() => history.back()}
          type='button'>
          <X className='h-6 w-6 text-white' />
        </button>
      ) : (
        <button
          className='absolute top-4 right-4'
          onClick={() => setUpdate(true)}
          type='button'>
          <Edit className='h-6 w-6 text-white' />
        </button>
      )}

      <h1 className='text-2xl font-semibold mb-6'>Edit Profile</h1>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <div>
          <label className='block text-sm font-medium mb-2'>
            Profile Image
          </label>
          <div className='flex items-center gap-4'>
            <Image
              src={preview && preview.length > 0 ? preview : "/noAvatar.png"}
              alt='Profile preview'
              width={80}
              height={80}
              className='rounded-full object-cover border border-border'
            />
            <input
              type='file'
              accept='image/*'
              disabled={!update}
              {...register("profileImage")}
              className='text-sm text-muted-foreground file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground file:cursor-pointer hover:file:bg-primary/90'
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setPreview(URL.createObjectURL(file));
              }}
            />
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium mb-1 text-muted-foreground'>
            Full Name
          </label>
          <input
            disabled={!update}
            type='text'
            {...register("fullName")}
            className='w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary text-foreground'
          />
          {errors.fullName && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <label className='block text-sm font-medium mb-1 text-muted-foreground'>
            Phone Number
          </label>
          <input
            disabled={!update}
            type='text'
            {...register("phone")}
            className='w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary text-foreground'
          />
          {errors.phone && (
            <p className='text-red-500 text-sm mt-1'>{errors.phone.message}</p>
          )}
        </div>
        <button
          type='submit'
          disabled={isPending || !isChanged || !update}
          className='w-full bg-primary text-primary-foreground font-medium py-2 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'>
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
