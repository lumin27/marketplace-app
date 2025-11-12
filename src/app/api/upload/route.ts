import { getCloudinary } from "@/lib/cloudinary";
import { IncomingForm } from "formidable";
import { promises as fs } from "fs";
import { NextResponse } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const data: { fields: any; files: any } = await new Promise(
      (resolve, reject) => {
        const form = new IncomingForm({
          keepExtensions: true,
          multiples: true,
        });
        form.parse(req as any, (err, fields, files) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      }
    );

    let files = data.files.file;
    if (!files) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    files = Array.isArray(files) ? files : [files];

    const uploadResults = await Promise.all(
      files.map(async (file: any) => {
        const buffer = await fs.readFile(file.filepath);
        return new Promise<{ secure_url: string }>((resolve, reject) => {
          const uploadStream = getCloudinary().uploader.upload_stream(
            { folder: "blog_images" },
            (err, result) => {
              if (err || !result) reject(err || new Error("Upload failed"));
              else resolve(result);
            }
          );
          uploadStream.end(buffer);
        });
      })
    );

    const urls = uploadResults.map((r) => r.secure_url);
    return NextResponse.json({ urls }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
