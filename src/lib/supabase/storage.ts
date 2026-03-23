import { createClient } from "@/lib/supabase/client";
import { MAX_PHOTOS } from "@/lib/constants";

/** 허용되는 이미지 MIME 타입 */
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];

/** 최대 파일 크기 (5MB) */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Supabase Storage에 사진을 업로드하고 공개 URL을 반환한다.
 * @param file - 업로드할 이미지 파일
 * @param bucket - 스토리지 버킷 이름
 * @returns 공개 URL 또는 null (실패 시)
 */
export async function uploadPhoto(
  file: File,
  bucket: string = "record-photos"
): Promise<string | null> {
  // 파일 타입 검증
  if (!ALLOWED_TYPES.includes(file.type)) {
    console.error("[storage/uploadPhoto] 지원하지 않는 파일 형식:", file.type);
    return null;
  }

  // 파일 크기 검증
  if (file.size > MAX_FILE_SIZE) {
    console.error("[storage/uploadPhoto] 파일 크기 초과:", file.size);
    return null;
  }

  try {
    const supabase = createClient();

    // 고유한 파일 경로 생성 (타임스탬프 + 랜덤)
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // Supabase Storage에 업로드
    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (error) {
      console.error("[storage/uploadPhoto] 업로드 실패:", error.message);
      return null;
    }

    // 공개 URL 생성
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
    return urlData.publicUrl;
  } catch (error) {
    console.error("[storage/uploadPhoto] 예외 발생:", error);
    return null;
  }
}

/**
 * 여러 사진을 동시에 업로드한다.
 * @param files - 업로드할 파일 배열
 * @param bucket - 스토리지 버킷 이름
 * @returns 업로드 성공한 URL 배열
 */
export async function uploadPhotos(
  files: File[],
  bucket: string = "record-photos"
): Promise<string[]> {
  // 최대 사진 수 제한
  const limitedFiles = files.slice(0, MAX_PHOTOS);

  // 병렬 업로드
  const results = await Promise.all(
    limitedFiles.map((file) => uploadPhoto(file, bucket))
  );

  // null 제거 (실패한 항목 제외)
  return results.filter((url): url is string => url !== null);
}
