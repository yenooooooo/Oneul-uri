import { createClient } from "@/lib/supabase/client";
import { MAX_PHOTOS } from "@/lib/constants";
import imageCompression from "browser-image-compression";

/** 허용되는 이미지 MIME 타입 (HEIC/HEIF 포함 + 빈값 허용 — iOS Safari 대응) */
const ALLOWED_TYPES = [
  "image/jpeg", "image/png", "image/webp",
  "image/heic", "image/heif", "image/heic-sequence",
];

/** 업로드 최대 파일 크기 — 압축 실패 시 원본 통과 한도 (20MB) */
const MAX_FILE_SIZE = 20 * 1024 * 1024;

/** 압축 후 목표 크기 (1.5MB) */
const COMPRESSION_TARGET_MB = 1.5;

/** 압축 후 최대 해상도 (긴 변 기준) */
const COMPRESSION_MAX_DIMENSION = 2048;

/**
 * 업로드 전 이미지를 자동 압축/리사이즈한다.
 * - HEIC/HEIF도 내부적으로 JPEG로 변환 (Canvas 기반)
 * - 실패 시 원본 파일을 그대로 반환하여 fallback
 * @param file - 원본 이미지 파일
 * @returns 압축된 File (실패 시 원본)
 */
async function compressImage(file: File): Promise<File> {
  try {
    const compressed = await imageCompression(file, {
      maxSizeMB: COMPRESSION_TARGET_MB,
      maxWidthOrHeight: COMPRESSION_MAX_DIMENSION,
      useWebWorker: true,
      fileType: "image/jpeg", // HEIC 포함 JPEG로 통일
    });
    return compressed;
  } catch (error) {
    console.error("[storage/compressImage] 압축 실패, 원본 사용:", error);
    return file;
  }
}

/**
 * Supabase Storage에 사진을 업로드하고 공개 URL을 반환한다.
 * - 업로드 전 자동 압축 (최대 1.5MB / 긴 변 2048px)
 * - HEIC/HEIF는 JPEG로 변환
 * @param file - 업로드할 이미지 파일
 * @param bucket - 스토리지 버킷 이름
 * @returns 공개 URL 또는 null (실패 시)
 */
export async function uploadPhoto(
  file: File,
  bucket: string = "record-photos"
): Promise<string | null> {
  // 파일 타입 검증 — 일부 iOS 브라우저는 type이 빈 문자열인 경우가 있어 파일명 확장자도 보조 체크
  const isImageByType = file.type.startsWith("image/");
  const isImageByExt = /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name);
  if (!isImageByType && !isImageByExt) {
    console.error("[storage/uploadPhoto] 지원하지 않는 파일 형식:", file.type, file.name);
    return null;
  }
  if (file.type && !ALLOWED_TYPES.includes(file.type) && !isImageByExt) {
    console.error("[storage/uploadPhoto] 지원하지 않는 MIME:", file.type);
    return null;
  }

  // 업로드 전 자동 압축 (HEIC → JPEG, 대용량 → 1.5MB 목표)
  const processed = await compressImage(file);

  // 압축 후에도 너무 크면 차단 (20MB)
  if (processed.size > MAX_FILE_SIZE) {
    console.error("[storage/uploadPhoto] 압축 후에도 크기 초과:", processed.size);
    return null;
  }

  try {
    const supabase = createClient();

    // 고유한 파일 경로 생성 (타임스탬프 + 랜덤)
    // 압축 결과는 JPEG이므로 .jpg로 통일
    const ext = processed.type === "image/jpeg"
      ? "jpg"
      : (file.name.split(".").pop() || "jpg");
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // Supabase Storage에 업로드 — 압축된 파일 사용
    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, processed, { cacheControl: "3600", upsert: false });

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
